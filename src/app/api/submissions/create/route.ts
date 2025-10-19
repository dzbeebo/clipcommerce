import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { getVideoMetadata, verifyVideoOwnership } from '@/lib/youtube'

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('CLIPPER')
    const { creatorId, videoUrl, videoId } = await request.json()

    if (!creatorId || !videoUrl || !videoId) {
      return NextResponse.json({ 
        error: 'Creator ID, video URL, and video ID are required' 
      }, { status: 400 })
    }

    // Get clipper profile
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id }
    })

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 })
    }

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { id: creatorId }
    })

    if (!creatorProfile) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Check if clipper is a member of this creator
    const membership = await prisma.clipperMembership.findUnique({
      where: {
        creatorId_clipperId: {
          creatorId: creatorId,
          clipperId: clipperProfile.id
        }
      }
    })

    if (!membership || membership.status !== 'ACTIVE') {
      return NextResponse.json({ 
        error: 'You are not an active member of this creator. Please apply to join first.' 
      }, { status: 403 })
    }

    // Verify video ownership
    const isOwner = await verifyVideoOwnership(videoId, clipperProfile.youtubeChannelId)
    if (!isOwner) {
      return NextResponse.json({ 
        error: 'You do not own this video. Only videos from your connected YouTube channel can be submitted.' 
      }, { status: 403 })
    }

    // Check if video is already submitted to this creator
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        youtubeVideoId_creatorId: {
          youtubeVideoId: videoId,
          creatorId: creatorId
        }
      }
    })

    if (existingSubmission) {
      return NextResponse.json({ 
        error: 'This video has already been submitted to this creator',
        submission: {
          id: existingSubmission.id,
          status: existingSubmission.status,
          submittedAt: existingSubmission.submittedAt
        }
      }, { status: 409 })
    }

    // Get video metadata
    const videoMetadata = await getVideoMetadata(videoId)

    // Calculate payment amount based on current views
    const paymentAmount = (videoMetadata.viewCount / creatorProfile.rateViews) * creatorProfile.rateAmount

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        creatorId: creatorId,
        clipperId: clipperProfile.id,
        youtubeVideoId: videoId,
        videoTitle: videoMetadata.title,
        videoThumbnail: videoMetadata.thumbnail,
        videoPublishedAt: new Date(videoMetadata.publishedAt),
        videoUrl: videoUrl,
        viewsAtSubmit: videoMetadata.viewCount,
        viewsCurrent: videoMetadata.viewCount,
        paymentAmount: paymentAmount,
        status: membership.autoApprove ? 'APPROVED' : 'PENDING'
      },
      include: {
        creator: {
          select: {
            displayName: true,
            slug: true,
            rateAmount: true,
            rateViews: true
          }
        },
        clipper: {
          select: {
            displayName: true
          }
        }
      }
    })

    // Update clipper submission count
    await prisma.clipperProfile.update({
      where: { id: clipperProfile.id },
      data: {
        totalSubmissions: {
          increment: 1
        }
      }
    })

    // Create notification for creator
    await prisma.notification.create({
      data: {
        userId: creatorProfile.userId,
        type: 'NEW_SUBMISSION',
        title: 'New Clip Submission',
        message: `${clipperProfile.displayName} submitted a new clip: "${videoMetadata.title}"`,
        actionUrl: `/dashboard/submissions/${submission.id}`
      }
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        videoTitle: submission.videoTitle,
        videoThumbnail: submission.videoThumbnail,
        viewsAtSubmit: submission.viewsAtSubmit,
        paymentAmount: submission.paymentAmount,
        status: submission.status,
        submittedAt: submission.submittedAt,
        creator: submission.creator,
        clipper: submission.clipper
      }
    })

  } catch (error) {
    console.error('Error creating submission:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Video not found')) {
        return NextResponse.json({ error: 'Video not found or is private' }, { status: 404 })
      }
      if (error.message.includes('Failed to fetch')) {
        return NextResponse.json({ error: 'Unable to verify video. Please try again.' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

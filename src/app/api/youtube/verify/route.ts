import { NextRequest, NextResponse } from 'next/server'
import { getVideoMetadata, extractVideoId, verifyVideoOwnership } from '@/lib/youtube'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only clippers can verify videos' }, { status: 403 })
    }

    const { videoUrl } = await request.json()

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Get clipper profile to verify ownership
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id }
    })

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 })
    }

    // Verify video ownership
    const isOwner = await verifyVideoOwnership(videoId, clipperProfile.youtubeChannelId)
    if (!isOwner) {
      return NextResponse.json({ 
        error: 'You do not own this video. Only videos from your connected YouTube channel can be submitted.' 
      }, { status: 403 })
    }

    // Get video metadata
    const videoMetadata = await getVideoMetadata(videoId)

    // Check if video is already submitted to any creator
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        youtubeVideoId: videoId
      },
      include: {
        creator: {
          select: {
            displayName: true,
            slug: true
          }
        }
      }
    })

    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        video: videoMetadata,
        alreadySubmitted: true,
        submittedTo: {
          creatorName: existingSubmission.creator.displayName,
          creatorSlug: existingSubmission.creator.slug,
          status: existingSubmission.status,
          submittedAt: existingSubmission.submittedAt
        }
      })
    }

    return NextResponse.json({
      success: true,
      video: videoMetadata,
      alreadySubmitted: false
    })

  } catch (error) {
    console.error('Error verifying video:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Video not found')) {
        return NextResponse.json({ error: 'Video not found or is private' }, { status: 404 })
      }
      if (error.message.includes('Failed to fetch')) {
        return NextResponse.json({ error: 'Unable to verify video. Please check the URL and try again.' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

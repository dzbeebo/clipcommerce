import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole('CREATOR')
    const { rejectionReason } = await request.json()
    const { id: submissionId } = await params

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Rejection reason is required' 
      }, { status: 400 })
    }

    // Get submission with related data
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        creator: {
          include: {
            user: true
          }
        },
        clipper: {
          include: {
            user: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Verify creator owns this submission
    if (submission.creator.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if submission is pending
    if (submission.status !== 'PENDING') {
      return NextResponse.json({ 
        error: 'Only pending submissions can be rejected' 
      }, { status: 400 })
    }

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        rejectionReason: rejectionReason.trim()
      },
      include: {
        creator: {
          select: {
            displayName: true,
            slug: true
          }
        },
        clipper: {
          select: {
            displayName: true
          }
        }
      }
    })

    // Recalculate clipper approval rate
    const clipperStats = await prisma.submission.aggregate({
      where: {
        clipperId: submission.clipperId
      },
      _count: {
        id: true
      }
    })

    const approvedCount = await prisma.submission.count({
      where: {
        clipperId: submission.clipperId,
        status: 'APPROVED'
      }
    })

    const approvalRate = clipperStats._count.id > 0 
      ? (approvedCount / clipperStats._count.id) * 100 
      : 0

    await prisma.clipperProfile.update({
      where: { id: submission.clipperId },
      data: {
        approvalRate: approvalRate
      }
    })

    // Create notification for clipper
    await prisma.notification.create({
      data: {
        userId: submission.clipper.userId,
        type: 'SUBMISSION_REJECTED',
        title: 'Clip Rejected',
        message: `Your clip "${submission.videoTitle}" was rejected by ${submission.creator.displayName}. Reason: ${rejectionReason}`,
        actionUrl: `/clipper/submissions/${submission.id}`
      }
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: updatedSubmission.id,
        status: updatedSubmission.status,
        reviewedAt: updatedSubmission.reviewedAt,
        rejectionReason: updatedSubmission.rejectionReason,
        creator: updatedSubmission.creator,
        clipper: updatedSubmission.clipper
      }
    })

  } catch (error) {
    console.error('Error rejecting submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

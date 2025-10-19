import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole('CREATOR')
    const submissionId = params.id

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
        error: 'Only pending submissions can be approved' 
      }, { status: 400 })
    }

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date()
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

    // Update clipper stats
    await prisma.clipperProfile.update({
      where: { id: submission.clipperId },
      data: {
        totalApproved: {
          increment: 1
        }
      }
    })

    // Recalculate approval rate
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
        type: 'SUBMISSION_APPROVED',
        title: 'Clip Approved!',
        message: `Your clip "${submission.videoTitle}" has been approved by ${submission.creator.displayName}`,
        actionUrl: `/clipper/submissions/${submission.id}`
      }
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: updatedSubmission.id,
        status: updatedSubmission.status,
        reviewedAt: updatedSubmission.reviewedAt,
        paymentAmount: updatedSubmission.paymentAmount,
        creator: updatedSubmission.creator,
        clipper: updatedSubmission.clipper
      }
    })

  } catch (error) {
    console.error('Error approving submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

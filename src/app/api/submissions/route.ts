import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const creatorId = searchParams.get('creatorId')

    const skip = (page - 1) * limit

    // Build where clause based on user role
    let whereClause: any = {}

    if (user.role === 'CREATOR') {
      whereClause = {
        creator: {
          userId: user.id
        }
      }
    } else if (user.role === 'CLIPPER') {
      whereClause = {
        clipper: {
          userId: user.id
        }
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status
    }

    // Add creator filter if provided (for clippers)
    if (creatorId && user.role === 'CLIPPER') {
      whereClause.creatorId = creatorId
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              slug: true,
              avatarUrl: true,
              rateAmount: true,
              rateViews: true
            }
          },
          clipper: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.submission.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      submissions: submissions.map(submission => ({
        id: submission.id,
        youtubeVideoId: submission.youtubeVideoId,
        videoTitle: submission.videoTitle,
        videoThumbnail: submission.videoThumbnail,
        videoUrl: submission.videoUrl,
        videoPublishedAt: submission.videoPublishedAt,
        viewsAtSubmit: submission.viewsAtSubmit,
        viewsCurrent: submission.viewsCurrent,
        status: submission.status,
        submittedAt: submission.submittedAt,
        reviewedAt: submission.reviewedAt,
        paymentAmount: submission.paymentAmount,
        platformFee: submission.platformFee,
        clipperNet: submission.clipperNet,
        rejectionReason: submission.rejectionReason,
        creator: submission.creator,
        clipper: submission.clipper
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

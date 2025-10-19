import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('CLIPPER')

    // Get clipper profile
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            creator: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                slug: true,
                rateAmount: true,
                rateViews: true,
              }
            }
          }
        },
        submissions: {
          include: {
            creator: {
              select: {
                displayName: true,
                avatarUrl: true,
              }
            }
          },
          orderBy: { submittedAt: 'desc' },
          take: 10
        }
      }
    })

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 })
    }

    // Calculate stats
    const totalEarned = clipperProfile.totalEarned
    const activeSubmissions = await prisma.submission.count({
      where: {
        clipperId: clipperProfile.id,
        status: 'PENDING'
      }
    })

    const approvedClips = clipperProfile.totalApproved
    const approvalRate = clipperProfile.approvalRate

    // Get recent activity
    const recentActivity = await prisma.submission.findMany({
      where: {
        clipperId: clipperProfile.id
      },
      include: {
        creator: {
          select: {
            displayName: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 5
    })

    // Calculate monthly growth
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const lastMonthEarnings = await prisma.transaction.aggregate({
      where: {
        submission: {
          clipperId: clipperProfile.id
        },
        status: 'SUCCEEDED',
        createdAt: {
          gte: lastMonth
        }
      },
      _sum: {
        clipperNet: true
      }
    })

    const currentMonthEarnings = lastMonthEarnings._sum.clipperNet || 0
    const previousMonthEarnings = totalEarned - currentMonthEarnings
    const growthPercentage = previousMonthEarnings > 0 
      ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100 
      : 0

    const newSubmissionsThisMonth = await prisma.submission.count({
      where: {
        clipperId: clipperProfile.id,
        submittedAt: {
          gte: lastMonth
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalEarned,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
        activeSubmissions,
        approvedClips,
        approvalRate,
        newSubmissionsThisMonth
      },
      creators: clipperProfile.memberships.map((membership: any) => ({
        id: membership.creator.id,
        displayName: membership.creator.displayName,
        avatarUrl: membership.creator.avatarUrl,
        slug: membership.creator.slug,
        rateAmount: membership.creator.rateAmount,
        rateViews: membership.creator.rateViews,
        joinedAt: membership.approvedAt
      })),
      recentActivity: recentActivity.map((submission: any) => ({
        id: submission.id,
        type: 'submission',
        title: submission.videoTitle,
        creatorName: submission.creator.displayName,
        creatorAvatar: submission.creator.avatarUrl,
        status: submission.status,
        submittedAt: submission.submittedAt,
        views: submission.viewsCurrent,
        paymentAmount: submission.paymentAmount
      })),
      profile: {
        displayName: clipperProfile.displayName,
        avatarUrl: clipperProfile.avatarUrl,
        youtubeChannelName: clipperProfile.youtubeChannelName,
        totalSubmissions: clipperProfile.totalSubmissions,
        totalApproved: clipperProfile.totalApproved,
        approvalRate: clipperProfile.approvalRate,
        lastActiveAt: clipperProfile.lastActiveAt
      }
    })

  } catch (error) {
    console.error('Error fetching clipper dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

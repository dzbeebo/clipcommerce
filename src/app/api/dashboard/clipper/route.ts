import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('CLIPPER')

    // Get clipper profile with all related data in optimized queries
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

    // Use Promise.all to run multiple queries in parallel
    const [
      activeSubmissions,
      recentActivity,
      lastMonthEarnings,
      newSubmissionsThisMonth
    ] = await Promise.all([
      // Active submissions count
      prisma.submission.count({
        where: {
          clipperId: clipperProfile.id,
          status: 'PENDING'
        }
      }),
      // Recent activity (limit to 5)
      prisma.submission.findMany({
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
      }),
      // Last month earnings
      prisma.transaction.aggregate({
        where: {
          submission: {
            clipperId: clipperProfile.id
          },
          status: 'SUCCEEDED',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        },
        _sum: {
          clipperNet: true
        }
      }),
      // New submissions this month
      prisma.submission.count({
        where: {
          clipperId: clipperProfile.id,
          submittedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        }
      })
    ])

    // Calculate stats
    const totalEarned = clipperProfile.totalEarned
    const approvedClips = clipperProfile.totalApproved
    const approvalRate = clipperProfile.approvalRate

    // Calculate growth percentage
    const currentMonthEarnings = lastMonthEarnings._sum.clipperNet || 0
    const previousMonthEarnings = totalEarned - currentMonthEarnings
    const growthPercentage = previousMonthEarnings > 0 
      ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100 
      : 0

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

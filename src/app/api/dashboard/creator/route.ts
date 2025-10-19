import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('CREATOR')

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
      include: {
        clippers: {
          where: { status: 'ACTIVE' },
          include: {
            clipper: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                totalEarned: true,
                totalSubmissions: true,
                totalApproved: true,
                approvalRate: true,
                lastActiveAt: true,
              }
            }
          }
        },
        submissions: {
          include: {
            clipper: {
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

    if (!creatorProfile) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    // Calculate stats
    const totalPaidOut = await prisma.transaction.aggregate({
      where: {
        submission: {
          creatorId: creatorProfile.id
        },
        status: 'SUCCEEDED'
      },
      _sum: {
        amount: true
      }
    })

    const pendingSubmissions = await prisma.submission.count({
      where: {
        creatorId: creatorProfile.id,
        status: 'PENDING'
      }
    })

    const approvedSubmissions = await prisma.submission.count({
      where: {
        creatorId: creatorProfile.id,
        status: 'APPROVED'
      }
    })

    const totalViews = await prisma.submission.aggregate({
      where: {
        creatorId: creatorProfile.id,
        status: { in: ['APPROVED', 'PAID'] }
      },
      _sum: {
        viewsCurrent: true
      }
    })

    // Get recent activity
    const recentActivity = await prisma.submission.findMany({
      where: {
        creatorId: creatorProfile.id
      },
      include: {
        clipper: {
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

    const lastMonthPaidOut = await prisma.transaction.aggregate({
      where: {
        submission: {
          creatorId: creatorProfile.id
        },
        status: 'SUCCEEDED',
        createdAt: {
          gte: lastMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const currentMonthPaidOut = totalPaidOut._sum.amount || 0
    const previousMonthPaidOut = lastMonthPaidOut._sum.amount || 0
    const growthPercentage = previousMonthPaidOut > 0 
      ? ((currentMonthPaidOut - previousMonthPaidOut) / previousMonthPaidOut) * 100 
      : 0

    const activeClippersCount = creatorProfile.clippers.length
    const newClippersThisMonth = await prisma.clipperMembership.count({
      where: {
        creatorId: creatorProfile.id,
        status: 'ACTIVE',
        approvedAt: {
          gte: lastMonth
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalPaidOut: currentMonthPaidOut,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
        activeClippers: activeClippersCount,
        newClippersThisMonth,
        pendingSubmissions,
        totalViews: totalViews._sum.viewsCurrent || 0,
        approvedSubmissions
      },
      clippers: creatorProfile.clippers.map((membership: any) => ({
        id: membership.clipper.id,
        displayName: membership.clipper.displayName,
        avatarUrl: membership.clipper.avatarUrl,
        totalEarned: membership.clipper.totalEarned,
        totalSubmissions: membership.clipper.totalSubmissions,
        totalApproved: membership.clipper.totalApproved,
        approvalRate: membership.clipper.approvalRate,
        lastActiveAt: membership.clipper.lastActiveAt,
        joinedAt: membership.approvedAt
      })),
      recentActivity: recentActivity.map((submission: any) => ({
        id: submission.id,
        type: 'submission',
        title: submission.videoTitle,
        clipperName: submission.clipper.displayName,
        clipperAvatar: submission.clipper.avatarUrl,
        status: submission.status,
        submittedAt: submission.submittedAt,
        views: submission.viewsCurrent
      })),
      profile: {
        displayName: creatorProfile.displayName,
        description: creatorProfile.description,
        avatarUrl: creatorProfile.avatarUrl,
        rateAmount: creatorProfile.rateAmount,
        rateViews: creatorProfile.rateViews,
        subscriptionTier: creatorProfile.subscriptionTier,
        maxClippers: creatorProfile.maxClippers
      }
    })

  } catch (error) {
    console.error('Error fetching creator dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

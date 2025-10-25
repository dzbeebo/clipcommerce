import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API called')
    let user
    try {
      user = await requireRole('CREATOR')
      console.log('User authenticated:', user.id, user.role)
    } catch (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get creator profile with all related data in optimized queries
    console.log('Looking for creator profile for user:', user.id)
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
      console.log('❌ Creator profile not found for user:', user.id)
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }
    
    console.log('✅ Creator profile found:', creatorProfile.id)

    // Use Promise.all to run multiple queries in parallel
    const [
      totalPaidOut,
      pendingSubmissions,
      approvedSubmissions,
      totalViews,
      recentActivity,
      lastMonthPaidOut,
      newClippersThisMonth
    ] = await Promise.all([
      // Total paid out
      prisma.transaction.aggregate({
        where: {
          submission: {
            creatorId: creatorProfile.id
          },
          status: 'SUCCEEDED'
        },
        _sum: {
          amount: true
        }
      }),
      // Pending submissions count
      prisma.submission.count({
        where: {
          creatorId: creatorProfile.id,
          status: 'PENDING'
        }
      }),
      // Approved submissions count
      prisma.submission.count({
        where: {
          creatorId: creatorProfile.id,
          status: 'APPROVED'
        }
      }),
      // Total views
      prisma.submission.aggregate({
        where: {
          creatorId: creatorProfile.id,
          status: { in: ['APPROVED', 'PAID'] }
        },
        _sum: {
          viewsCurrent: true
        }
      }),
      // Recent activity (limit to 5)
      prisma.submission.findMany({
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
      }),
      // Last month paid out
      prisma.transaction.aggregate({
        where: {
          submission: {
            creatorId: creatorProfile.id
          },
          status: 'SUCCEEDED',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        },
        _sum: {
          amount: true
        }
      }),
      // New clippers this month
      prisma.clipperMembership.count({
        where: {
          creatorId: creatorProfile.id,
          status: 'ACTIVE',
          approvedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        }
      })
    ])

    // Calculate growth percentage
    const currentMonthPaidOut = totalPaidOut._sum.amount || 0
    const previousMonthPaidOut = lastMonthPaidOut._sum.amount || 0
    const growthPercentage = previousMonthPaidOut > 0 
      ? ((currentMonthPaidOut - previousMonthPaidOut) / previousMonthPaidOut) * 100 
      : 0

    const activeClippersCount = creatorProfile.clippers.length

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

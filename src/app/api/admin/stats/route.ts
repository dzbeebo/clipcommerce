import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('ADMIN')

    // Get basic counts
    const [
      totalUsers,
      totalCreators,
      totalClippers,
      totalSubmissions,
      totalTransactions,
      pendingSubmissions,
      activeSubscriptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CREATOR' } }),
      prisma.user.count({ where: { role: 'CLIPPER' } }),
      prisma.submission.count(),
      prisma.transaction.count(),
      prisma.submission.count({ where: { status: 'PENDING' } }),
      prisma.creatorProfile.count({ 
        where: { subscriptionStatus: 'ACTIVE' } 
      })
    ])

    // Calculate total revenue (platform fees)
    const revenueResult = await prisma.transaction.aggregate({
      where: {
        status: 'SUCCEEDED'
      },
      _sum: {
        platformFee: true
      }
    })

    const totalRevenue = revenueResult._sum.platformFee || 0

    // Get recent activity (last 10 activities)
    const recentActivity = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    })

    const stats = {
      totalUsers,
      totalCreators,
      totalClippers,
      totalSubmissions,
      totalTransactions,
      totalRevenue,
      pendingSubmissions,
      activeSubscriptions
    }

    const activity = recentActivity.map(log => ({
      id: log.id,
      type: log.action,
      description: getActivityDescription(log.action, log.resource),
      timestamp: log.createdAt.toISOString(),
      user: log.user ? {
        email: log.user.email,
        role: log.user.role
      } : undefined
    }))

    return NextResponse.json({
      stats,
      recentActivity: activity
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getActivityDescription(action: string, resource: string): string {
  const actionMap: Record<string, string> = {
    'user.signup': 'New user registered',
    'user.login': 'User logged in',
    'submission.create': 'New clip submitted',
    'submission.approve': 'Clip approved',
    'submission.reject': 'Clip rejected',
    'payment.process': 'Payment processed',
    'subscription.create': 'Subscription created',
    'subscription.update': 'Subscription updated',
    'settings.update': 'Settings updated'
  }

  const resourceMap: Record<string, string> = {
    'User': 'user',
    'Submission': 'clip submission',
    'Transaction': 'payment',
    'CreatorProfile': 'creator profile',
    'ClipperProfile': 'clipper profile',
    'PlatformSettings': 'platform settings'
  }

  const actionDesc = actionMap[action] || action
  const resourceDesc = resourceMap[resource] || resource.toLowerCase()

  return `${actionDesc} for ${resourceDesc}`
}

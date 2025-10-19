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

    const skip = (page - 1) * limit

    // Build where clause based on user role
    let whereClause: any = {}

    if (user.role === 'CREATOR') {
      whereClause = {
        submission: {
          creator: {
            userId: user.id
          }
        }
      }
    } else if (user.role === 'CLIPPER') {
      whereClause = {
        submission: {
          clipper: {
            userId: user.id
          }
        }
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          submission: {
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
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where: whereClause })
    ])

    // Calculate summary stats
    const summary = await prisma.transaction.aggregate({
      where: whereClause,
      _sum: {
        amount: true,
        platformFee: true,
        clipperNet: true
      },
      _count: {
        id: true
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        amount: transaction.amount,
        platformFee: transaction.platformFee,
        clipperNet: transaction.clipperNet,
        status: transaction.status,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
        failureReason: transaction.failureReason,
        submission: {
          id: transaction.submission.id,
          videoTitle: transaction.submission.videoTitle,
          videoThumbnail: transaction.submission.videoThumbnail,
          viewsCurrent: transaction.submission.viewsCurrent,
          creator: transaction.submission.creator,
          clipper: transaction.submission.clipper
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: {
        totalTransactions: summary._count.id,
        totalAmount: summary._sum.amount || 0,
        totalPlatformFee: summary._sum.platformFee || 0,
        totalClipperNet: summary._sum.clipperNet || 0
      }
    })

  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

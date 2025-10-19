import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('CLIPPER')
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Get clipper profile
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id }
    })

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 })
    }

    // Get creators that this clipper is a member of (active status)
    const [memberships, total] = await Promise.all([
      prisma.clipperMembership.findMany({
        where: {
          clipperId: clipperProfile.id,
          status: 'ACTIVE'
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              slug: true,
              avatarUrl: true,
              description: true,
              rateAmount: true,
              rateViews: true,
              payoutMode: true,
              minPayout: true,
              subscriptionTier: true,
              maxClippers: true,
              createdAt: true
            }
          }
        },
        orderBy: { approvedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.clipperMembership.count({
        where: {
          clipperId: clipperProfile.id,
          status: 'ACTIVE'
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      creators: memberships.map(membership => ({
        id: membership.creator.id,
        displayName: membership.creator.displayName,
        slug: membership.creator.slug,
        avatarUrl: membership.creator.avatarUrl,
        description: membership.creator.description,
        rateAmount: membership.creator.rateAmount,
        rateViews: membership.creator.rateViews,
        payoutMode: membership.creator.payoutMode,
        minPayout: membership.creator.minPayout,
        subscriptionTier: membership.creator.subscriptionTier,
        maxClippers: membership.creator.maxClippers,
        joinedAt: membership.approvedAt,
        creatorSince: membership.creator.createdAt
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
    console.error('Error fetching creators:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

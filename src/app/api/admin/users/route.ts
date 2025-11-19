import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireRole('ADMIN')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    
    const where: any = {}
    
    if (role && (role === 'CREATOR' || role === 'CLIPPER' || role === 'ADMIN')) {
      where.role = role
    }
    
    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      }
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          onboardingComplete: true,
          createdAt: true,
          updatedAt: true,
          creatorProfile: {
            select: {
              displayName: true,
              slug: true,
            }
          },
          clipperProfile: {
            select: {
              displayName: true,
              youtubeChannelName: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole('ADMIN')
    
    const { userId, updates } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Validate updates
    const allowedUpdates: any = {}
    if (updates.role && ['CREATOR', 'CLIPPER', 'ADMIN'].includes(updates.role)) {
      allowedUpdates.role = updates.role
    }
    if (typeof updates.onboardingComplete === 'boolean') {
      allowedUpdates.onboardingComplete = updates.onboardingComplete
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: allowedUpdates,
      select: {
        id: true,
        email: true,
        role: true,
        onboardingComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireRole('ADMIN')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Prevent deleting yourself
    const adminUser = await requireRole('ADMIN')
    if (adminUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }
    
    await prisma.user.delete({
      where: { id: userId },
    })
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: 500 }
    )
  }
}


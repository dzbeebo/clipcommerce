import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Only ADMIN users can masquerade
    const adminUser = await requireRole('ADMIN')
    
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get the user to masquerade as
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingComplete: true,
        stripeAccountId: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Store masquerade info in a secure cookie
    const cookieStore = await cookies()
    cookieStore.set('masquerade-admin-id', adminUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
    })
    cookieStore.set('masquerade-user-id', targetUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
    })

    // Determine redirect URL based on target user's role
    let redirectUrl = '/'
    if (targetUser.role === 'CREATOR') {
      redirectUrl = targetUser.onboardingComplete ? '/creator' : '/onboarding/creator/step-1'
    } else if (targetUser.role === 'CLIPPER') {
      redirectUrl = targetUser.onboardingComplete ? '/clipper' : '/onboarding/clipper/step-1'
    }

    return NextResponse.json({
      success: true,
      masqueradeUser: targetUser,
      redirectUrl,
    })
  } catch (error) {
    console.error('Error starting masquerade:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start masquerade' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Update user's onboarding status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        onboardingComplete: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      redirectUrl: '/dashboard'
    })

  } catch (error) {
    console.error('Onboarding completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}

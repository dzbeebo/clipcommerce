import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // For creators, ensure they have a profile before completing onboarding
    if (user.role === 'CREATOR') {
      const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId: user.id }
      })

      if (!creatorProfile) {
        return NextResponse.json({ 
          error: 'Creator profile must be created before completing onboarding' 
        }, { status: 400 })
      }
    }

    // For clippers, ensure they have a profile before completing onboarding
    if (user.role === 'CLIPPER') {
      const clipperProfile = await prisma.clipperProfile.findUnique({
        where: { userId: user.id }
      })

      if (!clipperProfile) {
        return NextResponse.json({ 
          error: 'Clipper profile must be created before completing onboarding' 
        }, { status: 400 })
      }
    }
    
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

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { creatorProfileSchema, type CreatorProfileInput } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CREATOR') {
      return NextResponse.json({ error: 'Only creators can create profiles' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate the input
    const validatedData = creatorProfileSchema.parse(body)

    // Check if profile already exists
    const existingProfile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile) {
      return NextResponse.json({ error: 'Creator profile already exists' }, { status: 400 })
    }

    // Check if slug is already taken
    const existingSlug = await prisma.creatorProfile.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      return NextResponse.json({ error: 'This username is already taken' }, { status: 400 })
    }

    // Create the creator profile
    const creatorProfile = await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        displayName: validatedData.displayName,
        description: validatedData.description,
        slug: validatedData.slug,
        rateAmount: validatedData.rateAmount,
        rateViews: validatedData.rateViews,
        minPayout: validatedData.minPayout,
        subscriptionTier: 'STARTER', // Default tier
        maxClippers: 10, // Default for starter tier
      }
    })

    return NextResponse.json({
      success: true,
      profile: creatorProfile
    })

  } catch (error) {
    console.error('Creator profile creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create creator profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CREATOR') {
      return NextResponse.json({ error: 'Only creators can access profiles' }, { status: 403 })
    }

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Error fetching creator profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator profile' },
      { status: 500 }
    )
  }
}

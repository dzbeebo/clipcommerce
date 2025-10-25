import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const clipperProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  youtubeChannelName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

type ClipperProfileInput = z.infer<typeof clipperProfileSchema>

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only clippers can create profiles' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate the input
    const validatedData = clipperProfileSchema.parse(body)

    // Check if profile already exists
    const existingProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile) {
      return NextResponse.json({ error: 'Clipper profile already exists' }, { status: 400 })
    }

    // Create the clipper profile
    const clipperProfile = await prisma.clipperProfile.create({
      data: {
        userId: user.id,
        displayName: validatedData.displayName,
        youtubeChannelName: validatedData.youtubeChannelName || 'Connected Channel',
        avatarUrl: validatedData.avatarUrl,
        // Required YouTube OAuth fields - these should be set during YouTube connection
        youtubeChannelId: 'temp-' + user.id, // Temporary ID, should be updated during YouTube OAuth
        youtubeAccessToken: 'temp-token', // Temporary token, should be updated during YouTube OAuth
        youtubeRefreshToken: 'temp-refresh-token', // Temporary token, should be updated during YouTube OAuth
        totalEarned: 0,
        totalSubmissions: 0,
        totalApproved: 0,
        approvalRate: 0,
        lastActiveAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      profile: clipperProfile
    })

  } catch (error) {
    console.error('Clipper profile creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create clipper profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only clippers can access this profile' }, { status: 403 })
    }

    // Get the clipper profile
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id }
    })

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile: clipperProfile
    })

  } catch (error) {
    console.error('Clipper profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clipper profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only clippers can update this profile' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate the input
    const validatedData = clipperProfileSchema.partial().parse(body)

    // Update the clipper profile
    const clipperProfile = await prisma.clipperProfile.update({
      where: { userId: user.id },
      data: {
        ...validatedData,
        lastActiveAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      profile: clipperProfile
    })

  } catch (error) {
    console.error('Clipper profile update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update clipper profile' },
      { status: 500 }
    )
  }
}

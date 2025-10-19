import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { clipperSignupSchema } from '@/lib/validations'
import { hashPassword } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = clipperSignupSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password)
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: 'CLIPPER',
        onboardingComplete: false,
      }
    })
    
    // Create Supabase auth user
    const supabase = createServerSupabaseClient()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm for MVP
      user_metadata: {
        role: 'CLIPPER',
        user_id: user.id,
      }
    })
    
    if (authError) {
      // Rollback database user if Supabase auth fails
      await prisma.user.delete({ where: { id: user.id } })
      throw new Error('Failed to create authentication user')
    }
    
    // Update user with Supabase auth ID
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        // Store Supabase auth ID in a custom field if needed
        // For now, we'll use the email as the link
      }
    })
    
    // Create session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (sessionError) {
      throw new Error('Failed to create session')
    }
    
    // Set session cookie
    const response = NextResponse.json(
      { 
        message: 'Clipper account created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    )
    
    // Set the session cookie
    if (sessionData.session) {
      response.cookies.set('sb-access-token', sessionData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      
      response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Clipper signup error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create clipper account' },
      { status: 500 }
    )
  }
}

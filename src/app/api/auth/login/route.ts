import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import { verifyPassword } from '@/lib/utils'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 redirectUrl:
 *                   type: string
 *                   example: /dashboard
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create Supabase session
    const supabase = await createServerSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (sessionError) {
      throw new Error('Failed to create session')
    }
    
    // Determine redirect URL based on role and onboarding status
    let redirectUrl = '/'
    
    if (!user.onboardingComplete) {
      if (user.role === 'CREATOR') {
        redirectUrl = '/onboarding/creator/step-1'
      } else if (user.role === 'CLIPPER') {
        redirectUrl = '/onboarding/clipper/step-1'
      } else if (user.role === 'ADMIN') {
        redirectUrl = '/admin'
      }
    } else {
      if (user.role === 'CREATOR') {
        redirectUrl = '/dashboard'
      } else if (user.role === 'CLIPPER') {
        redirectUrl = '/clipper'
      } else if (user.role === 'ADMIN') {
        redirectUrl = '/admin'
      }
    }
    
    // Set session cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          onboardingComplete: user.onboardingComplete,
        },
        redirectUrl
      },
      { status: 200 }
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
    console.error('Login error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/how-it-works',
    '/pricing',
    '/creators',
    '/creator/[slug]',
    '/login',
    '/signup',
    '/signup/creator',
    '/signup/clipper',
    '/403',
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[') && route.includes(']')) {
      // Handle dynamic routes like /creator/[slug]
      const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(pathname)
    }
    return pathname === route
  })

  if (isPublicRoute) {
    return NextResponse.next()
  }

  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('sb-access-token')?.value
    
    if (!accessToken) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token with Supabase
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !authUser) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingComplete: true,
      }
    })

    if (!user) {
      // User not found in database, redirect to login
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check onboarding completion
    if (!user.onboardingComplete) {
      if (user.role === 'CREATOR') {
        return NextResponse.redirect(new URL('/onboarding/creator/step-1', request.url))
      } else if (user.role === 'CLIPPER') {
        return NextResponse.redirect(new URL('/onboarding/clipper/step-1', request.url))
      }
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard') && user.role !== 'CREATOR') {
      return NextResponse.redirect(new URL('/403?role=clipper&attempted=dashboard', request.url))
    }

    if (pathname.startsWith('/clipper') && user.role !== 'CLIPPER') {
      return NextResponse.redirect(new URL('/403?role=creator&attempted=clipper', request.url))
    }

    if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403?role=user&attempted=admin', request.url))
    }

    // Redirect to appropriate dashboard after login
    if (pathname === '/login' || pathname === '/signup') {
      if (user.role === 'CREATOR') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else if (user.role === 'CLIPPER') {
        return NextResponse.redirect(new URL('/clipper', request.url))
      } else if (user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Redirect to login on error
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

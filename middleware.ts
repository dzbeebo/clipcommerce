import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

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

    // Basic authentication check passed
    // Role-based access control and onboarding checks will be handled in page components

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

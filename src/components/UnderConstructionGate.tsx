'use client'

import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { UnderConstruction } from './UnderConstruction'
import { ConditionalLayout } from './layout/ConditionalLayout'

interface UnderConstructionGateProps {
  isUnderConstruction: boolean
  children: React.ReactNode
}

// Routes that should always be accessible, even during under construction
const EXCLUDED_ROUTES = [
  '/login',
  '/signup',
  '/signup/creator',
  '/signup/clipper',
  '/forgot-password',
  '/admin',
  '/api',
  '/_next',
  '/favicon.ico',
]

export function UnderConstructionGate({ isUnderConstruction, children }: UnderConstructionGateProps) {
  const { user, loading } = useAuthContext()
  const pathname = usePathname()
  
  // Allow ADMIN users to bypass under construction page
  const isAdmin = user?.role === 'ADMIN'
  
  // Check if current route should be excluded from under construction
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => pathname?.startsWith(route))
  
  // Wait for auth to load before showing under construction page
  // This prevents showing it to admins while their auth is still loading
  if (loading) {
    return <ConditionalLayout>{children}</ConditionalLayout>
  }
  
  // Don't show under construction page for excluded routes or admin users
  if (isUnderConstruction && !isAdmin && !isExcludedRoute) {
    return <UnderConstruction />
  }
  
  return <ConditionalLayout>{children}</ConditionalLayout>
}


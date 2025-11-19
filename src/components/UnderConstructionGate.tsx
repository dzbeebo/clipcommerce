'use client'

import { useState, useEffect } from 'react'
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
  '/api',
  '/_next',
  '/favicon.ico',
]

export function UnderConstructionGate({ isUnderConstruction: envUnderConstruction, children }: UnderConstructionGateProps) {
  const { user } = useAuthContext()
  const pathname = usePathname()
  const [isUnderConstruction, setIsUnderConstruction] = useState(envUnderConstruction)
  const [loading, setLoading] = useState(true)
  
  // Allow ADMIN users to bypass under construction page
  const isAdmin = user?.role === 'ADMIN'
  
  // Check if current route should be excluded from under construction
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => pathname?.startsWith(route))
  
  // Check database for under construction setting
  useEffect(() => {
    const checkUnderConstruction = async () => {
      try {
        const response = await fetch('/api/platform/under-construction')
        const data = await response.json()
        if (data.enabled !== undefined) {
          setIsUnderConstruction(data.enabled)
        }
      } catch (error) {
        console.error('Error checking under construction status:', error)
        // Fallback to environment variable
        setIsUnderConstruction(envUnderConstruction)
      } finally {
        setLoading(false)
      }
    }
    
    checkUnderConstruction()
  }, [envUnderConstruction])
  
  if (loading) {
    // Show normal layout while checking
    return <ConditionalLayout>{children}</ConditionalLayout>
  }
  
  // Don't show under construction page for excluded routes or admin users
  if (isUnderConstruction && !isAdmin && !isExcludedRoute) {
    return <UnderConstruction />
  }
  
  return <ConditionalLayout>{children}</ConditionalLayout>
}


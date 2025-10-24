'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, User } from './useAuth'

interface RoleAccessOptions {
  requiredRole?: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  requireOnboarding?: boolean
  redirectTo?: string
}

export function useRoleAccess(options: RoleAccessOptions = {}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    // Check onboarding completion
    if (options.requireOnboarding && !user.onboardingComplete) {
      if (user.role === 'CREATOR') {
        router.push('/onboarding/creator/step-1')
        return
      } else if (user.role === 'CLIPPER') {
        router.push('/onboarding/clipper/step-1')
        return
      }
    }

    // Check role-based access
    if (options.requiredRole && user.role !== options.requiredRole) {
      const redirectUrl = options.redirectTo || `/403?role=${user.role.toLowerCase()}&attempted=${options.requiredRole.toLowerCase()}`
      router.push(redirectUrl)
      return
    }
  }, [user, loading, options, router])

  return {
    user,
    loading,
    hasAccess: !loading && user && 
      (!options.requiredRole || user.role === options.requiredRole) &&
      (!options.requireOnboarding || user.onboardingComplete)
  }
}

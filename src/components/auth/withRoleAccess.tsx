'use client'

import { ReactNode } from 'react'
import { useRoleAccess } from '@/hooks/useRoleAccess'

interface WithRoleAccessProps {
  children: ReactNode
  requiredRole?: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  requireOnboarding?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export function WithRoleAccess({ 
  children, 
  requiredRole, 
  requireOnboarding = true,
  redirectTo,
  fallback = null 
}: WithRoleAccessProps) {
  const { user, loading, hasAccess } = useRoleAccess({
    requiredRole,
    requireOnboarding,
    redirectTo
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Higher-order component for easier usage
export function withRoleAccess<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<WithRoleAccessProps, 'children'>
) {
  return function RoleAccessWrapper(props: P) {
    return (
      <WithRoleAccess {...options}>
        <Component {...props} />
      </WithRoleAccess>
    )
  }
}

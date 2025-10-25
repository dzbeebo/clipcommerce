import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  role: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  onboardingComplete: boolean
  stripeAccountId?: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value
    
    if (!accessToken) {
      return null
    }
    
    // Verify token with Supabase
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !authUser) {
      return null
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingComplete: true,
        stripeAccountId: true,
      }
    })
    
    if (!user) {
      return null
    }
    
    return user as User
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireRole(requiredRole: 'CREATOR' | 'CLIPPER' | 'ADMIN'): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== requiredRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`)
  }
  
  return user
}

export async function requireOnboardingComplete(): Promise<User> {
  const user = await requireAuth()
  
  if (!user.onboardingComplete) {
    throw new Error('Onboarding must be completed')
  }
  
  return user
}

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
    
    // Check if masquerading
    const masqueradeUserId = cookieStore.get('masquerade-user-id')?.value
    const masqueradeAdminId = cookieStore.get('masquerade-admin-id')?.value
    
    if (masqueradeUserId && masqueradeAdminId) {
      // Verify admin is still valid
      const adminUser = await prisma.user.findUnique({
        where: { id: masqueradeAdminId },
        select: { role: true }
      })
      
      if (adminUser?.role === 'ADMIN') {
        // Return masquerade user
        const masqueradeUser = await prisma.user.findUnique({
          where: { id: masqueradeUserId },
          select: {
            id: true,
            email: true,
            role: true,
            onboardingComplete: true,
            stripeAccountId: true,
          }
        })
        
        if (masqueradeUser) {
          return masqueradeUser as User
        }
      } else {
        // Invalid masquerade, clear cookies
        cookieStore.delete('masquerade-user-id')
        cookieStore.delete('masquerade-admin-id')
      }
    }
    
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

export async function getOriginalAdminUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const masqueradeAdminId = cookieStore.get('masquerade-admin-id')?.value
    
    if (!masqueradeAdminId) {
      return null
    }
    
    const adminUser = await prisma.user.findUnique({
      where: { id: masqueradeAdminId },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingComplete: true,
        stripeAccountId: true,
      }
    })
    
    return adminUser as User | null
  } catch (error) {
    console.error('Error getting original admin user:', error)
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

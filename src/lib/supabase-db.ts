// Alternative database operations using Supabase client instead of Prisma
// This can be used as a fallback when Prisma has connection issues

import { createSupabaseAdminClient } from './supabase-server'

export interface User {
  id: string
  email: string
  role: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  onboardingComplete: boolean
  createdAt: string
  updatedAt: string
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    
    return data as User
  } catch (error) {
    console.error('Error finding user by email:', error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  passwordHash: string
  role: 'CREATOR' | 'CLIPPER'
  onboardingComplete: boolean
}): Promise<User | null> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('User')
      .insert([{
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role,
        onboardingComplete: userData.onboardingComplete,
      }])
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return data as User
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', userId)
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

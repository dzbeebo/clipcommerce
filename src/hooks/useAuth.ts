'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  role: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  onboardingComplete: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
    
    // Set up periodic session checking every 5 minutes
    const interval = setInterval(() => {
      checkSession(true) // Silent check to avoid unnecessary redirects
    }, 5 * 60 * 1000) // 5 minutes

    // Set up visibility change listener to check session when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession(true) // Silent check to avoid unnecessary redirects
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const checkSession = async (silent = false) => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
      } else {
        // Session expired or invalid
        setUser(null)
        if (!silent && user) {
          // Only redirect if we had a user before (session just expired)
          console.log('Session expired, redirecting to login')
          // Show a toast notification if available
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('session-expired'))
          }
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Session check error:', error)
      setUser(null)
      if (!silent && user) {
        // Only redirect if we had a user before (network error)
        console.log('Session check failed, redirecting to login')
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true, redirectUrl: data.redirectUrl }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const signup = async (userData: any, role: 'CREATOR' | 'CLIPPER') => {
    try {
      const response = await fetch(`/api/auth/signup/${role.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Signup failed' }
    }
  }

  const refreshUser = async () => {
    await checkSession()
  }

  const forceSessionCheck = async () => {
    await checkSession()
  }

  return {
    user,
    loading,
    login,
    logout,
    signup,
    checkSession,
    refreshUser,
    forceSessionCheck,
  }
}

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, User } from '@/hooks/useAuth'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  forceSessionCheck: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, forceSessionCheck } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  // Listen for storage events to sync authentication state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-state') {
        // Force a session check when auth state changes in another tab
        forceSessionCheck()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [forceSessionCheck])

  // Update localStorage when authentication state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-state', JSON.stringify({ 
        isAuthenticated: !!user, 
        timestamp: Date.now() 
      }))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      forceSessionCheck
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

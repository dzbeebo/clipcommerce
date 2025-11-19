'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthContext } from './AuthContext'
import { User } from '@/hooks/useAuth'

interface MasqueradeContextType {
  isMasquerading: boolean
  masqueradeUser: User | null
  originalUser: User | null
  startMasquerade: (userId: string) => Promise<void>
  stopMasquerade: () => Promise<void>
  getEffectiveUser: () => User | null
}

const MasqueradeContext = createContext<MasqueradeContextType | undefined>(undefined)

export function MasqueradeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext()
  const [isMasquerading, setIsMasquerading] = useState(false)
  const [masqueradeUser, setMasqueradeUser] = useState<User | null>(null)
  const [originalUser, setOriginalUser] = useState<User | null>(null)

  // Load masquerade state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('masquerade-state')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.isMasquerading && parsed.masqueradeUser && parsed.originalUser) {
            setIsMasquerading(true)
            setMasqueradeUser(parsed.masqueradeUser)
            setOriginalUser(parsed.originalUser)
          }
        } catch (e) {
          console.error('Error loading masquerade state:', e)
        }
      }
    }
  }, [])

  const startMasquerade = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/masquerade/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to start masquerade')
      }

      const data = await response.json()
      setIsMasquerading(true)
      setMasqueradeUser(data.masqueradeUser)
      setOriginalUser(user)

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('masquerade-state', JSON.stringify({
          isMasquerading: true,
          masqueradeUser: data.masqueradeUser,
          originalUser: user,
        }))
      }

      // Reload to apply masquerade
      window.location.href = data.redirectUrl || '/'
    } catch (error) {
      console.error('Error starting masquerade:', error)
      throw error
    }
  }

  const stopMasquerade = async () => {
    try {
      const response = await fetch(`/api/admin/masquerade/stop`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to stop masquerade')
      }

      setIsMasquerading(false)
      setMasqueradeUser(null)
      setOriginalUser(null)

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('masquerade-state')
      }

      // Reload to return to admin view
      window.location.href = '/admin/settings'
    } catch (error) {
      console.error('Error stopping masquerade:', error)
      throw error
    }
  }

  const getEffectiveUser = () => {
    return isMasquerading ? masqueradeUser : user
  }

  return (
    <MasqueradeContext.Provider
      value={{
        isMasquerading,
        masqueradeUser,
        originalUser,
        startMasquerade,
        stopMasquerade,
        getEffectiveUser,
      }}
    >
      {children}
    </MasqueradeContext.Provider>
  )
}

export function useMasquerade() {
  const context = useContext(MasqueradeContext)
  if (context === undefined) {
    throw new Error('useMasquerade must be used within a MasqueradeProvider')
  }
  return context
}


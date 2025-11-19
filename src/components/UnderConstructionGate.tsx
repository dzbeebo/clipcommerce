'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { UnderConstruction } from './UnderConstruction'
import { ConditionalLayout } from './layout/ConditionalLayout'

interface UnderConstructionGateProps {
  isUnderConstruction: boolean
  children: React.ReactNode
}

export function UnderConstructionGate({ isUnderConstruction: envUnderConstruction, children }: UnderConstructionGateProps) {
  const { user } = useAuthContext()
  const [isUnderConstruction, setIsUnderConstruction] = useState(envUnderConstruction)
  const [loading, setLoading] = useState(true)
  
  // Allow ADMIN users to bypass under construction page
  const isAdmin = user?.role === 'ADMIN'
  
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
  
  if (isUnderConstruction && !isAdmin) {
    return <UnderConstruction />
  }
  
  return <ConditionalLayout>{children}</ConditionalLayout>
}


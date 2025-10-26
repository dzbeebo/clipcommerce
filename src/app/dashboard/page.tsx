'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PageLoading } from '@/components/ui/loading'

export default function DashboardRedirect() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'CREATOR') {
        router.replace('/creator')
      } else if (user.role === 'CLIPPER') {
        router.replace('/clipper')
      } else {
        router.replace('/')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <PageLoading message="Redirecting..." />
  }

  return <PageLoading message="Redirecting to your dashboard..." />
}
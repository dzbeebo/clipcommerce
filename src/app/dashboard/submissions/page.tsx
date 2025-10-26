'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'

export default function DashboardSubmissionsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/creator/submissions')
  }, [router])

  return <PageLoading message="Redirecting to submissions..." />
}
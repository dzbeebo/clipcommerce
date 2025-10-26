import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { withCache, cacheKeys, CACHE_TTL } from '@/lib/cache'

interface DashboardStats {
  totalPaidOut?: number
  growthPercentage?: number
  activeClippers?: number
  newClippersThisMonth?: number
  pendingSubmissions?: number
  totalViews?: number
  approvedSubmissions?: number
  totalEarned?: number
  activeSubmissions?: number
  approvedClips?: number
  approvalRate?: number
  newSubmissionsThisMonth?: number
}

interface CreatorProfile {
  displayName: string
  description?: string
  avatarUrl?: string
  rateAmount: number
  rateViews: number
  subscriptionTier: string
  maxClippers: number
}

interface ClipperProfile {
  displayName: string
  avatarUrl?: string
  youtubeChannelName: string
  totalSubmissions: number
  totalApproved: number
  approvalRate: number
  lastActiveAt: Date
}

interface Creator {
  id: string
  displayName: string
  avatarUrl?: string
  slug: string
  rateAmount: number
  rateViews: number
  joinedAt?: Date
}

interface Clipper {
  id: string
  displayName: string
  avatarUrl?: string
  totalEarned: number
  totalSubmissions: number
  totalApproved: number
  approvalRate: number
  lastActiveAt: Date
  joinedAt?: Date
}

interface ActivityItem {
  id: string
  type: string
  title: string
  clipperName?: string
  clipperAvatar?: string
  creatorName?: string
  creatorAvatar?: string
  status: string
  submittedAt: Date
  views: number
  paymentAmount?: number
}

interface DashboardData {
  stats: DashboardStats
  clippers?: Clipper[]
  creators?: Creator[]
  recentActivity: ActivityItem[]
  profile: CreatorProfile | ClipperProfile
}

export function useDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)

      const cacheKey = cacheKeys.dashboardData(user.id, user.role)
      
      const dashboardData = await withCache(
        cacheKey,
        async () => {
          const endpoint = user.role === 'CREATOR' ? '/api/dashboard/creator' : '/api/dashboard/clipper'
          const response = await fetch(endpoint)
          
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data')
          }

          return response.json()
        },
        CACHE_TTL.DASHBOARD_DATA
      )
      
      setData(dashboardData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.role])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchDashboardData()
  }, [user, fetchDashboardData])

  const refetch = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const endpoint = user.role === 'CREATOR' ? '/api/dashboard/creator' : '/api/dashboard/clipper'
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}

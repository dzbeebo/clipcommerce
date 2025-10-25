'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationCenter } from '@/components/NotificationCenter'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { Breadcrumbs, breadcrumbConfigs } from '@/components/layout/Breadcrumbs'
import { PageLoading } from '@/components/ui/loading'
import { DollarSign, FileText, TrendingUp, Plus, Settings, Search, Clock, CheckCircle, XCircle, ExternalLink, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

export default function ClipperDashboard() {
  const { user, logout } = useAuth()
  const { data, loading, error, refetch } = useDashboard()
  const [showAnalytics, setShowAnalytics] = useState(false)

  if (!user) {
    return <PageLoading message="Verifying access..." />
  }

  if (loading) {
    return <PageLoading message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return <PageLoading message="Preparing dashboard..." />
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbConfigs['/clipper']} />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto mobile-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="mobile-heading text-gray-900">Clipper Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <NotificationCenter userId={user.id} />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="touch-target"
              >
                <BarChart3 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </span>
              </Button>
              <Button variant="outline" size="sm" className="touch-target">
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button variant="outline" size="sm" onClick={logout} className="touch-target">
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mobile-container py-6 sm:py-8">
        {showAnalytics && (
          <div className="mb-6 sm:mb-8">
            <AnalyticsDashboard userRole="CLIPPER" userId={user.id} />
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mobile-heading text-gray-900 mb-2">
            Welcome back, {data?.profile?.displayName || user.email}!
          </h2>
          <p className="mobile-text text-gray-600">
            Find creators, submit clips, and start earning money.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mobile-grid mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(data.stats.totalEarned || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.growthPercentage && data.stats.growthPercentage > 0 ? '+' : ''}
                {data.stats.growthPercentage?.toFixed(1) || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeSubmissions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Clips</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.approvedClips || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{data.stats.newSubmissionsThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(data.stats.approvalRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {data.stats.approvedSubmissions || 0} approved submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your clipper account
              </CardDescription>
            </CardHeader>
            <CardContent className="mobile-form">
              <Button className="w-full justify-start touch-target" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Browse Creators
              </Button>
              <Button className="w-full justify-start touch-target" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Clip
              </Button>
              <Button className="w-full justify-start touch-target" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Submission History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your clipper account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0">
                        {activity.creatorAvatar ? (
                          <img
                            src={activity.creatorAvatar}
                            alt={activity.creatorName}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              {activity.creatorName?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Clip submitted to {activity.creatorName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={activity.status === 'PENDING' ? 'default' : 
                                   activity.status === 'APPROVED' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(activity.submittedAt), { addSuffix: true })}
                          </span>
                          {activity.paymentAmount && (
                            <span className="text-xs text-green-600 font-medium">
                              ${activity.paymentAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Activity will appear here as you submit clips and get paid</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Working With Creators */}
        {data.creators && data.creators.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Working With Creators</CardTitle>
              <CardDescription>
                Creators you're currently working with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.creators.map((creator: any) => (
                  <div key={creator.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.displayName}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {creator.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {creator.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${creator.rateAmount} per {creator.rateViews.toLocaleString()} views
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        @{creator.slug}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to start earning with ClipCommerce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-500">Your clipper account is ready</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find Creators</p>
                  <p className="text-sm text-gray-500">Browse and join creator communities</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Submit Clips</p>
                  <p className="text-sm text-gray-500">Upload your best clips for review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { WithRoleAccess } from '@/components/auth/withRoleAccess'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardLoading } from '@/components/ui/loading'
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus, 
  Eye,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { usePerformanceTracking } from '@/lib/performance'

function CreatorDashboardContent() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useDashboard()
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  usePerformanceTracking('creator-dashboard')

  if (loading) {
    return (
      <Sidebar>
        <DashboardLoading />
      </Sidebar>
    )
  }

  if (error) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </Sidebar>
    )
  }

  if (!data) {
    return (
      <Sidebar>
        <DashboardLoading />
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {data?.profile?.displayName || user?.email || 'User'}!
          </h2>
          <p className="text-text-secondary text-lg">
            Here's what's happening.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Paid to Clippers</CardTitle>
              <DollarSign className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                ${(data.stats.totalPaidOut || 0).toLocaleString()}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {data.stats.growthPercentage && data.stats.growthPercentage > 0 ? '+' : ''}
                {data.stats.growthPercentage?.toFixed(1) || 0}% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Active Clipping Requests</CardTitle>
              <FileText className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.pendingSubmissions || 0}</div>
              <p className="text-xs text-text-secondary mt-1">
                {data.stats.newClippersThisMonth || 0} new clippers this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Views Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                {data.stats.totalViews ? (data.stats.totalViews / 1000).toFixed(1) + 'K' : '0'}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {data.stats.approvedSubmissions || 0} approved clips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Top Clipper</CardTitle>
              <Users className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.activeClippers || 0}</div>
              <p className="text-xs text-text-secondary mt-1">
                {data.clippers && data.clippers.length > 0 ? data.clippers[0].displayName : 'No clippers yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Videos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">My Videos</CardTitle>
              <Link href="/creator/videos" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${
                            activity.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-text-secondary">
                            by {activity.clipperName || activity.creatorName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">
                          {activity.views ? (activity.views / 1000).toFixed(1) + 'k' : '0'}
                        </p>
                        <p className="text-xs text-text-secondary">views</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity yet</p>
                    <p className="text-sm">Start by uploading your first video!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payments to Clippers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Payments to Clippers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Pending</p>
                    <p className="text-2xl font-bold text-text-primary">
                      ${data.stats.pendingSubmissions ? (data.stats.pendingSubmissions * 50).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {data.clippers && data.clippers.length > 0 ? (
                  data.clippers.slice(0, 3).map((clipper) => (
                    <div key={clipper.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {clipper.avatarUrl ? (
                          <img 
                            src={clipper.avatarUrl} 
                            alt={clipper.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {clipper.displayName.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-text-primary">{clipper.displayName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary">
                          ${clipper.totalEarned?.toFixed(2) || '0.00'}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-text-secondary" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No clippers yet</p>
                    <p className="text-sm">Clippers will appear here when they join</p>
                  </div>
                )}
              </div>

              <Button className="w-full mt-4 bg-primary text-white hover:opacity-90">
                <Eye className="h-4 w-4 mr-2" />
                Review & Pay All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  )
}

function ClipperDashboardContent() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useDashboard()
  
  usePerformanceTracking('clipper-dashboard')

  if (loading) {
    return (
      <Sidebar>
        <DashboardLoading />
      </Sidebar>
    )
  }

  if (error) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </Sidebar>
    )
  }

  if (!data) {
    return (
      <Sidebar>
        <DashboardLoading />
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {data?.profile?.displayName || user?.email || 'User'}!
          </h2>
          <p className="text-text-secondary text-lg">
            Track your earnings, view submissions, and manage your clipper account.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                ${(data.stats.totalEarned || 0).toFixed(2)}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {data.stats.growthPercentage?.toFixed(1) || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Active Submissions</CardTitle>
              <FileText className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.activeSubmissions || 0}</div>
              <p className="text-xs text-text-secondary mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Approved Clips</CardTitle>
              <CheckCircle className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.approvedClips || 0}</div>
              <p className="text-xs text-text-secondary mt-1">
                {data.stats.approvalRate?.toFixed(1) || 0}% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.newSubmissionsThisMonth || 0}</div>
              <p className="text-xs text-text-secondary mt-1">New submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your clipper account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/clipper/submit">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New Clip
                </Button>
              </Link>
              <Link href="/dashboard/submissions">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View My Submissions
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your clipper account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity && data.recentActivity.length > 0 ? (
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
                        <p className="text-sm font-medium text-text-primary truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          For {activity.creatorName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={activity.status === 'PENDING' ? 'default' : 
                                   activity.status === 'APPROVED' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-text-secondary">
                            {formatDistanceToNow(new Date(activity.submittedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-green-600">
                          ${activity.paymentAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-text-secondary py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Submit your first clip to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  )
}

export default function CreatorDashboard() {
  return (
    <WithRoleAccess requiredRole="CREATOR" requireOnboarding={true}>
      <CreatorDashboardContent />
    </WithRoleAccess>
  )
}
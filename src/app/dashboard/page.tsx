'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Users, FileText, TrendingUp, Plus, Settings, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function CreatorDashboard() {
  const { user, logout } = useAuth()
  const { data, loading, error, refetch } = useDashboard()

  if (!user) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
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
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {data.profile.displayName || user.email}!
          </h2>
          <p className="text-gray-600">
            Manage your clippers, review submissions, and track your performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(data.stats.totalPaidOut || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.growthPercentage && data.stats.growthPercentage > 0 ? '+' : ''}
                {data.stats.growthPercentage?.toFixed(1) || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clippers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeClippers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{data.stats.newClippersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.pendingSubmissions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.totalViews ? (data.stats.totalViews / 1000).toFixed(1) + 'K' : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.approvedSubmissions || 0} approved clips
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your creator account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Invite New Clippers
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Review Submissions
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Update Payment Rates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your creator account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0">
                        {activity.clipperAvatar ? (
                          <img
                            src={activity.clipperAvatar}
                            alt={activity.clipperName}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">
                              {activity.clipperName?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.clipperName} submitted a clip
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
                  <p className="text-sm">Activity will appear here as clippers join and submit clips</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Clippers */}
        {data.clippers && data.clippers.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Clippers</CardTitle>
              <CardDescription>
                Clippers currently working with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.clippers.map((clipper: any) => (
                  <div key={clipper.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {clipper.avatarUrl ? (
                        <img
                          src={clipper.avatarUrl}
                          alt={clipper.displayName}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">
                            {clipper.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {clipper.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {clipper.totalSubmissions} submissions • {clipper.approvalRate.toFixed(1)}% approval rate
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        ${clipper.totalEarned.toFixed(2)} earned
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
              Complete these steps to start using ClipCommerce
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
                  <p className="text-sm text-gray-500">Your creator account is ready</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Set Up Payment Rates</p>
                  <p className="text-sm text-gray-500">Configure how much you pay per 1,000 views</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invite Clippers</p>
                  <p className="text-sm text-gray-500">Share your creator profile to attract clippers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

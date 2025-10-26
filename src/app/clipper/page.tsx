'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardLoading } from '@/components/ui/loading'
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Plus, 
  Eye,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Search,
  ExternalLink,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

function ClipperDashboardContent() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useDashboard()
  const [showAnalytics, setShowAnalytics] = useState(false)

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
              <p className="text-xs text-text-secondary mt-1">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Approved Clips</CardTitle>
              <TrendingUp className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">{data.stats.approvedClips || 0}</div>
              <p className="text-xs text-text-secondary mt-1">
                +{data.stats.newSubmissionsThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                {(data.stats.approvalRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Based on {data.stats.approvedSubmissions || 0} approved submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your clipper account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/creators" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Creators
                </Button>
              </Link>
              <Link href="/clipper/submit" className="block">
                <Button className="w-full justify-start bg-secondary text-white hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New Clip
                </Button>
              </Link>
              <Link href="/clipper/submissions" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Submission History
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
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
                  {data.recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          Clip submitted to {activity.creatorName || activity.clipperName}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
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
                            {formatDistanceToNow(new Date(activity.submittedAt), { addSuffix: true })}
                          </span>
                          {activity.paymentAmount && (
                            <span className="text-xs text-green-600 font-medium">
                              ${activity.paymentAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Working With Creators</CardTitle>
              <CardDescription>
                Creators you're currently working with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.creators.map((creator) => (
                  <div key={creator.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.displayName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                        <span className="text-secondary font-bold">
                          {creator.displayName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {creator.displayName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        ${creator.rateAmount} per {creator.rateViews.toLocaleString()} views
                      </p>
                      <p className="text-xs text-secondary font-medium">
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
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to start earning with ClipMarket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Account Created</p>
                  <p className="text-sm text-text-secondary">Your clipper account is ready</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Find Creators</p>
                  <p className="text-sm text-text-secondary">Browse and join creator communities</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Submit Clips</p>
                  <p className="text-sm text-text-secondary">Upload your best clips for review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  )
}

export default function ClipperDashboard() {
  return <ClipperDashboardContent />
}

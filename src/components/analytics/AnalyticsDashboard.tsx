'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewChart } from './OverviewChart';
import { SubmissionStatusChart } from './SubmissionStatusChart';
import { MonthlyEarningsChart } from './MonthlyEarningsChart';
import { TopPerformersTable } from './TopPerformersTable';
import { RecentActivityList } from './RecentActivityList';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalClippers?: number;
    totalSubmissions: number;
    totalPaidOut?: number;
    totalEarned?: number;
    totalApproved?: number;
    approvalRate?: number;
    activeMemberships?: number;
    recentSubmissions: number;
    weeklySubmissions: number;
  };
  submissionStatusBreakdown: {
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    paymentFailed: number;
  };
  monthlyEarnings: Array<{
    month: string;
    amount: number;
  }>;
  topClippers?: Array<{
    id: string;
    name: string;
    totalSubmissions: number;
    approvedSubmissions: number;
    totalEarned: number;
    approvalRate: number;
  }>;
  creatorPerformance?: Array<{
    id: string;
    name: string;
    totalSubmissions: number;
    approvedSubmissions: number;
    totalEarned: number;
    approvalRate: number;
  }>;
  earningsByCreator?: Array<{
    id: string;
    name: string;
    totalSubmissions: number;
    approvedSubmissions: number;
    totalEarned: number;
    approvalRate: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    clipperName?: string;
    creatorName?: string;
    status: string;
    amount?: number;
    date: string;
    actionUrl: string;
  }>;
}

interface AnalyticsDashboardProps {
  userRole: 'CREATOR' | 'CLIPPER';
  userId: string;
}

export function AnalyticsDashboard({ userRole, userId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/analytics/${userRole.toLowerCase()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [userRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load analytics</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="mobile-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'CREATOR' ? 'Total Paid Out' : 'Total Earned'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((userRole === 'CREATOR' ? data.overview.totalPaidOut : data.overview.totalEarned) || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.overview.recentSubmissions} submissions this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'CREATOR' ? 'Active Clippers' : 'Active Memberships'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === 'CREATOR' ? data.overview.totalClippers || 0 : data.overview.activeMemberships || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.overview.weeklySubmissions} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              {data.submissionStatusBreakdown.pending} pending review
            </p>
          </CardContent>
        </Card>

        {userRole === 'CLIPPER' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.approvalRate?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {data.overview.totalApproved || 0} approved
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly {userRole === 'CREATOR' ? 'Payments' : 'Earnings'}</CardTitle>
                <CardDescription>
                  Track your {userRole === 'CREATOR' ? 'payouts' : 'earnings'} over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyEarningsChart data={data.monthlyEarnings} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>
                  Breakdown of submission statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubmissionStatusChart data={data.submissionStatusBreakdown} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission Overview</CardTitle>
              <CardDescription>
                Detailed view of all submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart data={data.submissionStatusBreakdown} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {userRole === 'CREATOR' ? 'Top Performing Clippers' : 'Earnings by Creator'}
              </CardTitle>
              <CardDescription>
                {userRole === 'CREATOR' 
                  ? 'Your best performing clippers' 
                  : 'Your earnings breakdown by creator'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopPerformersTable 
                data={userRole === 'CREATOR' ? data.topClippers || [] : data.earningsByCreator || []}
                type={userRole === 'CREATOR' ? 'clipper' : 'creator'}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList data={data.recentActivity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

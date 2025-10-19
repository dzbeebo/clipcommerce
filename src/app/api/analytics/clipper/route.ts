import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get clipper profile
    const clipperProfile = await prisma.clipperProfile.findUnique({
      where: { userId: user.id },
      include: {
        memberships: {
          include: {
            creator: true
          }
        },
        submissions: {
          include: {
            creator: true
          }
        }
      }
    });

    if (!clipperProfile) {
      return NextResponse.json({ error: 'Clipper profile not found' }, { status: 404 });
    }

    // Calculate analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total stats
    const totalEarned = clipperProfile.totalEarned;
    const totalSubmissions = clipperProfile.totalSubmissions;
    const totalApproved = clipperProfile.totalApproved;
    const approvalRate = clipperProfile.approvalRate;
    const activeMemberships = clipperProfile.memberships.filter(m => m.status === 'ACTIVE').length;

    // Recent activity (last 30 days)
    const recentSubmissions = clipperProfile.submissions.filter(
      s => s.submittedAt >= thirtyDaysAgo
    );

    // Weekly stats
    const weeklySubmissions = clipperProfile.submissions.filter(
      s => s.submittedAt >= sevenDaysAgo
    );

    // Submission status breakdown
    const submissionStatusBreakdown = {
      pending: clipperProfile.submissions.filter(s => s.status === 'PENDING').length,
      approved: clipperProfile.submissions.filter(s => s.status === 'APPROVED').length,
      rejected: clipperProfile.submissions.filter(s => s.status === 'REJECTED').length,
      paid: clipperProfile.submissions.filter(s => s.status === 'PAID').length,
      paymentFailed: clipperProfile.submissions.filter(s => s.status === 'PAYMENT_FAILED').length,
    };

    // Monthly earnings trend (last 6 months)
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthEarnings = clipperProfile.submissions
        .filter(s => s.status === 'PAID' && s.paidAt && s.paidAt >= monthStart && s.paidAt <= monthEnd)
        .reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

      monthlyEarnings.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: monthEarnings
      });
    }

    // Performance by creator
    const creatorPerformance = clipperProfile.memberships
      .filter(m => m.status === 'ACTIVE')
      .map(membership => {
        const creatorSubmissions = clipperProfile.submissions.filter(
          s => s.creatorId === membership.creatorId
        );
        const approvedSubmissions = creatorSubmissions.filter(s => s.status === 'PAID');
        const totalEarned = approvedSubmissions.reduce((sum, s) => sum + (s.paymentAmount || 0), 0);
        
        return {
          id: membership.creatorId,
          name: membership.creator.displayName,
          totalSubmissions: creatorSubmissions.length,
          approvedSubmissions: approvedSubmissions.length,
          totalEarned,
          approvalRate: creatorSubmissions.length > 0 
            ? (approvedSubmissions.length / creatorSubmissions.length) * 100 
            : 0
        };
      })
      .sort((a, b) => b.totalEarned - a.totalEarned);

    // Recent activity timeline
    const recentActivity = clipperProfile.submissions
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 10)
      .map(submission => ({
        id: submission.id,
        type: 'submission',
        title: submission.videoTitle,
        creatorName: submission.creator.displayName,
        status: submission.status,
        amount: submission.paymentAmount,
        date: submission.submittedAt,
        actionUrl: `/dashboard/submissions/${submission.id}`
      }));

    // Earnings breakdown by creator
    const earningsByCreator = creatorPerformance
      .filter(cp => cp.totalEarned > 0)
      .slice(0, 5);

    const analytics = {
      overview: {
        totalEarned,
        totalSubmissions,
        totalApproved,
        approvalRate,
        activeMemberships,
        recentSubmissions: recentSubmissions.length,
        weeklySubmissions: weeklySubmissions.length
      },
      submissionStatusBreakdown,
      monthlyEarnings,
      creatorPerformance,
      earningsByCreator,
      recentActivity
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

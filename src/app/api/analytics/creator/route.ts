import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/analytics/creator:
 *   get:
 *     summary: Get creator analytics
 *     description: Retrieve comprehensive analytics data for creators including earnings, clippers, and submissions
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalClippers:
 *                       type: integer
 *                       example: 15
 *                     totalSubmissions:
 *                       type: integer
 *                       example: 150
 *                     totalPaidOut:
 *                       type: number
 *                       format: float
 *                       example: 2500.75
 *                     recentSubmissions:
 *                       type: integer
 *                       example: 25
 *                     weeklySubmissions:
 *                       type: integer
 *                       example: 8
 *                 submissionStatusBreakdown:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: integer
 *                       example: 5
 *                     approved:
 *                       type: integer
 *                       example: 120
 *                     rejected:
 *                       type: integer
 *                       example: 20
 *                     paid:
 *                       type: integer
 *                       example: 100
 *                     paymentFailed:
 *                       type: integer
 *                       example: 5
 *                 monthlyEarnings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Jan 2024"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         example: 500.25
 *                 topClippers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       totalSubmissions:
 *                         type: integer
 *                       approvedSubmissions:
 *                         type: integer
 *                       totalEarned:
 *                         type: number
 *                         format: float
 *                       approvalRate:
 *                         type: number
 *                         format: float
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       title:
 *                         type: string
 *                       clipperName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       amount:
 *                         type: number
 *                         format: float
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       actionUrl:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Creator profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
      include: {
        clippers: {
          include: {
            clipper: true
          }
        },
        submissions: {
          include: {
            clipper: true
          }
        }
      }
    });

    if (!creatorProfile) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
    }

    // Calculate analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total stats
    const totalClippers = creatorProfile.clippers.filter(c => c.status === 'ACTIVE').length;
    const totalSubmissions = creatorProfile.submissions.length;
    const totalPaidOut = creatorProfile.submissions
      .filter(s => s.status === 'PAID')
      .reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

    // Recent activity (last 30 days)
    const recentSubmissions = creatorProfile.submissions.filter(
      s => s.submittedAt >= thirtyDaysAgo
    );

    // Weekly stats
    const weeklySubmissions = creatorProfile.submissions.filter(
      s => s.submittedAt >= sevenDaysAgo
    );

    // Submission status breakdown
    const submissionStatusBreakdown = {
      pending: creatorProfile.submissions.filter(s => s.status === 'PENDING').length,
      approved: creatorProfile.submissions.filter(s => s.status === 'APPROVED').length,
      rejected: creatorProfile.submissions.filter(s => s.status === 'REJECTED').length,
      paid: creatorProfile.submissions.filter(s => s.status === 'PAID').length,
      paymentFailed: creatorProfile.submissions.filter(s => s.status === 'PAYMENT_FAILED').length,
    };

    // Monthly earnings trend (last 6 months)
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthEarnings = creatorProfile.submissions
        .filter(s => s.status === 'PAID' && s.paidAt && s.paidAt >= monthStart && s.paidAt <= monthEnd)
        .reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

      monthlyEarnings.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: monthEarnings
      });
    }

    // Top performing clippers
    const clipperPerformance = creatorProfile.clippers
      .filter(c => c.status === 'ACTIVE')
      .map(membership => {
        const clipperSubmissions = creatorProfile.submissions.filter(
          s => s.clipperId === membership.clipperId
        );
        const approvedSubmissions = clipperSubmissions.filter(s => s.status === 'PAID');
        const totalEarned = approvedSubmissions.reduce((sum, s) => sum + (s.paymentAmount || 0), 0);
        
        return {
          id: membership.clipperId,
          name: membership.clipper.displayName,
          totalSubmissions: clipperSubmissions.length,
          approvedSubmissions: approvedSubmissions.length,
          totalEarned,
          approvalRate: clipperSubmissions.length > 0 
            ? (approvedSubmissions.length / clipperSubmissions.length) * 100 
            : 0
        };
      })
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, 5);

    // Recent activity timeline
    const recentActivity = creatorProfile.submissions
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 10)
      .map(submission => ({
        id: submission.id,
        type: 'submission',
        title: submission.videoTitle,
        clipperName: submission.clipper.displayName,
        status: submission.status,
        amount: submission.paymentAmount,
        date: submission.submittedAt,
        actionUrl: `/dashboard/submissions/${submission.id}`
      }));

    const analytics = {
      overview: {
        totalClippers,
        totalSubmissions,
        totalPaidOut,
        recentSubmissions: recentSubmissions.length,
        weeklySubmissions: weeklySubmissions.length
      },
      submissionStatusBreakdown,
      monthlyEarnings,
      topClippers: clipperPerformance,
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

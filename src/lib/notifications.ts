import { createClient } from '@/lib/supabase';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

export class NotificationService {
  private supabase = createClient();

  async createNotification({
    userId,
    type,
    title,
    message,
    actionUrl
  }: CreateNotificationParams) {
    try {
      const { data, error } = await this.supabase
        .from('Notification')
        .insert({
          userId,
          type,
          title,
          message,
          actionUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  // Helper methods for common notification types
  async notifySubmissionApproved(userId: string, submissionId: string, amount: number) {
    return this.createNotification({
      userId,
      type: 'SUBMISSION_APPROVED',
      title: 'Submission Approved!',
      message: `Your submission has been approved and you've earned $${amount.toFixed(2)}.`,
      actionUrl: `/dashboard/submissions/${submissionId}`
    });
  }

  async notifySubmissionRejected(userId: string, submissionId: string, reason?: string) {
    return this.createNotification({
      userId,
      type: 'SUBMISSION_REJECTED',
      title: 'Submission Rejected',
      message: reason || 'Your submission has been rejected. Please review the guidelines and try again.',
      actionUrl: `/dashboard/submissions/${submissionId}`
    });
  }

  async notifyPaymentReceived(userId: string, amount: number) {
    return this.createNotification({
      userId,
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received!',
      message: `You've received a payment of $${amount.toFixed(2)}.`,
      actionUrl: '/dashboard/earnings'
    });
  }

  async notifyApplicationApproved(userId: string, creatorName: string) {
    return this.createNotification({
      userId,
      type: 'APPLICATION_APPROVED',
      title: 'Application Approved!',
      message: `Your application to work with ${creatorName} has been approved.`,
      actionUrl: '/dashboard/creators'
    });
  }

  async notifyApplicationRejected(userId: string, creatorName: string) {
    return this.createNotification({
      userId,
      type: 'APPLICATION_REJECTED',
      title: 'Application Rejected',
      message: `Your application to work with ${creatorName} has been rejected.`,
      actionUrl: '/dashboard/creators'
    });
  }

  async notifyNewSubmission(userId: string, clipperName: string, videoTitle: string) {
    return this.createNotification({
      userId,
      type: 'NEW_SUBMISSION',
      title: 'New Submission',
      message: `${clipperName} submitted a new clip: "${videoTitle}"`,
      actionUrl: '/dashboard/submissions'
    });
  }

  async notifyPaymentFailed(userId: string, submissionId: string) {
    return this.createNotification({
      userId,
      type: 'PAYMENT_FAILED',
      title: 'Payment Failed',
      message: 'There was an issue processing your payment. Please check your payment method.',
      actionUrl: `/dashboard/submissions/${submissionId}`
    });
  }

  async notifySubscriptionExpiring(userId: string, daysLeft: number) {
    return this.createNotification({
      userId,
      type: 'SUBSCRIPTION_EXPIRING',
      title: 'Subscription Expiring Soon',
      message: `Your subscription will expire in ${daysLeft} days. Please renew to continue using the platform.`,
      actionUrl: '/dashboard/billing'
    });
  }
}

export const notificationService = new NotificationService();

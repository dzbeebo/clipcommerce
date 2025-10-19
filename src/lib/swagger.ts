import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClipCommerce API',
      version: '1.0.0',
      description: 'A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.',
      contact: {
        name: 'ClipCommerce Team',
        email: 'support@clipcommerce.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://clipcommerce.com/api' 
          : 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'clx1234567890',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            role: {
              type: 'string',
              enum: ['CREATOR', 'CLIPPER', 'ADMIN'],
              description: 'User role',
              example: 'CREATOR',
            },
            onboardingComplete: {
              type: 'boolean',
              description: 'Whether user has completed onboarding',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        CreatorProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Creator profile identifier',
            },
            userId: {
              type: 'string',
              description: 'Associated user ID',
            },
            displayName: {
              type: 'string',
              description: 'Creator display name',
              example: 'John Doe',
            },
            description: {
              type: 'string',
              description: 'Creator description',
              example: 'Gaming content creator',
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
              description: 'Creator avatar URL',
            },
            slug: {
              type: 'string',
              description: 'Creator URL slug',
              example: 'john-doe',
            },
            rateAmount: {
              type: 'number',
              format: 'float',
              description: 'Payment rate amount',
              example: 20.0,
            },
            rateViews: {
              type: 'integer',
              description: 'Payment rate per views',
              example: 1000,
            },
            payoutMode: {
              type: 'string',
              enum: ['ONE_TIME', 'RECURRING'],
              description: 'Payout mode',
              example: 'ONE_TIME',
            },
            subscriptionTier: {
              type: 'string',
              enum: ['STARTER', 'PRO', 'ENTERPRISE'],
              description: 'Subscription tier',
              example: 'STARTER',
            },
            subscriptionStatus: {
              type: 'string',
              enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'],
              description: 'Subscription status',
              example: 'ACTIVE',
            },
            maxClippers: {
              type: 'integer',
              description: 'Maximum allowed clippers',
              example: 10,
            },
          },
        },
        ClipperProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Clipper profile identifier',
            },
            userId: {
              type: 'string',
              description: 'Associated user ID',
            },
            displayName: {
              type: 'string',
              description: 'Clipper display name',
              example: 'Jane Smith',
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
              description: 'Clipper avatar URL',
            },
            youtubeChannelId: {
              type: 'string',
              description: 'YouTube channel ID',
              example: 'UC1234567890',
            },
            youtubeChannelName: {
              type: 'string',
              description: 'YouTube channel name',
              example: 'Jane\'s Gaming Channel',
            },
            totalEarned: {
              type: 'number',
              format: 'float',
              description: 'Total earnings',
              example: 150.75,
            },
            totalSubmissions: {
              type: 'integer',
              description: 'Total submissions',
              example: 25,
            },
            totalApproved: {
              type: 'integer',
              description: 'Total approved submissions',
              example: 20,
            },
            approvalRate: {
              type: 'number',
              format: 'float',
              description: 'Approval rate percentage',
              example: 80.0,
            },
          },
        },
        Submission: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Submission identifier',
            },
            creatorId: {
              type: 'string',
              description: 'Creator ID',
            },
            clipperId: {
              type: 'string',
              description: 'Clipper ID',
            },
            youtubeVideoId: {
              type: 'string',
              description: 'YouTube video ID',
              example: 'dQw4w9WgXcQ',
            },
            videoTitle: {
              type: 'string',
              description: 'Video title',
              example: 'Amazing Gaming Moment',
            },
            videoThumbnail: {
              type: 'string',
              format: 'uri',
              description: 'Video thumbnail URL',
            },
            videoPublishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Video publication date',
            },
            videoUrl: {
              type: 'string',
              format: 'uri',
              description: 'Full YouTube video URL',
            },
            viewsAtSubmit: {
              type: 'integer',
              description: 'Views when submitted',
              example: 1000,
            },
            viewsCurrent: {
              type: 'integer',
              description: 'Current view count',
              example: 1500,
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID', 'PAYMENT_FAILED'],
              description: 'Submission status',
              example: 'PENDING',
            },
            paymentAmount: {
              type: 'number',
              format: 'float',
              description: 'Payment amount',
              example: 25.50,
            },
            platformFee: {
              type: 'number',
              format: 'float',
              description: 'Platform fee',
              example: 2.55,
            },
            clipperNet: {
              type: 'number',
              format: 'float',
              description: 'Net amount to clipper',
              example: 22.95,
            },
            submittedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Submission timestamp',
            },
            reviewedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Review timestamp',
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment timestamp',
            },
            rejectionReason: {
              type: 'string',
              description: 'Rejection reason',
              example: 'Content does not meet quality standards',
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Notification identifier',
            },
            userId: {
              type: 'string',
              description: 'User ID',
            },
            type: {
              type: 'string',
              enum: [
                'SUBMISSION_APPROVED',
                'SUBMISSION_REJECTED',
                'PAYMENT_RECEIVED',
                'APPLICATION_APPROVED',
                'APPLICATION_REJECTED',
                'NEW_SUBMISSION',
                'PAYMENT_FAILED',
                'SUBSCRIPTION_EXPIRING',
              ],
              description: 'Notification type',
              example: 'SUBMISSION_APPROVED',
            },
            title: {
              type: 'string',
              description: 'Notification title',
              example: 'Submission Approved!',
            },
            message: {
              type: 'string',
              description: 'Notification message',
              example: 'Your submission has been approved and you\'ve earned $25.50.',
            },
            actionUrl: {
              type: 'string',
              format: 'uri',
              description: 'Action URL',
              example: '/dashboard/submissions/123',
            },
            read: {
              type: 'boolean',
              description: 'Whether notification is read',
              example: false,
            },
            readAt: {
              type: 'string',
              format: 'date-time',
              description: 'Read timestamp',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Unauthorized',
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
              example: 'Invalid authentication token',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 401,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);

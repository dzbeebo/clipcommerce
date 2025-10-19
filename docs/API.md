# ClipCommerce API Documentation

This document provides comprehensive information about the ClipCommerce API endpoints.

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://yourdomain.com/api`

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **General endpoints:** 100 requests per minute
- **Authentication endpoints:** 10 requests per minute
- **Analytics endpoints:** 50 requests per minute

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "statusCode": 400
}
```

## Endpoints

### Authentication

#### POST /api/auth/login

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "CREATOR",
    "onboardingComplete": true
  },
  "redirectUrl": "/dashboard"
}
```

**Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

#### POST /api/auth/logout

Log out the current user.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/auth/session

Get the current user session.

**Response (200):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "CREATOR",
    "onboardingComplete": true
  }
}
```

#### POST /api/auth/signup/creator

Create a new creator account.

**Request Body:**
```json
{
  "email": "creator@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "description": "Gaming content creator"
}
```

**Response (201):**
```json
{
  "message": "Creator account created successfully",
  "user": {
    "id": "user123",
    "email": "creator@example.com",
    "role": "CREATOR",
    "onboardingComplete": false
  }
}
```

#### POST /api/auth/signup/clipper

Create a new clipper account.

**Request Body:**
```json
{
  "email": "clipper@example.com",
  "password": "password123",
  "displayName": "Jane Smith"
}
```

**Response (201):**
```json
{
  "message": "Clipper account created successfully",
  "user": {
    "id": "user123",
    "email": "clipper@example.com",
    "role": "CLIPPER",
    "onboardingComplete": false
  }
}
```

### Analytics

#### GET /api/analytics/creator

Get analytics data for creators.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "overview": {
    "totalClippers": 15,
    "totalSubmissions": 150,
    "totalPaidOut": 2500.75,
    "recentSubmissions": 25,
    "weeklySubmissions": 8
  },
  "submissionStatusBreakdown": {
    "pending": 5,
    "approved": 120,
    "rejected": 20,
    "paid": 100,
    "paymentFailed": 5
  },
  "monthlyEarnings": [
    {
      "month": "Jan 2024",
      "amount": 500.25
    }
  ],
  "topClippers": [
    {
      "id": "clipper123",
      "name": "Top Clipper",
      "totalSubmissions": 25,
      "approvedSubmissions": 20,
      "totalEarned": 500.00,
      "approvalRate": 80.0
    }
  ],
  "recentActivity": [
    {
      "id": "sub123",
      "type": "submission",
      "title": "Amazing Gaming Moment",
      "clipperName": "Jane Smith",
      "status": "PENDING",
      "amount": 25.50,
      "date": "2024-01-01T10:00:00Z",
      "actionUrl": "/dashboard/submissions/sub123"
    }
  ]
}
```

#### GET /api/analytics/clipper

Get analytics data for clippers.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "overview": {
    "totalEarned": 1500.75,
    "totalSubmissions": 50,
    "totalApproved": 40,
    "approvalRate": 80.0,
    "activeMemberships": 5,
    "recentSubmissions": 10,
    "weeklySubmissions": 3
  },
  "submissionStatusBreakdown": {
    "pending": 5,
    "approved": 30,
    "rejected": 10,
    "paid": 25,
    "paymentFailed": 2
  },
  "monthlyEarnings": [
    {
      "month": "Jan 2024",
      "amount": 300.25
    }
  ],
  "creatorPerformance": [
    {
      "id": "creator123",
      "name": "Gaming Creator",
      "totalSubmissions": 20,
      "approvedSubmissions": 15,
      "totalEarned": 400.00,
      "approvalRate": 75.0
    }
  ],
  "earningsByCreator": [
    {
      "id": "creator123",
      "name": "Gaming Creator",
      "totalSubmissions": 20,
      "approvedSubmissions": 15,
      "totalEarned": 400.00,
      "approvalRate": 75.0
    }
  ],
  "recentActivity": [
    {
      "id": "sub123",
      "type": "submission",
      "title": "Epic Gaming Clip",
      "creatorName": "Gaming Creator",
      "status": "PAID",
      "amount": 25.50,
      "date": "2024-01-01T10:00:00Z",
      "actionUrl": "/dashboard/submissions/sub123"
    }
  ]
}
```

### Notifications

#### GET /api/notifications

Get user notifications.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 50)
- `offset` (optional): Number of notifications to skip (default: 0)

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notif123",
      "type": "SUBMISSION_APPROVED",
      "title": "Submission Approved!",
      "message": "Your submission has been approved and you've earned $25.50.",
      "actionUrl": "/dashboard/submissions/sub123",
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 1,
  "unreadCount": 1
}
```

#### PUT /api/notifications/:id/read

Mark a notification as read.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

#### PUT /api/notifications/read-all

Mark all notifications as read.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

### Submissions

#### GET /api/submissions

Get user submissions.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED, PAID, PAYMENT_FAILED)
- `limit` (optional): Number of submissions to return (default: 20)
- `offset` (optional): Number of submissions to skip (default: 0)

**Response (200):**
```json
{
  "submissions": [
    {
      "id": "sub123",
      "creatorId": "creator123",
      "clipperId": "clipper123",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "videoTitle": "Amazing Gaming Moment",
      "videoThumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "videoPublishedAt": "2024-01-01T08:00:00Z",
      "videoUrl": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "viewsAtSubmit": 1000,
      "viewsCurrent": 1500,
      "status": "PENDING",
      "submittedAt": "2024-01-01T10:00:00Z",
      "reviewedAt": null,
      "paymentAmount": null,
      "platformFee": null,
      "clipperNet": null,
      "paidAt": null,
      "rejectionReason": null
    }
  ],
  "total": 1
}
```

#### POST /api/submissions

Create a new submission.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "creatorId": "creator123",
  "youtubeVideoId": "dQw4w9WgXcQ",
  "videoTitle": "Amazing Gaming Moment",
  "videoThumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "videoPublishedAt": "2024-01-01T08:00:00Z",
  "videoUrl": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "viewsAtSubmit": 1000
}
```

**Response (201):**
```json
{
  "message": "Submission created successfully",
  "submission": {
    "id": "sub123",
    "creatorId": "creator123",
    "clipperId": "clipper123",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "videoTitle": "Amazing Gaming Moment",
    "status": "PENDING",
    "submittedAt": "2024-01-01T10:00:00Z"
  }
}
```

#### PUT /api/submissions/:id/approve

Approve a submission.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Submission approved successfully",
  "submission": {
    "id": "sub123",
    "status": "APPROVED",
    "paymentAmount": 25.50,
    "platformFee": 2.55,
    "clipperNet": 22.95
  }
}
```

#### PUT /api/submissions/:id/reject

Reject a submission.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Content does not meet quality standards"
}
```

**Response (200):**
```json
{
  "message": "Submission rejected successfully",
  "submission": {
    "id": "sub123",
    "status": "REJECTED",
    "rejectionReason": "Content does not meet quality standards"
  }
}
```

## Webhooks

### Stripe Webhooks

The API accepts Stripe webhooks for payment events:

**Endpoint:** `POST /api/webhooks/stripe`

**Events handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `account.updated`

### YouTube Webhooks

The API accepts YouTube webhooks for video updates:

**Endpoint:** `POST /api/webhooks/youtube`

**Events handled:**
- Video view count updates
- Video metadata changes

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @clipcommerce/api-client
```

```javascript
import { ClipCommerceAPI } from '@clipcommerce/api-client'

const api = new ClipCommerceAPI({
  baseURL: 'https://yourdomain.com/api',
  apiKey: 'your-api-key'
})

// Get analytics
const analytics = await api.analytics.getCreator()

// Create submission
const submission = await api.submissions.create({
  creatorId: 'creator123',
  youtubeVideoId: 'dQw4w9WgXcQ',
  videoTitle: 'Amazing Gaming Moment'
})
```

### Python

```bash
pip install clipcommerce-api
```

```python
from clipcommerce import ClipCommerceAPI

api = ClipCommerceAPI(
    base_url='https://yourdomain.com/api',
    api_key='your-api-key'
)

# Get analytics
analytics = api.analytics.get_creator()

# Create submission
submission = api.submissions.create(
    creator_id='creator123',
    youtube_video_id='dQw4w9WgXcQ',
    video_title='Amazing Gaming Moment'
)
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authentication endpoints:** 10 requests per minute per IP
- **General endpoints:** 100 requests per minute per user
- **Analytics endpoints:** 50 requests per minute per user

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Response Headers:**
```http
X-Total-Count: 150
X-Page-Limit: 20
X-Page-Offset: 0
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Query Parameters:**
- `filter[field]`: Filter by specific field value
- `sort`: Sort by field (prefix with `-` for descending)
- `search`: Search across multiple fields

**Example:**
```
GET /api/submissions?filter[status]=PENDING&sort=-submittedAt&search=gaming
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Authentication endpoints
- Analytics endpoints
- Notification system
- Submission management

## Support

For API support:
- Check the troubleshooting section
- Review error messages
- Contact support team
- Create GitHub issue with details

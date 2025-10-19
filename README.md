# ClipCommerce MVP

A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Payments:** Stripe Connect
- **External APIs:** YouTube Data API v3
- **Deployment:** Vercel

## Features

### MVP Features
- ✅ Role-based account creation (Creator/Clipper)
- ✅ Separate onboarding flows for each role
- ✅ YouTube OAuth integration for clippers
- ✅ Stripe Connect for payments
- ✅ Clip submission and verification
- ✅ Creator approval workflow
- ✅ Automated payment processing
- ✅ Analytics dashboards
- ✅ Admin panel

### User Roles
- **Creators:** Manage clippers, review submissions, process payments
- **Clippers:** Submit clips, track earnings, join creator communities
- **Admins:** Platform management, settings, user oversight

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Google Cloud Console project

### Environment Setup

1. Copy the environment variables:
```bash
cp .env.example .env.local
```

2. Fill in the required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# YouTube API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **User:** Core user accounts with role-based access
- **CreatorProfile:** Creator-specific settings and subscription info
- **ClipperProfile:** Clipper-specific settings and YouTube integration
- **ClipperMembership:** Creator-clipper relationships
- **Submission:** Clip submissions with metadata and status
- **Transaction:** Payment records and financial tracking
- **PlatformSettings:** Admin-configurable platform settings
- **Notification:** User notifications (Phase 2)
- **AuditLog:** Security and compliance logging

## API Routes

### Authentication
- `POST /api/auth/signup/creator` - Create creator account
- `POST /api/auth/signup/clipper` - Create clipper account
- `POST /api/auth/login` - User login

### Creator Endpoints
- `GET /api/creator/profile` - Get creator profile
- `PUT /api/creator/profile` - Update creator profile
- `GET /api/creator/clippers` - Get clippers
- `POST /api/creator/clippers/approve` - Approve clipper
- `POST /api/creator/clippers/reject` - Reject clipper
- `GET /api/creator/submissions` - Get submissions
- `PUT /api/creator/submissions/[id]/approve` - Approve submission
- `PUT /api/creator/submissions/[id]/reject` - Reject submission

### Clipper Endpoints
- `GET /api/clipper/profile` - Get clipper profile
- `POST /api/clipper/communities/join` - Join creator community
- `POST /api/clipper/submissions/create` - Submit clip
- `GET /api/clipper/submissions` - Get submissions
- `GET /api/clipper/earnings` - Get earnings

### YouTube Integration
- `POST /api/youtube/verify` - Verify video ownership
- `GET /api/youtube/video/[id]` - Get video metadata

### Stripe Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Creator dashboard
│   ├── clipper/           # Clipper dashboard
│   ├── onboarding/        # Onboarding flows
│   └── signup/            # Account creation
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── auth/             # Authentication components
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Prisma client
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe utilities
│   ├── youtube.ts        # YouTube API client
│   └── validations.ts    # Zod schemas
└── types/                # TypeScript type definitions
```

### Key Features Implementation

1. **Role-Based Access Control:** Middleware enforces access based on user roles
2. **Authentication:** Supabase Auth with custom user management
3. **Payment Processing:** Stripe Connect for marketplace payments
4. **Video Verification:** YouTube API integration for ownership verification
5. **Real-time Updates:** WebSocket integration for live notifications

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are set in your production environment, including:
- Supabase production credentials
- Stripe production keys
- YouTube API production credentials
- Production encryption key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or create an issue in the repository.
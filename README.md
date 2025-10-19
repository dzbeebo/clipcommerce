# 🎬 ClipCommerce

A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Features

### ✅ **MVP Features (Completed)**
- **Role-based account creation** (Creator/Clipper/Admin)
- **Unified signup flow** with role selection
- **Creator onboarding** with Stripe Connect and subscription plans
- **Clipper onboarding** with YouTube OAuth and Stripe Connect
- **Role-based dashboards** with analytics and management tools
- **Middleware-based access control** for secure routing
- **Complete database schema** with all required models
- **Modern UI/UX** with Tailwind CSS and shadcn/ui components

### 🎯 **User Roles**
- **Creators:** Manage clippers, review submissions, process payments
- **Clippers:** Submit clips, track earnings, join creator communities  
- **Admins:** Platform management, settings, user oversight

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth with custom user management
- **Payments:** Stripe Connect
- **External APIs:** YouTube Data API v3
- **Deployment:** Vercel

## 🏗️ Architecture

### Database Schema
- **User:** Core user accounts with role-based access
- **CreatorProfile:** Creator settings, subscription info, payment rates
- **ClipperProfile:** Clipper settings, YouTube integration, earnings
- **ClipperMembership:** Creator-clipper relationships and permissions
- **Submission:** Clip submissions with metadata and approval status
- **Transaction:** Payment records and financial tracking
- **PlatformSettings:** Admin-configurable platform settings
- **Notification:** User notifications (Phase 2)
- **AuditLog:** Security and compliance logging

### Key Features
1. **Role-Based Access Control:** Middleware enforces access based on user roles
2. **Authentication:** Supabase Auth with custom user management
3. **Payment Processing:** Stripe Connect for marketplace payments
4. **Video Verification:** YouTube API integration for ownership verification
5. **Real-time Updates:** WebSocket integration for live notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Google Cloud Console project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dzbeebo/clipcommerce.git
cd clipcommerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
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

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── creator/       # Creator-specific APIs
│   │   ├── clipper/       # Clipper-specific APIs
│   │   └── webhooks/      # Webhook handlers
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
│   ├── auth.ts           # Authentication utilities
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup/creator` - Create creator account
- `POST /api/auth/signup/clipper` - Create clipper account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

#### Creator Endpoints
- `GET /api/creator/profile` - Get creator profile
- `PUT /api/creator/profile` - Update creator profile
- `GET /api/creator/clippers` - Get clippers
- `POST /api/creator/clippers/approve` - Approve clipper
- `POST /api/creator/clippers/reject` - Reject clipper
- `GET /api/creator/submissions` - Get submissions
- `PUT /api/creator/submissions/[id]/approve` - Approve submission
- `PUT /api/creator/submissions/[id]/reject` - Reject submission

#### Clipper Endpoints
- `GET /api/clipper/profile` - Get clipper profile
- `POST /api/clipper/communities/join` - Join creator community
- `POST /api/clipper/submissions/create` - Submit clip
- `GET /api/clipper/submissions` - Get submissions
- `GET /api/clipper/earnings` - Get earnings

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- Supabase production credentials
- Stripe production keys
- YouTube API production credentials
- Production encryption key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

## 🎯 Roadmap

### Phase 1: MVP Foundation ✅
- [x] Project scaffolding and infrastructure
- [x] Authentication and account creation
- [x] Creator onboarding flow
- [x] Clipper onboarding flow
- [x] Basic dashboard structure

### Phase 2: Core Features (In Progress)
- [ ] Complete dashboard functionality
- [ ] YouTube API integration
- [ ] Stripe payment processing
- [ ] Clip submission workflow
- [ ] Admin panel

### Phase 3: Advanced Features
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API documentation
- [ ] Testing suite

---

**Built with ❤️ by the ClipCommerce team**
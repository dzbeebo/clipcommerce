🚀 Product Requirements Document (PRD) - UPDATED
================================================

**Product Name:** ClipCommerce (working title)\
**Version:** v1.1 - MVP (Updated Account Creation Flow)\
**Author:** PM-AI\
**Date:** October 18, 2025\
**Status:** Ready for Development

* * * * *

CHANGELOG (v1.1)
----------------

### Updates to Account Creation & User Management

**Key Changes:**

1.  ✅ Unified signup flow with role selection
2.  ✅ Clear separation of Creator vs. Clipper account types from onboarding
3.  ✅ Role-specific dashboards and feature access
4.  ✅ Updated user stories and acceptance criteria
5.  ✅ Revised information architecture and sitemap
6.  ✅ Enhanced database schema with role enforcement

* * * * *

1\. Executive Summary
---------------------

### Overview

ClipCommerce is a two-sided marketplace platform that connects content creators with "clippers" - content creators who specialize in creating and distributing short-form clips from longer-form content. The platform automates the workflow of clip submission, verification, approval, payment processing, and performance analytics.

### Business Model

-   **Revenue Stream 1:** Monthly subscription fees from content creators (tiered pricing)
-   **Revenue Stream 2:** Variable transaction fee on all payouts (configurable in admin panel)
-   **Target Market:** YouTube content creators (MVP), expanding to TikTok/Instagram in future phases

### Key Value Propositions

**For Content Creators:**

-   Automate clipper management and payments
-   Verify clipper ownership to prevent fraud
-   Track ROI and clipper performance
-   Scale clip distribution without manual overhead

**For Clippers:**

-   Discover creator opportunities in one place
-   Automated payment processing
-   Clear performance metrics
-   Build reputation for auto-approval status

* * * * *

2\. Goals & Objectives
----------------------

### Business Goals

1.  **Launch MVP within 90 days** with YouTube-only integration
2.  **Acquire 50 content creators** in first 6 months
3.  **Process $100K+ in clipper payouts** by month 6
4.  **Achieve 90%+ creator retention rate** after 3 months

### Product Goals

1.  Reduce clipper payment processing time from hours to minutes
2.  Eliminate payment fraud through OAuth verification
3.  Provide real-time analytics for creator decision-making
4.  Enable auto-approval workflow to reduce creator workload by 70%

### Success Metrics (KPIs)

-   **Activation:** % of creators who onboard ≥1 clipper within 7 days
-   **Engagement:** Average clips submitted per creator per week
-   **Retention:** 30/60/90-day creator retention rate
-   **Revenue:** MRR, transaction volume, average transaction fee %
-   **Quality:** Clipper approval rate, dispute rate

* * * * *

3\. Target Users & Personas
---------------------------

### Primary Persona: Content Creator (Mike)

-   **Demographics:** 25-40 years old, YouTube creator with 50K-500K subscribers
-   **Behavior:** Posts 2-4 long-form videos per week, aware clippers exist but managing them manually via DMs/spreadsheets
-   **Pain Points:**
    -   Spending 5+ hours/week verifying clips and processing payments
    -   Can't verify if clippers actually own the accounts they claim
    -   No visibility into which clippers drive best ROI
    -   PayPal/Venmo payments are manual and error-prone
-   **Goals:** Scale clip distribution, reduce admin work, pay clippers fairly, prevent fraud

### Secondary Persona: Clipper (Sarah)

-   **Demographics:** 18-30 years old, runs 3-10 short-form content accounts across platforms
-   **Behavior:** Clips content from 5-10 creators, posts 10-30 clips per week
-   **Pain Points:**
    -   Hard to discover creators who pay for clips
    -   Manual payment requests via DM are awkward
    -   No clear metrics on earnings potential
    -   Delayed payments (sometimes 30+ days)
-   **Goals:** Find high-paying creators, get paid quickly, build reputation, maximize earnings

* * * * *

4\. Problem Statement
---------------------

**Current State:**\
Content creators are paying clippers manually through ad-hoc arrangements using PayPal, Venmo, or direct deposit. This process is time-intensive, error-prone, and vulnerable to fraud (clippers claiming ownership of clips they don't own). Creators lack visibility into clipper performance and ROI.

**Desired State:**\
A fully automated platform where clippers submit clips with verified ownership, creators review and approve submissions with data-driven insights, and payments are processed automatically with configurable payout rules.

**Market Opportunity:**\
The clipper economy is exploding with thousands of clippers and hundreds of creators participating, but no dedicated infrastructure exists. Current solutions (spreadsheets, DMs, PayPal) don't scale beyond 5-10 clippers per creator.

* * * * *

5\. Proposed Solution
---------------------

### Core Platform Features

#### **5.1 Unified User Management & Account Creation** ⭐ UPDATED

**Key Design Principle:** Users explicitly choose their account type during signup, which determines their entire platform experience, available features, and dashboard.

**Account Types:**

-   **Creator Account:** Access to creator dashboard, community management, submission review, payment settings, analytics
-   **Clipper Account:** Access to clipper dashboard, clip submission, earnings tracking, creator marketplace
-   **Admin Account:** Access to admin panel (created manually, not via public signup)

**Important:** Once an account type is selected, it cannot be changed through the UI (requires admin intervention). This prevents confusion and maintains clear role boundaries.

##### 5.1.1 Unified Signup Flow

```
Landing Page → "Get Started" → Account Type Selection → Role-Specific Signup
```

**User Journey:**
1. User clicks "Get Started" or "Sign Up" on homepage
2. Redirected to `/signup` page
3. Page displays two clear options:
   - **"I'm a Creator"** - "Manage clippers and automate payments"
   - **"I'm a Clipper"** - "Find creators and earn from your clips"
4. User selects account type
5. Redirected to role-specific signup form
6. After account creation, role determines all subsequent features and UI

##### 5.1.2 Role-Based Authentication & Access Control
- All authentication handled through NextAuth.js
- User role stored in User table (enum: CREATOR, CLIPPER, ADMIN)
- Middleware enforces role-based access:
  - `/dashboard/*` → Creators only
  - `/clipper/*` → Clippers only
  - `/admin/*` → Admins only
- Attempting to access wrong dashboard shows 403 error with clear messaging

##### 5.1.3 Role-Specific Onboarding Paths

**Creator Onboarding:**
```
1. Email/password signup
2. Email verification (optional for MVP)
3. Stripe Connect onboarding (for receiving subscription payments & sending payouts)
4. Profile setup (display name, description, avatar, payment rates)
5. Subscription plan selection (Starter/Pro/Enterprise)
6. Creator dashboard (empty state with "Share your profile" CTA)
```

**Clipper Onboarding:**
```
1. Email/password signup
2. Email verification (optional for MVP)
3. YouTube OAuth connection (verify channel ownership)
4. Stripe Connect onboarding (for receiving payouts)
5. Profile setup (display name)
6. Clipper dashboard (empty state with "Browse Creators" CTA)
```

#### **5.2 Creator Profile & Community Management**
- Public creator profile page (discoverable by clippers)
- "Join Community" button for clippers to apply
- Creator dashboard showing all active clippers
- Ability to accept/reject clipper applications
- Creator-only features (not visible to clippers)

#### **5.3 Clipper Submission Workflow**
```
1. Clipper selects creator from "My Communities"
2. Enters YouTube video URL
3. System verifies video ownership via YouTube OAuth
4. System pulls video metadata (title, views, thumbnail, publish date)
5. Clipper submits for review
6. Submission enters creator's review queue
```

#### **5.4 Creator Review & Approval System**

-   Review queue with all pending submissions
-   Video preview with metadata (views, publish date, channel verification)
-   Manual approve/reject buttons
-   Bulk actions (approve all, reject all)
-   Auto-approval toggle per clipper (based on reputation)
-   Notes/comments field for rejection reasons

#### **5.5 Payment Rate Configuration** (Creator-only)

-   Creator sets: `$X per Y views` (e.g., $20 per 1,000 views)
-   Payout mode toggle:
    -   **One-time:** Pay once upon approval based on current views
    -   **Recurring:** Pay incrementally as views accumulate (track paid vs unpaid views)
-   Minimum payout threshold (e.g., $10 minimum per transaction)

#### **5.6 Automated Payment Processing**

-   Upon approval, system calculates payment: `(current_views / rate_views) * rate_amount`
-   For recurring mode: `(new_views_since_last_payout / rate_views) * rate_amount`
-   System deducts platform commission (configurable in admin)
-   Stripe Connect transfer from creator to clipper
-   Payment confirmation email to both parties
-   Transaction history log

#### **5.7 Analytics Dashboard (Creator-only)**

-   **Overview:**
    -   Total paid out (all-time, this month)
    -   Total clips tracked
    -   Total views generated
    -   ROI calculation: `(total_views * estimated_CPM) / total_paid`
-   **Clipper Leaderboard:**
    -   Top clippers by total views
    -   Top clippers by total earnings
    -   Approval rate per clipper
-   **Performance Charts:**
    -   Views over time (line chart)
    -   Clips submitted per week (bar chart)
    -   Payout distribution (pie chart: top clippers vs others)

#### **5.8 Clipper Dashboard** (Clipper-only)

-   **Earnings Overview:**
    -   Total earned (all-time, pending, paid out)
    -   Active clips being tracked
    -   Clips pending approval
-   **Submission History:**
    -   All submitted clips with status (pending, approved, rejected)
    -   View count updates
    -   Earnings per clip
-   **Creator Marketplace:**
    -   Browse available creators
    -   See rates and requirements
    -   One-click "Join Community"

#### **5.9 Admin Panel**

-   Platform commission % control (global setting)
-   User management (view all creators/clippers, suspend accounts)
-   Transaction history (all platform payments)
-   System health metrics (API call success rates, failed payments)
-   Feature flags for beta features

* * * * *

6\. Feature Prioritization
--------------------------

### MVP (Phase 1) - Must Have

✅ **Unified account creation with role selection**\
✅ **Separate Creator and Clipper signup flows**\
✅ **Role-based dashboard access control**\
✅ YouTube OAuth verification for clippers\
✅ Creator profile & clipper community join\
✅ Clip submission with URL + auto-metadata pull\
✅ Manual approval workflow\
✅ One-time payment mode (pay on approval)\
✅ Stripe Connect integration\
✅ Basic analytics (total paid, clips tracked, views)\
✅ Admin commission configuration\
✅ Subscription billing for creators (Stripe Billing)

### Phase 2 (Month 4-6) - Should Have

🔲 Recurring payment mode (pay as views grow)\
🔲 Auto-approval per clipper (reputation-based)\
🔲 Advanced analytics (ROI calculator, charts)\
🔲 Bulk approval actions\
🔲 View refresh mechanism (cron job to update view counts)\
🔲 Dispute resolution system\
🔲 Email notifications (new submission, payment sent)

### Phase 3 (Month 7-12) - Nice to Have

🔲 TikTok integration\
🔲 Instagram integration\
🔲 Multi-rate system (different rates per platform)\
🔲 Clipper rating/review system\
🔲 Creator-clipper messaging\
🔲 Mobile app (React Native)\
🔲 API for third-party integrations

* * * * *

7\. User Stories & Acceptance Criteria
--------------------------------------

### Epic 1: Unified Account Creation & Role Selection ⭐ UPDATED

#### Story 1.1: User Lands on Signup Page and Chooses Account Type

**As a** new user\
**I want to** clearly understand the difference between Creator and Clipper accounts\
**So that** I can choose the right account type for my needs

**Acceptance Criteria:**

-   [ ]  Homepage has prominent "Get Started" or "Sign Up" button
-   [ ]  Clicking redirects to `/signup` page
-   [ ]  Signup page displays hero section with headline: "Join ClipCommerce"
-   [ ]  Two clear account type cards displayed side-by-side:
    -   **Creator Card:**
        -   Icon: 🎬 or similar
        -   Heading: "I'm a Creator"
        -   Description: "Manage clippers, automate payments, and grow your reach"
        -   Features list: "- Connect with clippers - Set payment rates - Track performance"
        -   CTA button: "Sign Up as Creator"
    -   **Clipper Card:**
        -   Icon: ✂️ or similar
        -   Heading: "I'm a Clipper"
        -   Description: "Find creators, submit clips, and earn money automatically"
        -   Features list: "- Browse creators - Submit clips - Get paid fast"
        -   CTA button: "Sign Up as Clipper"
-   [ ]  Cards are visually distinct and equal in prominence
-   [ ]  Mobile responsive (cards stack vertically on mobile)
-   [ ]  "Already have an account? Log in" link at bottom

**UI/UX Notes:**

-   Use visual differentiation (different accent colors for each card)
-   Include subtle animations on hover
-   Consider adding testimonial quotes from each user type

* * * * *

#### Story 1.2: Creator Account Creation

**As a** content creator\
**I want to** create a Creator account\
**So that** I can manage clippers and process payments

**Acceptance Criteria:**

-   [ ]  Clicking "Sign Up as Creator" redirects to `/signup/creator`
-   [ ]  Page displays "Create Your Creator Account" heading
-   [ ]  Form fields:
    -   Email address (validated format)
    -   Password (min 8 characters, shows strength indicator)
    -   Confirm password (must match)
    -   Display name (public-facing name)
    -   Checkbox: "I agree to Terms of Service and Privacy Policy"
-   [ ]  "Create Account" button
-   [ ]  Link: "Wrong account type? Sign up as Clipper instead"
-   [ ]  On submit:
    -   System validates all fields
    -   Creates User record with `role = CREATOR`
    -   Sends email verification (optional for MVP)
    -   Automatically logs in user
    -   Redirects to `/onboarding/creator/step-1` (Stripe Connect)
-   [ ]  Display clear error messages for validation failures
-   [ ]  Password field has "show/hide" toggle

**Technical Notes:**

-   Hash password with bcrypt before storing
-   Set session cookie with role information
-   Email must be unique across all users

* * * * *

#### Story 1.3: Clipper Account Creation

**As a** clipper\
**I want to** create a Clipper account\
**So that** I can submit clips and earn money

**Acceptance Criteria:**

-   [ ]  Clicking "Sign Up as Clipper" redirects to `/signup/clipper`
-   [ ]  Page displays "Create Your Clipper Account" heading
-   [ ]  Form fields:
    -   Email address (validated format)
    -   Password (min 8 characters, shows strength indicator)
    -   Confirm password (must match)
    -   Display name (public-facing name)
    -   Checkbox: "I agree to Terms of Service and Privacy Policy"
-   [ ]  "Create Account" button
-   [ ]  Link: "Wrong account type? Sign up as Creator instead"
-   [ ]  On submit:
    -   System validates all fields
    -   Creates User record with `role = CLIPPER`
    -   Sends email verification (optional for MVP)
    -   Automatically logs in user
    -   Redirects to `/onboarding/clipper/step-1` (YouTube OAuth)
-   [ ]  Display clear error messages for validation failures
-   [ ]  Password field has "show/hide" toggle

**Technical Notes:**

-   Hash password with bcrypt before storing
-   Set session cookie with role information
-   Email must be unique across all users

* * * * *

#### Story 1.4: Role-Based Redirect After Login

**As a** user\
**I want to** be automatically directed to my role-specific dashboard after login\
**So that** I don't have to manually navigate

**Acceptance Criteria:**

-   [ ]  User enters email + password on `/login` page
-   [ ]  System authenticates credentials
-   [ ]  System checks user role from database
-   [ ]  If role = CREATOR:
    -   Redirect to `/dashboard` (Creator dashboard)
-   [ ]  If role = CLIPPER:
    -   Redirect to `/clipper` (Clipper dashboard)
-   [ ]  If role = ADMIN:
    -   Redirect to `/admin` (Admin panel)
-   [ ]  If invalid credentials:
    -   Show error: "Invalid email or password"
    -   Do not reveal which field is incorrect (security)

* * * * *

#### Story 1.5: Role-Based Access Control & 403 Error Handling

**As the** system\
**I need to** prevent users from accessing dashboards that don't match their role\
**So that** we maintain security and prevent confusion

**Acceptance Criteria:**

-   [ ]  Implement Next.js middleware to check user role on protected routes
-   [ ]  Protected route patterns:
    -   `/dashboard/*` → Requires CREATOR role
    -   `/clipper/*` → Requires CLIPPER role
    -   `/admin/*` → Requires ADMIN role
-   [ ]  If user attempts to access wrong dashboard:
    -   Return 403 Forbidden status
    -   Display custom 403 page with messaging:
        -   "You don't have access to this page"
        -   If Creator accessing `/clipper`: "This is the Clipper dashboard. Go to your Creator dashboard instead."
        -   If Clipper accessing `/dashboard`: "This is the Creator dashboard. Go to your Clipper dashboard instead."
    -   Show button to navigate to correct dashboard
-   [ ]  Logged-out users attempting to access protected routes:
    -   Redirect to `/login` with `?redirect=[original_url]` parameter
    -   After login, redirect back to original URL (if authorized)

**Technical Implementation:**

typescript

```
// middleware.ts
export function middleware(request: NextRequest) {
  const session = await getSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && session?.user?.role !== 'CREATOR') {
    return new Response('Forbidden', { status: 403 });
  }

  if (pathname.startsWith('/clipper') && session?.user?.role !== 'CLIPPER') {
    return new Response('Forbidden', { status: 403 });
  }

  // ... similar checks for admin
}
```

* * * * *

### Epic 2: Creator Onboarding Flow ⭐ UPDATED

#### Story 2.1: Creator Stripe Connect Onboarding

**As a** new creator\
**I want to** connect my Stripe account\
**So that** I can receive subscription payments and send payouts to clippers

**Acceptance Criteria:**

-   [ ]  After account creation, creator lands on `/onboarding/creator/step-1`
-   [ ]  Page displays:
    -   Progress indicator: "Step 1 of 3: Connect Payment Account"
    -   Heading: "Connect Your Stripe Account"
    -   Description: "You'll use Stripe to receive subscription payments and pay your clippers securely."
    -   List of what's needed: "- Business/personal details - Bank account - Tax information"
    -   "Connect with Stripe" button
-   [ ]  Clicking button triggers Stripe Connect onboarding:
    -   Generates Stripe Connect account link via API
    -   Redirects to Stripe-hosted onboarding
    -   Creator completes KYC, bank details, tax forms
-   [ ]  Stripe redirects back to `/onboarding/creator/stripe-return`
-   [ ]  System verifies Stripe account setup is complete:
    -   Stores `stripeAccountId` in CreatorProfile
    -   Marks `stripeConnected = true`
    -   Redirects to `/onboarding/creator/step-2`
-   [ ]  If user navigates away before completing:
    -   Show warning: "You need to complete Stripe setup to continue"
    -   Allow "Resume Stripe Setup" action

**Technical Notes:**

-   Use Stripe Connect Express accounts (simplest for MVP)
-   Store Stripe account status (details_submitted, charges_enabled, payouts_enabled)
-   Handle failure states (declined verification, missing info)

* * * * *

#### Story 2.2: Creator Profile Setup

**As a** new creator\
**I want to** set up my public profile and payment rates\
**So that** clippers can discover me and understand my terms

**Acceptance Criteria:**

-   [ ]  After Stripe completion, creator lands on `/onboarding/creator/step-2`
-   [ ]  Page displays:
    -   Progress indicator: "Step 2 of 3: Create Your Profile"
    -   Heading: "Set Up Your Creator Profile"
    -   Form fields:
        -   **Display Name** (required, max 50 chars)
        -   **Profile Description** (optional, textarea, max 500 chars, shows character count)
        -   **Avatar Upload** (optional, accepts image files, max 5MB, shows preview)
        -   **Profile URL Slug** (auto-generated from display name, editable, validates uniqueness)
            -   Shows preview: `clipcommerce.com/creator/[slug]`
-   [ ]  Payment rate configuration section:
    -   Heading: "Set Your Payment Rate"
    -   Input: **Amount ($)** (number, min $1, max $1000)
    -   Input: **Per X Views** (number, min 100, max 1,000,000)
    -   Real-time calculation preview: "Clippers will earn $X per 1,000 views"
    -   Dropdown: **Payout Mode** (One-time only for MVP, recurring disabled/grayed out)
    -   Input: **Minimum Payout** (number, default $10, min $5, max $100)
-   [ ]  "Continue" button
-   [ ]  On submit:
    -   Validates all required fields
    -   Uploads avatar to storage (Vercel Blob or S3)
    -   Creates CreatorProfile record
    -   Redirects to `/onboarding/creator/step-3`
-   [ ]  "Save as Draft & Continue Later" option (saves partial data)

**UI/UX Notes:**

-   Real-time slug validation (check uniqueness as user types)
-   Show helpful examples for description: "Ex: I'm a gaming YouTuber with 200K subs..."
-   Payment rate calculator helper: "Most creators pay $15-30 per 1,000 views"

* * * * *

#### Story 2.3: Creator Subscription Plan Selection

**As a** new creator\
**I want to** choose a subscription plan\
**So that** I can start using the platform

**Acceptance Criteria:**

-   [ ]  After profile setup, creator lands on `/onboarding/creator/step-3`
-   [ ]  Page displays:
    -   Progress indicator: "Step 3 of 3: Choose Your Plan"
    -   Heading: "Select Your Subscription Plan"
    -   Three plan cards (side-by-side on desktop, stacked on mobile): **Starter Plan:**
        -   Price: $29/month
        -   Features:
            -   Up to 10 active clippers
            -   Unlimited clip submissions
            -   Basic analytics
            -   Email support
        -   "Select Starter" button**Pro Plan:** (Recommended badge)
        -   Price: $79/month
        -   Features:
            -   Up to 50 active clippers
            -   Unlimited clip submissions
            -   Advanced analytics & ROI tracking
            -   Auto-approval system
            -   Priority support
        -   "Select Pro" button**Enterprise Plan:**
        -   Price: $199/month
        -   Features:
            -   Unlimited active clippers
            -   Unlimited clip submissions
            -   Full analytics suite
            -   Auto-approval system
            -   API access
            -   Dedicated account manager
        -   "Select Enterprise" button
-   [ ]  All plans show: "+ Variable transaction fee (configurable)"
-   [ ]  Clicking any plan button:
    -   Creates Stripe Checkout session for subscription
    -   Redirects to Stripe Checkout
    -   Creator enters payment method
    -   Stripe redirects back to `/onboarding/creator/complete`
-   [ ]  System verifies subscription is active:
    -   Stores subscription ID and tier in CreatorProfile
    -   Marks onboarding as complete
    -   Redirects to `/dashboard` (creator dashboard with welcome message)

**Business Notes:**

-   Offer 7-day free trial for all plans (captured in Stripe)
-   Allow plan changes later from settings
-   Prorate upgrades/downgrades

* * * * *

### Epic 3: Clipper Onboarding Flow ⭐ UPDATED

#### Story 3.1: Clipper YouTube OAuth Connection

**As a** new clipper\
**I want to** connect my YouTube channel\
**So that** I can verify ownership of my clips

**Acceptance Criteria:**

-   [ ]  After account creation, clipper lands on `/onboarding/clipper/step-1`
-   [ ]  Page displays:
    -   Progress indicator: "Step 1 of 3: Connect YouTube"
    -   Heading: "Connect Your YouTube Channel"
    -   Description: "We'll verify that the clips you submit belong to your channel. This prevents fraud and protects creators."
    -   List of permissions needed:
        -   "- View your YouTube channel"
        -   "- View your video metadata"
    -   Note: "We never post or modify your content"
    -   "Connect with YouTube" button (styled with YouTube branding)
-   [ ]  Clicking button initiates YouTube OAuth:
    -   Redirects to Google consent screen
    -   Requests scopes: `youtube.readonly`, `youtube.force-ssl`
    -   User grants permissions
-   [ ]  Google redirects back to `/onboarding/clipper/youtube-callback`
-   [ ]  System processes OAuth response:
    -   Exchanges code for access token + refresh token
    -   Calls YouTube API to get channel details
    -   Stores in ClipperProfile:
        -   `youtubeChannelId`
        -   `youtubeChannelName`
        -   `youtubeAccessToken` (encrypted)
        -   `youtubeRefreshToken` (encrypted)
    -   Redirects to `/onboarding/clipper/step-2`
-   [ ]  If user denies permissions:
    -   Redirects back with error message
    -   Shows: "YouTube connection is required to submit clips"
    -   Allows retry

**Security Notes:**

-   Store tokens encrypted at rest
-   Implement token refresh logic (tokens expire)
-   Handle revoked permissions gracefully

* * * * *

#### Story 3.2: Clipper Stripe Connect Onboarding

**As a** new clipper\
**I want to** connect my payout account\
**So that** I can receive payments from creators

**Acceptance Criteria:**

-   [ ]  After YouTube connection, clipper lands on `/onboarding/clipper/step-2`
-   [ ]  Page displays:
    -   Progress indicator: "Step 2 of 3: Connect Payout Account"
    -   Heading: "Connect Your Stripe Account"
    -   Description: "Receive payments securely and instantly when creators approve your clips."
    -   List of what's needed: "- Personal details - Bank account - Tax information (for US)"
    -   "Connect with Stripe" button
-   [ ]  Clicking button triggers Stripe Connect onboarding:
    -   Generates Stripe Connect account link (Express account type)
    -   Redirects to Stripe-hosted onboarding
    -   Clipper completes personal info, bank details, tax forms
-   [ ]  Stripe redirects back to `/onboarding/clipper/stripe-return`
-   [ ]  System verifies Stripe account:
    -   Stores `stripeAccountId` in User table
    -   Marks `stripeConnected = true`
    -   Redirects to `/onboarding/clipper/step-3`
-   [ ]  If setup incomplete:
    -   Allow "Resume Stripe Setup" action
    -   Block access to submission features until complete

* * * * *

#### Story 3.3: Clipper Profile Completion & Dashboard Access

**As a** new clipper\
**I want to** complete my profile and access my dashboard\
**So that** I can start browsing creators and submitting clips

**Acceptance Criteria:**

-   [ ]  After Stripe completion, clipper lands on `/onboarding/clipper/step-3`
-   [ ]  Page displays:
    -   Progress indicator: "Step 3 of 3: Complete Your Profile"
    -   Heading: "You're Almost Ready!"
    -   Display YouTube channel connected (show channel name + avatar)
    -   Display Stripe account connected (show "✓ Payment account connected")
    -   Optional: Upload profile avatar
    -   "Complete Setup" button
-   [ ]  Clicking button:
    -   Marks onboarding as complete
    -   Redirects to `/clipper` (clipper dashboard)
-   [ ]  Dashboard shows empty state:
    -   Welcome message: "Welcome to ClipCommerce, [Name]!"
    -   CTA card: "Browse Creators - Find creators to work with"
    -   CTA card: "Learn How It Works - Watch tutorial video"

* * * * *

### Epic 4: Role-Based Dashboard Access ⭐ UPDATED

#### Story 4.1: Creator Dashboard Homepage

**As a** creator\
**I want to** see an overview of my clipper activity\
**So that** I can monitor my community at a glance

**Acceptance Criteria:**

-   [ ]  Navigating to `/dashboard` shows creator dashboard (creators only)
-   [ ]  If accessed by non-creator, show 403 error (see Story 1.5)
-   [ ]  Dashboard layout:
    -   **Header:** "Welcome back, [Creator Name]"
    -   **Metrics Cards (Row 1):**
        -   Total Paid Out (this month + all-time)
        -   Active Clippers (count)
        -   Pending Submissions (count, clickable)
        -   Total Views Generated (this month)
    -   **Quick Actions (Row 2):**
        -   "Review Submissions" button (redirects to `/dashboard/submissions`)
        -   "Manage Clippers" button (redirects to `/dashboard/clippers`)
        -   "View Analytics" button (redirects to `/dashboard/analytics`)
    -   **Recent Activity Feed (Row 3):**
        -   Last 10 activities (new submission, payment sent, clipper joined)
        -   Each item shows: clipper name, action, timestamp
        -   "View All" link
    -   **Sidebar Navigation:**
        -   Dashboard (home icon)
        -   Clippers (users icon)
        -   Submissions (inbox icon)
        -   Analytics (chart icon)
        -   Settings (gear icon)
        -   Logout
-   [ ]  Mobile: sidebar collapses to hamburger menu
-   [ ]  Empty states shown if no data:
    -   "No active clippers yet - Share your profile to get started"
    -   "No pending submissions"

* * * * *

#### Story 4.2: Clipper Dashboard Homepage

**As a** clipper\
**I want to** see my earnings and activity overview\
**So that** I can track my performance at a glance

**Acceptance Criteria:**

-   [ ]  Navigating to `/clipper` shows clipper dashboard (clippers only)
-   [ ]  If accessed by non-clipper, show 403 error (see Story 1.5)
-   [ ]  Dashboard layout:
    -   **Header:** "Welcome back, [Clipper Name]"
    -   **Metrics Cards (Row 1):**
        -   Total Earned (this month + all-time)
        -   Pending Earnings (approved but not yet paid)
        -   Active Clips (count)
        -   Clips Pending Review (count)
    -   **Quick Actions (Row 2):**
        -   "Submit New Clip" button (redirects to `/clipper/submit`)
        -   "Browse Creators" button (redirects to `/clipper/creators`)
        -   "View Earnings" button (redirects to `/clipper/earnings`)
    -   **Recent Submissions (Row 3):**
        -   Last 10 submissions with status badges
        -   Each shows: video thumbnail, title, creator, status, earnings
        -   "View All" link → `/clipper/history`
    -   **Sidebar Navigation:**
        -   Dashboard (home icon)
        -   My Communities (users icon)
        -   Submit Clip (upload icon)
        -   Submission History (list icon)
        -   Earnings (dollar icon)
        -   Settings (gear icon)
        -   Logout
-   [ ]  Mobile: sidebar collapses to hamburger menu
-   [ ]  Empty states:
    -   "No communities yet - Browse creators to get started"
    -   "No submissions yet - Submit your first clip!"

* * * * *

### Epic 5: Creator Community Management (Unchanged, but clarified)

#### Story 5.1: Creator Views Public Profile

**As a** creator\
**I want to** view and share my public profile\
**So that** clippers can discover me and join my community

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/settings/profile`
-   [ ]  Page shows:
    -   Current profile preview (as clippers see it)
    -   Public profile URL: `clipcommerce.com/creator/[slug]`
    -   "Copy Link" button (copies URL

H

Continue

#### Story 5.1: Creator Views Public Profile (Continued)

**As a** creator\
**I want to** view and share my public profile\
**So that** clippers can discover me and join my community

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/settings/profile`
-   [ ]  Page shows:
    -   Current profile preview (as clippers see it)
    -   Public profile URL: `clipcommerce.com/creator/[slug]`
    -   "Copy Link" button (copies URL to clipboard)
    -   "Share on Twitter" button (opens pre-filled tweet)
    -   "Edit Profile" button → redirects to edit form
-   [ ]  Public profile page (`/creator/[slug]`) displays:
    -   Creator avatar and display name
    -   Description/bio
    -   Payment rate: "$X per Y views"
    -   Payout mode indicator
    -   Number of active clippers
    -   "Join Community" button (for logged-in clippers)
    -   If not logged in: "Sign up as a Clipper to join"
-   [ ]  Profile is publicly accessible (no auth required to view)
-   [ ]  Profile is SEO-optimized (meta tags, Open Graph)

* * * * *

#### Story 5.2: Clipper Browses Creator Marketplace

**As a** clipper\
**I want to** browse all available creators\
**So that** I can find opportunities that match my content style

**Acceptance Criteria:**

-   [ ]  Clipper navigates to `/clipper/creators` (clippers only)
-   [ ]  Page displays "Creator Marketplace" heading
-   [ ]  Grid/list of creator cards, each showing:
    -   Avatar
    -   Display name
    -   Short description (truncated to 100 chars)
    -   Payment rate: "$X per Y views"
    -   Number of active clippers
    -   "View Profile" button
    -   "Join Community" button (if not already joined)
    -   "Joined" badge (if already a member)
-   [ ]  Filters (Phase 2):
    -   Sort by: Payment rate (high to low), Most clippers, Newest
    -   Search by name or keywords
-   [ ]  Clicking "View Profile" → opens creator's public profile in new tab
-   [ ]  Clicking "Join Community" → triggers application flow (Story 5.3)
-   [ ]  Empty state: "No creators available yet - Check back soon!"
-   [ ]  Pagination: Show 24 creators per page

* * * * *

#### Story 5.3: Clipper Joins Creator Community

**As a** clipper\
**I want to** apply to join a creator's community\
**So that** I can start submitting clips to them

**Acceptance Criteria:**

-   [ ]  Clipper clicks "Join Community" from marketplace or creator profile
-   [ ]  System validates:
    -   Clipper has completed onboarding (YouTube + Stripe connected)
    -   Clipper hasn't already applied/joined this creator
-   [ ]  If validation passes:
    -   Show confirmation modal:
        -   "Apply to [Creator Name]'s Community?"
        -   Shows creator's rate and terms
        -   "Confirm Application" button
-   [ ]  Clicking "Confirm":
    -   Creates ClipperMembership record (status: PENDING)
    -   Shows success toast: "Application sent! Awaiting creator approval."
    -   Button changes to "Application Pending" (disabled)
-   [ ]  System sends notification to creator (in-app)
-   [ ]  If validation fails:
    -   If onboarding incomplete: "Complete your profile setup first"
    -   If already applied: "You've already applied to this creator"
    -   If already member: "You're already a member"

**Technical Notes:**

-   Ensure unique constraint on (creatorId, clipperId) in database
-   Log application timestamp for analytics

* * * * *

#### Story 5.4: Creator Reviews Clipper Applications

**As a** creator\
**I want to** review and approve/reject clipper applications\
**So that** I control who can submit clips to me

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/clippers`
-   [ ]  Page shows two tabs:
    -   **Pending Applications** (default)
    -   **Active Clippers**
-   [ ]  Pending Applications tab displays:
    -   List of all pending applications
    -   Each application shows:
        -   Clipper avatar + display name
        -   YouTube channel name (verified badge)
        -   Application date (e.g., "Applied 2 days ago")
        -   "View Channel" link (opens YouTube in new tab)
        -   "Approve" button (green)
        -   "Reject" button (red)
-   [ ]  Clicking "Approve":
    -   Updates ClipperMembership status to ACTIVE
    -   Shows success toast: "[Clipper] approved!"
    -   Moves clipper to Active Clippers tab
    -   Sends notification to clipper: "You've been accepted by [Creator]!"
-   [ ]  Clicking "Reject":
    -   Shows confirmation modal: "Reject [Clipper]'s application?"
    -   Optional: Text field for rejection reason
    -   "Confirm Rejection" button
    -   Updates ClipperMembership status to REJECTED
    -   Shows toast: "Application rejected"
    -   Sends notification to clipper (if reason provided, include it)
-   [ ]  Empty state: "No pending applications"
-   [ ]  Badge count on sidebar: "Clippers (3)" shows pending count

* * * * *

#### Story 5.5: Creator Views Active Clippers

**As a** creator\
**I want to** see all my active clippers and their performance\
**So that** I can manage my community effectively

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/clippers` → Active Clippers tab
-   [ ]  Page displays table of all active clippers:
    -   Columns:
        -   Clipper Name (with avatar)
        -   YouTube Channel
        -   Date Joined
        -   Total Clips Submitted
        -   Total Clips Approved
        -   Approval Rate (%)
        -   Total Earned
        -   Auto-Approval Status (toggle switch)
        -   Actions (dropdown menu)
-   [ ]  Auto-Approval toggle (per clipper):
    -   Default: OFF (manual review required)
    -   Toggle ON: Future submissions auto-approved
    -   Shows confirmation: "Enable auto-approval for [Clipper]?"
    -   Disabled for clippers with <5 approved clips (too early)
-   [ ]  Actions dropdown:
    -   "View Profile"
    -   "View Submissions"
    -   "Remove from Community" (shows confirmation modal)
-   [ ]  Sort by any column (click column header)
-   [ ]  Search bar: filter by clipper name or channel
-   [ ]  Empty state: "No active clippers yet - Share your profile to get started"

**Business Logic:**

-   Auto-approval only available for clippers with ≥5 approved clips
-   Approval rate calculated as: (approved / total_submitted) * 100

* * * * *

### Epic 6: Clip Submission Workflow (Clippers)

#### Story 6.1: Clipper Submits Clip

**As a** clipper\
**I want to** submit a YouTube clip URL for review\
**So that** I can get paid when it's approved

**Acceptance Criteria:**

-   [ ]  Clipper navigates to `/clipper/submit`
-   [ ]  If clipper has 0 active communities:
    -   Show empty state: "Join a creator community first"
    -   "Browse Creators" button
-   [ ]  If clipper has ≥1 community:
    -   Form displays:
        -   **Step 1: Select Creator**
            -   Dropdown: "Choose a creator" (lists all active communities)
            -   Shows creator rate below: "Earns $X per Y views"
        -   **Step 2: Enter Video URL**
            -   Text input: "YouTube video URL"
            -   Placeholder: "<https://youtube.com/watch?v=>..."
            -   Real-time validation (shows ✓ or ✗ icon)
        -   "Verify & Preview" button
-   [ ]  After entering valid URL, clicking "Verify & Preview":
    -   System calls YouTube API: `videos.list(id=VIDEO_ID)`
    -   Validates: `video.snippet.channelId === clipper.youtubeChannelId`
    -   If **verification fails**:
        -   Show error: "This video doesn't belong to your channel ([Channel Name])"
        -   Clear form, allow retry
    -   If **verification succeeds**:
        -   Display video preview card:
            -   Video thumbnail
            -   Video title
            -   Current view count
            -   Publish date
            -   Calculated payout: "$X (based on Y views)"
        -   Show "Submit for Review" button
-   [ ]  Clicking "Submit for Review":
    -   Creates Submission record:
        -   creatorId
        -   clipperId
        -   youtubeVideoId
        -   videoTitle, videoThumbnail, videoPublishedAt
        -   viewsAtSubmit = viewsCurrent
        -   status = PENDING (or APPROVED if auto-approval enabled)
    -   If manual review required:
        -   Shows success message: "Submitted! Waiting for [Creator] to review."
        -   Redirects to `/clipper/history`
    -   If auto-approved:
        -   Shows success: "Auto-approved! Payment processing."
        -   Triggers payment immediately (see Epic 7)
        -   Redirects to `/clipper/history`

**Technical Notes:**

-   Cache video metadata to avoid redundant API calls
-   Handle rate limiting (YouTube API quota)
-   Store verification timestamp
-   Prevent duplicate submissions (same video + creator)

* * * * *

#### Story 6.2: Clipper Views Submission History

**As a** clipper\
**I want to** see all my submitted clips and their status\
**So that** I can track which ones are pending, approved, or paid

**Acceptance Criteria:**

-   [ ]  Clipper navigates to `/clipper/history`
-   [ ]  Page displays "Submission History" heading
-   [ ]  Filter tabs:
    -   All (default)
    -   Pending Review
    -   Approved
    -   Rejected
-   [ ]  Table displays all submissions:
    -   Columns:
        -   Video (thumbnail + title, clickable to YouTube)
        -   Creator
        -   Submitted Date
        -   Views (current count)
        -   Status (badge: Pending/Approved/Rejected/Paid)
        -   Earned (amount, or "---" if not paid)
        -   Actions (View Details)
-   [ ]  Status badges with color coding:
    -   Pending: Yellow
    -   Approved: Green
    -   Rejected: Red
    -   Paid: Blue with checkmark
-   [ ]  Clicking video thumbnail/title opens YouTube video in new tab
-   [ ]  "View Details" shows modal with:
    -   Full video metadata
    -   Submission timeline (submitted, reviewed, paid dates)
    -   Payment details (if paid)
    -   Rejection reason (if rejected)
-   [ ]  Search bar: filter by video title or creator name
-   [ ]  Sort by: Date (newest first), Views (highest first), Earnings
-   [ ]  Pagination: 50 submissions per page
-   [ ]  Empty state: "No submissions yet - Submit your first clip!"

* * * * *

### Epic 7: Creator Review & Approval System

#### Story 7.1: Creator Views Submission Queue

**As a** creator\
**I want to** see all pending clip submissions\
**So that** I can review and approve them for payment

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/submissions`
-   [ ]  Default view: Pending Review tab
-   [ ]  Other tabs: Approved, Rejected, All
-   [ ]  Pending submissions displayed as cards (not table for better UX):
    -   Each card shows:
        -   Video thumbnail (large, clickable)
        -   Video title
        -   Clipper name + avatar
        -   YouTube channel verification badge
        -   Submission date (e.g., "Submitted 3 hours ago")
        -   Current view count (with last updated timestamp)
        -   Calculated payout: "$X (based on Y views)"
        -   "Approve" button (green, prominent)
        -   "Reject" button (red, less prominent)
        -   "Refresh Views" icon button (updates view count)
-   [ ]  Clicking video thumbnail opens YouTube video in new tab
-   [ ]  Clicking clipper name opens clipper profile modal
-   [ ]  Filter options:
    -   By clipper (dropdown)
    -   By date range (date picker)
    -   By view count range (min/max inputs)
-   [ ]  Sort options:
    -   Newest first (default)
    -   Oldest first
    -   Highest views first
    -   Highest payout first
-   [ ]  Bulk actions (select multiple):
    -   "Approve Selected" button
    -   "Reject Selected" button
    -   Disabled for MVP, enabled in Phase 2
-   [ ]  Real-time updates: New submissions appear automatically (WebSocket or polling)
-   [ ]  Empty state: "No pending submissions - You're all caught up!"
-   [ ]  Badge count on sidebar: "Submissions (12)" shows pending count

**UI/UX Notes:**

-   Use card layout for visual appeal
-   Show payout prominently to help decision-making
-   Include "Preview" button to watch first 15 seconds inline

* * * * *

#### Story 7.2: Creator Approves Submission

**As a** creator\
**I want to** approve a clip submission\
**So that** the clipper gets paid automatically

**Acceptance Criteria:**

-   [ ]  Creator clicks "Approve" button on a submission
-   [ ]  System validates:
    -   Submission is still in PENDING status
    -   Creator has sufficient funds/active subscription
-   [ ]  If validation passes:
    -   Show confirmation modal:
        -   "Approve this submission?"
        -   Video preview
        -   Current view count
        -   Calculated payout: "$X"
        -   Platform fee: "$Y (Z%)"
        -   Total charge: "$X + $Y = $[Total]"
        -   "Confirm Approval" button
-   [ ]  Clicking "Confirm":
    -   Updates Submission status to APPROVED
    -   Triggers payment processing (see Story 7.4)
    -   Shows loading state: "Processing payment..."
    -   On success:
        -   Shows toast: "Approved! Payment sent to [Clipper]."
        -   Removes submission from pending queue
        -   Adds to Approved tab
    -   On payment failure:
        -   Updates status to PAYMENT_FAILED
        -   Shows error: "Approval succeeded but payment failed. Contact support."
        -   Admin notified for manual resolution
-   [ ]  If validation fails:
    -   Show appropriate error message
    -   Don't update submission status

* * * * *

#### Story 7.3: Creator Rejects Submission

**As a** creator\
**I want to** reject a clip submission\
**So that** I don't pay for clips that don't meet my standards

**Acceptance Criteria:**

-   [ ]  Creator clicks "Reject" button on a submission
-   [ ]  Show rejection modal:
    -   "Reject this submission?"
    -   Video preview
    -   Text area: "Reason for rejection (optional)"
    -   Suggested reasons (clickable chips):
        -   "Video quality is too low"
        -   "Not aligned with my content"
        -   "Incorrect source material"
        -   "Duplicate submission"
        -   "Other"
    -   "Confirm Rejection" button
    -   "Cancel" button
-   [ ]  Clicking chip auto-fills text area
-   [ ]  Clicking "Confirm":
    -   Updates Submission status to REJECTED
    -   Stores rejection reason (if provided)
    -   Shows toast: "Submission rejected"
    -   Removes from pending queue
    -   Adds to Rejected tab
    -   Sends notification to clipper with reason
-   [ ]  Rejected submissions don't trigger any payment

**Business Rules:**

-   Track rejection reasons for analytics
-   High rejection rate for a clipper may affect reputation
-   Clippers can't resubmit same video after rejection

* * * * *

#### Story 7.4: Automated Payment Processing on Approval

**As the** system\
**I need to** automatically process payment when creator approves submission\
**So that** clippers get paid instantly without manual intervention

**Technical Acceptance Criteria:**

-   [ ]  Payment triggered immediately after approval confirmation
-   [ ]  Payment calculation:

```
  viewsAtApproval = submission.viewsCurrent
  paymentAmount = (viewsAtApproval / creator.rateViews) * creator.rateAmount
  platformCommission = admin.platformFeePercentage (e.g., 10%)
  platformFee = paymentAmount * platformCommission
  clipperNet = paymentAmount - platformFee
```
- [ ] Minimum payout check:
```
  if clipperNet < creator.minPayout:
    - Show warning to creator
    - Creator can override and approve anyway
    - If overridden, proceed with payment
```

-   [ ]  Stripe Connect transfer creation:

javascript

```
  const transfer = await stripe.transfers.create({
    amount: Math.round(clipperNet * 100), // Convert to cents
    currency: 'usd',
    destination: clipper.stripeAccountId,
    transfer_group: `submission_${submissionId}`,
    metadata: {
      submissionId: submission.id,
      creatorId: creator.id,
      clipperId: clipper.id,
      videoId: submission.youtubeVideoId
    }
  });

  // Application fee (platform commission)
  const applicationFee = await stripe.applicationFees.create({
    amount: Math.round(platformFee * 100),
    currency: 'usd',
    transfer: transfer.id
  });
```

-   [ ]  On transfer success:
    -   Update Submission:
        -   status = PAID
        -   paymentAmount = paymentAmount
        -   platformFee = platformFee
        -   clipperNet = clipperNet
        -   stripeTransferId = transfer.id
        -   paidAt = new Date()
    -   Create Transaction record:
        -   submissionId
        -   amount, platformFee, clipperNet
        -   stripeTransferId
        -   status = 'succeeded'
    -   Send email to clipper (Phase 2): "Payment received: $X"
    -   Update creator's total payout metrics
    -   Update clipper's total earnings metrics
-   [ ]  On transfer failure:
    -   Update Submission status to PAYMENT_FAILED
    -   Log error details (insufficient funds, invalid account, network error)
    -   Create admin notification
    -   Send email to creator: "Payment failed - please check your Stripe account"
    -   Store failed transaction attempt for retry
-   [ ]  Retry logic (for transient failures):
    -   Retry up to 3 times with exponential backoff (1min, 5min, 15min)
    -   After 3 failures, mark for manual review
-   [ ]  Handle edge cases:
    -   Creator's Stripe account suspended: Block payment, notify creator
    -   Clipper's Stripe account suspended: Block payment, notify both parties
    -   Insufficient creator funds: Show clear error, suggest adding funds

**Security & Compliance:**

-   Validate all amounts are positive numbers
-   Use atomic database transactions (prevent partial updates)
-   Log all payment attempts for audit trail
-   Encrypt sensitive data (Stripe IDs, amounts)
-   Rate limit payment processing (prevent abuse)

* * * * *

### Epic 8: Analytics & Reporting

#### Story 8.1: Creator Analytics Dashboard

**As a** creator\
**I want to** see detailed analytics about my clippers and payouts\
**So that** I can measure ROI and optimize my strategy

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/analytics`
-   [ ]  Page displays three main sections:

**Section 1: Key Metrics (Top)**

-   [ ]  Four metric cards:
    -   **Total Paid Out**
        -   Amount (this month)
        -   Amount (all-time)
        -   % change vs. last month
    -   **Total Views Generated**
        -   Views (this month)
        -   Views (all-time)
        -   % change vs. last month
    -   **Total Clips Approved**
        -   Count (this month)
        -   Count (all-time)
    -   **ROI Estimate**
        -   Calculation: `(total_views * assumed_CPM) / total_paid`
        -   Configurable CPM in settings (default: $5)
        -   Shows: "Estimated $X revenue from $Y paid out"

**Section 2: Performance Charts (Middle)**

-   [ ]  **Views Over Time** (line chart):
    -   X-axis: Date (last 30 days, configurable to 7/30/90 days)
    -   Y-axis: Total views
    -   Tooltip shows: Date, view count
-   [ ]  **Clips Submitted per Week** (bar chart):
    -   X-axis: Week
    -   Y-axis: Number of clips
    -   Stacked bars: Approved (green) vs. Rejected (red)
-   [ ]  **Payout Distribution** (pie chart):
    -   Shows top 5 clippers by earnings
    -   Remaining clippers grouped as "Others"
    -   Tooltip: Clipper name, amount, percentage

**Section 3: Clipper Leaderboard (Bottom)**

-   [ ]  Table showing top 20 clippers:
    -   Columns:
        -   Rank
        -   Clipper Name (with avatar)
        -   Total Views
        -   Total Clips
        -   Approval Rate (%)
        -   Total Earned
    -   Sort by any column
    -   Default sort: Total Views (descending)
-   [ ]  "View All Clippers" button → redirects to `/dashboard/clippers`

**Additional Features:**

-   [ ]  Date range filter (dropdown): Last 7/30/90 days, All time, Custom range
-   [ ]  Export button: Download CSV with all data
-   [ ]  Refresh button: Update view counts for all active videos
-   [ ]  Empty state: "No data yet - Approve some clips to see analytics"

**Technical Notes:**

-   Cache aggregated data (refresh every 15 minutes)
-   Use Recharts library for visualizations
-   Responsive design (charts stack vertically on mobile)

* * * * *

#### Story 8.2: Clipper Earnings Dashboard

**As a** clipper\
**I want to** see my earnings breakdown and submission performance\
**So that** I can understand which creators and content types pay best

**Acceptance Criteria:**

-   [ ]  Clipper navigates to `/clipper/earnings`
-   [ ]  Page displays:

**Section 1: Earnings Summary (Top)**

-   [ ]  Four metric cards:
    -   **Total Earned**
        -   Amount (this month)
        -   Amount (all-time)
    -   **Pending Earnings**
        -   Amount from approved but unpaid submissions
    -   **Active Clips**
        -   Count of approved clips still generating views
    -   **Average per Clip**
        -   Total earned / total approved clips

**Section 2: Earnings Breakdown**

-   [ ]  **By Creator** (bar chart):
    -   Shows earnings from each creator
    -   X-axis: Creator name
    -   Y-axis: Amount earned
-   [ ]  **By Month** (line chart):
    -   X-axis: Month (last 12 months)
    -   Y-axis: Total earnings
    -   Shows growth trend

**Section 3: Top Performing Clips**

-   [ ]  Table showing top 20 clips by earnings:
    -   Columns:
        -   Video (thumbnail + title)
        -   Creator
        -   Views
        -   Earned
        -   CPV (earnings per 1K views)
    -   Sort by any column
    -   Default: Earned (descending)
-   [ ]  Clicking video opens in YouTube

**Section 4: Payment History**

-   [ ]  List of all completed payments:
    -   Date received
    -   Creator name
    -   Amount
    -   Transaction ID (Stripe transfer ID)
    -   "View Receipt" button (generates PDF invoice)
-   [ ]  Pagination: 50 per page
-   [ ]  Export: Download CSV of all payments (for tax purposes)

**Additional Features:**

-   [ ]  Filter by creator
-   [ ]  Filter by date range
-   [ ]  Search by video title
-   [ ]  Empty state: "No earnings yet - Submit and get clips approved to start earning"

* * * * *

### Epic 9: Settings & Configuration

#### Story 9.1: Creator Payment Settings

**As a** creator\
**I want to** update my payment rates and payout settings\
**So that** I can adjust my pricing strategy

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/settings/payment`
-   [ ]  Page displays editable form:
    -   **Payment Rate:**
        -   Amount ($): Number input
        -   Per X Views: Number input
        -   Real-time preview: "Clippers earn $X per 1,000 views"
    -   **Payout Mode:**
        -   Radio buttons: One-time (MVP) / Recurring (Phase 2, grayed out)
    -   **Minimum Payout:**
        -   Number input (min $5, max $100)
        -   Helper text: "Clippers will only be paid if earnings exceed this amount"
    -   "Save Changes" button
-   [ ]  On save:
    -   Validates all inputs
    -   Updates CreatorProfile record
    -   Shows toast: "Payment settings updated"
    -   Note: "New rates apply to future submissions only"
-   [ ]  Warning if rates are significantly different from platform average:
    -   "Your rate is 50% lower than average - you may get fewer clippers"
    -   "Your rate is 50% higher than average - great for attracting clippers!"

* * * * *

#### Story 9.2: Creator Subscription Management

**As a** creator\
**I want to** view and manage my subscription plan\
**So that** I can upgrade or cancel as needed

**Acceptance Criteria:**

-   [ ]  Creator navigates to `/dashboard/settings/subscription`
-   [ ]  Page displays:
    -   **Current Plan:**
        -   Plan name (Starter/Pro/Enterprise)
        -   Price per month
        -   Current usage: "X / Y clippers"
        -   Next billing date
        -   Payment method (last 4 digits)
    -   **Plan Features:**
        -   List of included features
        -   Usage limits
    -   **Actions:**
        -   "Upgrade Plan" button (if not on highest tier)
        -   "Downgrade Plan" button (if not on lowest tier)
        -   "Update Payment Method" button
        -   "Cancel Subscription" button (red, less prominent)
-   [ ]  Clicking "Upgrade Plan":
    -   Shows plan comparison modal
    -   Highlights benefits of upgrade
    -   "Upgrade to [Plan]" button
    -   Redirects to Stripe Checkout
    -   Prorates remaining time on current plan
-   [ ]  Clicking "Cancel Subscription":
    -   Shows confirmation modal with serious warnings:
        -   "Are you sure? You'll lose access to:"
        -   List of features that will be lost
        -   "Your data will be preserved but clippers can't submit new clips"
    -   Text input: "Type CANCEL to confirm"
    -   "Confirm Cancellation" button
    -   On confirm: Cancels at end of billing period
    -   Shows: "Subscription will end on [date]"

* * * * *

#### Story 9.3: Clipper Connected Accounts Management

**As a** clipper\
**I want to** manage my connected YouTube and Stripe accounts\
**So that** I can update or reconnect if needed

**Acceptance Criteria:**

-   [ ]  Clipper navigates to `/clipper/settings/accounts`
-   [ ]  Page displays two sections:

**YouTube Connection:**

-   [ ]  Shows:
    -   Channel name
    -   Channel avatar
    -   Subscriber count (from API)
    -   Connection status: "Connected" (green badge)
    -   Last verified: Timestamp
-   [ ]  Actions:
    -   "Refresh Connection" button (re-verifies access token)
    -   "Disconnect" button (red, shows warning)
-   [ ]  If disconnected:
    -   Shows warning: "Reconnect to submit clips"
    -   "Reconnect YouTube" button

**Stripe Connection:**

-   [ ]  Shows:
    -   Account status: "Active" / "Pending Verification" / "Suspended"
    -   Payout account (last 4 digits of bank account)
    -   Default currency
-   [ ]  Actions:
    -   "Update Payout Account" button (redirects to Stripe dashboard)
    -   "Disconnect" button (red, shows warning)
-   [ ]  If disconnected:
    -   Shows warning: "Reconnect to receive payments"
    -   "Reconnect Stripe" button

* * * * *

#### Story 9.4: Admin Platform Settings

**As an** admin\
**I want to** configure platform-wide settings\
**So that** I can control commission rates and system behavior

**Acceptance Criteria:**

-   [ ]  Admin navigates to `/admin/settings`
-   [ ]  Page displays settings form:

**Financial Settings:**

-   [ ]  **Platform Commission (%)**:
    -   Number input (0-100, decimals allowed)
    -   Current value displayed
    -   Helper text: "Percentage taken from each transaction"
    -   Real-time preview: "On a $100 payment, platform earns $X"
-   [ ]  "Save" button

**System Settings:**

-   [ ]  **New User Registrations:**
    -   Toggle: Enabled / Disabled
    -   Helper: "Disable to stop accepting new signups"
-   [ ]  **Maintenance Mode:**
    -   Toggle: Enabled / Disabled
    -   Helper: "Show maintenance page to all users"

**Feature Flags (Phase 2):**

-   [ ]  **Recurring Payments:**
    -   Toggle: Enabled / Disabled
-   [ ]  **Auto-Approval:**
    -   Toggle: Enabled / Disabled
-   [ ]  **Multi-Platform Support:**
    -   Checkboxes: YouTube, TikTok, Instagram

**API Settings (Phase 3):**

-   [ ]  **YouTube API Quota:**
    -   Display: Current usage / Daily limit
    -   Warning if >80% used
-   [ ]  **Webhook URL:**
    -   Text input for external integrations
-   [ ]  On save:
    -   Validates inputs
    -   Updates PlatformSettings table
    -   Shows toast: "Settings updated"
    -   Logs change in audit trail (who changed what, when)

**Security:**

-   [ ]  All changes logged with admin user ID and timestamp
-   [ ]  Critical changes (commission rate) require confirmation modal
-   [ ]  Some settings (maintenance mode) take effect immediately, others on next request

* * * * *

8\. Information Architecture (UPDATED)
--------------------------------------

### Sitemap

```
Public Pages:
├── Landing Page (/)
├── About (/about)
├── How It Works (/how-it-works)
├── Pricing (/pricing)
├── Creator Marketplace (/creators) [Public browse, limited info]
├── Creator Profile (/creator/[slug]) [Public]
├── Login (/login)
└── Signup (/signup) ⭐ NEW
    ├── Account Type Selection [Choose Creator or Clipper]
    ├── Creator Signup (/signup/creator) ⭐ NEW
    └── Clipper Signup (/signup/clipper) ⭐ NEW

Creator Onboarding (/onboarding/creator): ⭐ NEW
├── Step 1: Connect Stripe (/onboarding/creator/step-1)
├── Step 2: Create Profile (/onboarding/creator/step-2)
├── Step 3: Choose Plan (/onboarding/creator/step-3)
├── Stripe Return Handler (/onboarding/creator/stripe-return)
└── Onboarding Complete (/onboarding/creator/complete)

Clipper Onboarding (/onboarding/clipper): ⭐ NEW
├── Step 1: Connect YouTube (/onboarding/clipper/step-1)
├── Step 2: Connect Stripe (/onboarding/clipper/step-2)
├── Step 3: Complete Profile (/onboarding/clipper/step-3)
├── YouTube Callback (/onboarding/clipper/youtube-callback)
├── Stripe Return Handler (/onboarding/clipper/stripe-return)
└── Onboarding Complete (/onboarding/clipper/complete)

Creator Dashboard (/dashboard): [Creators Only] ⭐ UPDATED
├── Overview (/dashboard) [Default home]
├── Clippers (/dashboard/clippers)
│   ├── Pending Applications Tab
│   └── Active Clippers Tab
├── Submissions (/dashboard/submissions)
│   ├── Pending Review Tab [Default]
│   ├── Approved Tab
│   ├── Rejected Tab
│   └── All Tab
├── Analytics (/dashboard/analytics)
├── Settings (/dashboard/settings)
│   ├── Profile (/dashboard/settings/profile)
│   ├── Payment Rates (/dashboard/settings/payment)
│   ├── Subscription (/dashboard/settings/subscription)
│   └── Account (/dashboard/settings/account)
└── Notifications (/dashboard/notifications)

Clipper Dashboard (/clipper): [Clippers Only] ⭐ UPDATED
├── Overview (/clipper) [Default home]
├── My Communities (/clipper/communities)
├── Creator Marketplace (/clipper/creators) [Full access]
├── Submit Clip (/clipper/submit)
├── Submission History (/clipper/history)
│   ├── All Tab [Default]
│   ├── Pending Tab
│   ├── Approved Tab
│   └── Rejected Tab
├── Earnings (/clipper/earnings)
├── Settings (/clipper/settings)
│   ├── Connected Accounts (/clipper/settings/accounts)
│   ├── Profile (/clipper/settings/profile)
│   └── Payout Methods (/clipper/settings/p
```

H

Continue

### Sitemap (Continued)

```
Clipper Dashboard (/clipper): [Clippers Only] ⭐ UPDATED (Continued)
├── Settings (/clipper/settings)
│   ├── Connected Accounts (/clipper/settings/accounts)
│   ├── Profile (/clipper/settings/profile)
│   └── Payout Methods (/clipper/settings/payouts)
└── Notifications (/clipper/notifications)

Admin Panel (/admin): [Admins Only]
├── Dashboard (/admin) [Platform metrics overview]
├── Users (/admin/users)
│   ├── Creators Tab
│   ├── Clippers Tab
│   └── User Detail (/admin/users/[id])
├── Transactions (/admin/transactions)
├── Submissions (/admin/submissions) [All platform submissions]
├── Settings (/admin/settings)
├── Audit Logs (/admin/logs)
└── Support (/admin/support)

Error Pages:
├── 403 Forbidden (/403) [Role-based access denied]
├── 404 Not Found (/404)
└── 500 Server Error (/500)
```

---

## 9. System Architecture (UPDATED)

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                 (Next.js 14 with App Router)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │   Creator    │  │   Clipper    │      │
│  │   Website    │  │   Dashboard  │  │   Dashboard  │      │
│  │              │  │  /dashboard  │  │   /clipper   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Role-Based Access Control Middleware         │   │
│  │  - Check user.role on protected routes               │   │
│  │  - Enforce /dashboard → CREATOR only                 │   │
│  │  - Enforce /clipper → CLIPPER only                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Routes
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Next.js API)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │   Business   │  │   Payment    │      │
│  │   Service    │  │    Logic     │  │   Service    │      │
│  │ NextAuth.js  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Role-Based API Handlers                  │   │
│  │  - Validate role from session                        │   │
│  │  - Return 403 if unauthorized                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   YouTube    │    │  PostgreSQL  │    │    Stripe    │
│   API v3     │    │   Database   │    │   Connect    │
│              │    │              │    │              │
│  - OAuth     │    │ - Users      │    │ - Express    │
│  - Video     │    │ - Profiles   │    │   Accounts   │
│    metadata  │    │ - Submissions│    │ - Transfers  │
│  - Channel   │    │ - Transactions│   │ - Billing    │
│    verify    │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                  ┌──────────────┐
                  │    Prisma    │
                  │     ORM      │
                  └──────────────┘

Background Jobs (Future - Phase 2):
┌──────────────────────────────────┐
│        Cron Jobs / Workers       │
│  - View count refresh (daily)    │
│  - Recurring payment processor   │
│  - Email notifications queue     │
│  - Abandoned onboarding reminders│
└──────────────────────────────────┘
```

* * * * *

### Database Schema (PostgreSQL + Prisma) - UPDATED

prisma

```
// ============================================
// USER MANAGEMENT WITH ROLE ENFORCEMENT
// ============================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String
  role              Role      @default(CLIPPER)
  emailVerified     DateTime?
  stripeAccountId   String?   @unique  // For receiving payouts (both roles)
  stripeCustomerId  String?   @unique  // For subscriptions (creators only)

  onboardingComplete Boolean  @default(false)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations (one-to-one with profiles)
  creatorProfile    CreatorProfile?
  clipperProfile    ClipperProfile?

  @@index([email])
  @@index([role])
}

enum Role {
  CREATOR
  CLIPPER
  ADMIN
}

// ============================================
// CREATOR PROFILE
// ============================================

model CreatorProfile {
  id                 String   @id @default(cuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Public Profile
  displayName        String
  description        String?  @db.Text
  avatarUrl          String?
  slug               String   @unique

  // Payment Settings
  rateAmount         Float    @default(20.00)    // e.g., $20
  rateViews          Int      @default(1000)     // per 1,000 views
  payoutMode         PayoutMode @default(ONE_TIME)
  minPayout          Float    @default(10.00)    // Minimum payout threshold

  // Subscription Info
  subscriptionTier   SubscriptionTier @default(STARTER)
  subscriptionStatus SubscriptionStatus @default(TRIALING)
  stripeSubscriptionId String? @unique
  currentPeriodEnd   DateTime?

  // Usage Limits (based on tier)
  maxClippers        Int      @default(10)       // Enforced by subscription tier

  // Metadata
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Relations
  clippers           ClipperMembership[]
  submissions        Submission[]

  @@index([slug])
  @@index([subscriptionStatus])
}

enum PayoutMode {
  ONE_TIME    // Pay once upon approval (MVP)
  RECURRING   // Pay as views grow (Phase 2)
}

enum SubscriptionTier {
  STARTER      // $29/mo, up to 10 clippers
  PRO          // $79/mo, up to 50 clippers
  ENTERPRISE   // $199/mo, unlimited clippers
}

enum SubscriptionStatus {
  TRIALING     // In free trial period
  ACTIVE       // Paid and active
  PAST_DUE     // Payment failed
  CANCELED     // Subscription canceled
  INCOMPLETE   // Subscription setup not finished
}

// ============================================
// CLIPPER PROFILE
// ============================================

model ClipperProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  displayName       String
  avatarUrl         String?

  // YouTube OAuth
  youtubeChannelId  String   @unique
  youtubeChannelName String
  youtubeAccessToken String  @db.Text  // Encrypted
  youtubeRefreshToken String @db.Text  // Encrypted
  youtubeTokenExpiry DateTime?

  // Stats
  totalEarned       Float    @default(0)
  totalSubmissions  Int      @default(0)
  totalApproved     Int      @default(0)
  approvalRate      Float    @default(0) // Calculated: approved/total * 100

  // Metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastActiveAt      DateTime @default(now())

  // Relations
  memberships       ClipperMembership[]
  submissions       Submission[]

  @@index([youtubeChannelId])
  @@index([approvalRate])
}

// ============================================
// CLIPPER-CREATOR RELATIONSHIP
// ============================================

model ClipperMembership {
  id          String   @id @default(cuid())
  creatorId   String
  clipperId   String

  status      MembershipStatus @default(PENDING)
  autoApprove Boolean  @default(false)  // Creator can enable auto-approval

  // Timestamps
  appliedAt   DateTime @default(now())
  approvedAt  DateTime?
  rejectedAt  DateTime?

  // Relations
  creator     CreatorProfile @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  clipper     ClipperProfile @relation(fields: [clipperId], references: [id], onDelete: Cascade)

  @@unique([creatorId, clipperId])
  @@index([creatorId, status])
  @@index([clipperId, status])
}

enum MembershipStatus {
  PENDING   // Awaiting creator approval
  ACTIVE    // Approved, can submit clips
  REJECTED  // Application rejected
  SUSPENDED // Temporarily suspended by creator
}

// ============================================
// SUBMISSIONS & PAYMENTS
// ============================================

model Submission {
  id              String   @id @default(cuid())
  creatorId       String
  clipperId       String

  // Video Details
  youtubeVideoId  String
  videoTitle      String
  videoThumbnail  String
  videoPublishedAt DateTime
  videoUrl        String   // Full YouTube URL

  // View Tracking
  viewsAtSubmit   Int      // Views when first submitted
  viewsCurrent    Int      // Most recent view count
  lastViewUpdate  DateTime @default(now())
  viewsPaid       Int      @default(0)  // For recurring payments (Phase 2)

  // Status & Workflow
  status          SubmissionStatus @default(PENDING)
  submittedAt     DateTime @default(now())
  reviewedAt      DateTime?

  // Payment Details
  paymentAmount   Float?   // Total payment calculated
  platformFee     Float?   // Commission taken by platform
  clipperNet      Float?   // Net amount paid to clipper

  // Stripe Info
  stripeTransferId String? @unique
  paidAt          DateTime?

  // Rejection
  rejectionReason String?  @db.Text

  // Relations
  creator         CreatorProfile @relation(fields: [creatorId], references: [id])
  clipper         ClipperProfile @relation(fields: [clipperId], references: [id])
  transaction     Transaction?

  @@unique([youtubeVideoId, creatorId])  // Prevent duplicate submissions
  @@index([creatorId, status])
  @@index([clipperId, status])
  @@index([status, submittedAt])
}

enum SubmissionStatus {
  PENDING         // Awaiting creator review
  APPROVED        // Creator approved, payment processing
  REJECTED        // Creator rejected
  PAID            // Payment successful
  PAYMENT_FAILED  // Payment attempt failed
}

// ============================================
// TRANSACTIONS & FINANCIAL RECORDS
// ============================================

model Transaction {
  id                String   @id @default(cuid())
  submissionId      String   @unique

  // Financial Details
  amount            Float    // Total payout amount
  platformFee       Float    // Commission taken
  clipperNet        Float    // Net paid to clipper
  currency          String   @default("usd")

  // Stripe Info
  stripeTransferId  String   @unique
  status            TransactionStatus @default(PENDING)
  failureReason     String?  @db.Text

  // Retry Info (for failed payments)
  retryCount        Int      @default(0)
  lastRetryAt       DateTime?

  // Timestamps
  createdAt         DateTime @default(now())
  completedAt       DateTime?

  // Relations
  submission        Submission @relation(fields: [submissionId], references: [id])

  @@index([status])
  @@index([createdAt])
}

enum TransactionStatus {
  PENDING    // Payment initiated
  SUCCEEDED  // Payment completed successfully
  FAILED     // Payment failed
  REFUNDED   // Payment was refunded
}

// ============================================
// PLATFORM SETTINGS (ADMIN)
// ============================================

model PlatformSettings {
  id                String   @id @default(cuid())
  key               String   @unique
  value             String   @db.Text
  description       String?

  updatedBy         String?  // Admin user ID
  updatedAt         DateTime @updatedAt

  @@index([key])
}

// Example settings stored:
// - platform_commission_percentage: "10.0"
// - maintenance_mode: "false"
// - registrations_enabled: "true"
// - recurring_payments_enabled: "false"
// - youtube_api_quota_used: "5432"

// ============================================
// NOTIFICATIONS (Phase 2)
// ============================================

model Notification {
  id          String   @id @default(cuid())
  userId      String
  type        NotificationType
  title       String
  message     String   @db.Text
  actionUrl   String?

  read        Boolean  @default(false)
  readAt      DateTime?

  createdAt   DateTime @default(now())

  @@index([userId, read])
  @@index([createdAt])
}

enum NotificationType {
  SUBMISSION_APPROVED
  SUBMISSION_REJECTED
  PAYMENT_RECEIVED
  APPLICATION_APPROVED
  APPLICATION_REJECTED
  NEW_SUBMISSION
  PAYMENT_FAILED
  SUBSCRIPTION_EXPIRING
}

// ============================================
// AUDIT LOGS (Security & Compliance)
// ============================================

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  userRole    Role?
  action      String   // "user.signup", "submission.approve", "settings.update"
  resource    String   // "User", "Submission", "PlatformSettings"
  resourceId  String?

  changes     Json?    // Before/after values
  ipAddress   String?
  userAgent   String?

  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

---

## 10. Recommended Tech Stack (Unchanged)

*(This section remains the same as in v1.0)*

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** React Context + Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js (via Next.js API Routes)
- **API Architecture:** RESTful API
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5

### External Services
- **Payments:** Stripe Connect
- **YouTube Integration:** YouTube Data API v3
- **Hosting:** Vercel
- **Database Hosting:** Neon

---

## 11. Development Plan & Milestones (UPDATED)

### Phase 1: MVP Foundation (Weeks 1-4)

#### Week 1: Setup & Account Creation System ⭐ UPDATED
**Goal:** Project scaffolding, database, and unified signup flow

**Tasks:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Tailwind CSS + shadcn/ui components
- [ ] Configure Neon PostgreSQL database
- [ ] Set up Prisma ORM with updated schema (User, Role, profiles)
- [ ] **Implement unified signup page** (`/signup`)
  - Account type selection UI (Creator vs. Clipper cards)
  - Route to separate signup forms
- [ ] **Create Creator signup flow** (`/signup/creator`)
  - Email/password form
  - Create User with role=CREATOR
- [ ] **Create Clipper signup flow** (`/signup/clipper`)
  - Email/password form
  - Create User with role=CLIPPER
- [ ] Configure NextAuth.js with email/password
- [ ] **Implement role-based middleware**
  - Check user.role on protected routes
  - Enforce /dashboard → CREATOR only
  - Enforce /clipper → CLIPPER only
- [ ] Create login page with role-based redirect
- [ ] Create 403 error page with helpful messaging
- [ ] Set up Vercel deployment pipeline

**Deliverable:** ✅ Users can sign up as Creator or Clipper, login redirects to correct dashboard

---

#### Week 2: Onboarding Flows ⭐ UPDATED
**Goal:** Complete role-specific onboarding experiences

**Creator Onboarding:**
- [ ] **Step 1: Stripe Connect** (`/onboarding/creator/step-1`)
  - Generate Stripe Connect onboarding link
  - Redirect to Stripe
  - Handle return callback
  - Store stripeAccountId
- [ ] **Step 2: Profile Setup** (`/onboarding/creator/step-2`)
  - Display name, description, avatar upload
  - Slug generation and validation
  - Payment rate configuration
  - Min payout threshold
- [ ] **Step 3: Subscription Selection** (`/onboarding/creator/step-3`)
  - Display three plan cards (Starter/Pro/Enterprise)
  - Stripe Billing integration
  - Create subscription
  - Store subscription details
- [ ] Onboarding completion page
- [ ] Mark onboardingComplete = true
- [ ] Redirect to `/dashboard`

**Clipper Onboarding:**
- [ ] **Step 1: YouTube OAuth** (`/onboarding/clipper/step-1`)
  - Google Cloud Console setup
  - YouTube OAuth flow
  - Store channel ID, tokens
- [ ] **Step 2: Stripe Connect** (`/onboarding/clipper/step-2`)
  - Stripe Express account setup for payouts
  - Store stripeAccountId
- [ ] **Step 3: Profile Completion** (`/onboarding/clipper/step-3`)
  - Show connected accounts summary
  - Optional avatar upload
- [ ] Onboarding completion page
- [ ] Mark onboardingComplete = true
- [ ] Redirect to `/clipper`

**Onboarding Guards:**
- [ ] Middleware checks onboardingComplete before allowing dashboard access
- [ ] Incomplete users redirected to appropriate onboarding step

**Deliverable:** ✅ Both user types complete tailored onboarding flows

---

#### Week 3: Core Workflows & Role-Based Dashboards ⭐ UPDATED
**Goal:** Build separate dashboard experiences and core features

**Creator Dashboard:**
- [ ] Build `/dashboard` homepage
  - Metrics cards (paid out, clippers, submissions, views)
  - Recent activity feed
  - Quick actions
  - Sidebar navigation
- [ ] Build creator profile page (public + editing)
- [ ] Build creator marketplace listing (public browse)
- [ ] Build `/dashboard/clippers` page
  - Pending Applications tab
  - Active Clippers tab
  - Approve/reject functionality
- [ ] Build `/dashboard/submissions` page
  - Pending submissions queue (card layout)
  - Approve/reject buttons
  - Video preview
  - View count display
- [ ] Settings pages (profile, payment rates)

**Clipper Dashboard:**
- [ ] Build `/clipper` homepage
  - Earnings cards (total, pending, active clips)
  - Recent submissions
  - Quick actions
  - Sidebar navigation
- [ ] Build `/clipper/creators` (marketplace view for clippers)
  - Creator cards with rates
  - Join Community button
- [ ] Build `/clipper/submit` page
  - Creator selection dropdown
  - URL input and validation
  - YouTube verification
  - Video preview
- [ ] Build `/clipper/communities` page
  - List of joined creators
  - Application status
- [ ] Build `/clipper/history` page
  - All submissions with status
  - Filter tabs

**Community Management:**
- [ ] Implement "Join Community" flow
  - Create ClipperMembership (status: PENDING)
  - Notify creator
- [ ] Creator approve/reject application
  - Update membership status
  - Notify clipper

**Deliverable:** ✅ Full creator and clipper workflows operational

---

#### Week 4: Payment Processing & MVP Polish ⭐ UPDATED
**Goal:** Automated payments and production readiness

**Tasks:**
- [ ] Implement YouTube video verification logic
  - Call YouTube Data API
  - Compare channelId
  - Cache video metadata
- [ ] Build payment calculation logic
  - viewsCurrent × rate formula
  - Platform commission calculation
  - Minimum payout validation
- [ ] Integrate Stripe Connect transfers
  - Transfer from creator to clipper
  - Application fee collection
  - Handle success/failure states
- [ ] Store transaction records
- [ ] Build creator analytics dashboard (basic version)
  - Total paid, views, clips
  - Clipper leaderboard
- [ ] Build clipper earnings dashboard
  - Total earned, pending
  - Top clips
- [ ] Implement admin panel basics
  - Platform settings (commission %)
  - User list
  - Transaction history
- [ ] Add error handling and loading states across all pages
- [ ] Implement proper error boundaries
- [ ] Security audit:
  - SQL injection prevention (Prisma handles this)
  - XSS prevention
  - CSRF tokens
  - Rate limiting on API routes
  - Encrypt OAuth tokens at rest
- [ ] Performance optimization:
  - Database indexing
  - Image optimization
  - Code splitting
- [ ] End-to-end testing:
  - Creator signup → onboarding → approve clip → payment
  - Clipper signup → onboarding → submit clip → get paid
- [ ] Write deployment documentation

**Deliverable:** ✅ Fully functional MVP with payments, ready for beta launch

---

### Phase 2: Enhancement & Scale (Weeks 5-12)

*(Same as v1.0, no changes to Phase 2 tasks)*

---

## 12. API Endpoints (UPDATED)

### Authentication
```
POST   /api/auth/signup              # Universal signup (requires role in body)
POST   /api/auth/signup/creator      # Create creator account
POST   /api/auth/signup/clipper      # Create clipper account
POST   /api/auth/login               # Login (role-based redirect)
POST   /api/auth/logout              # Logout
GET    /api/auth/session             # Get current session + role
```

### Onboarding
```
# Creator Onboarding
GET    /api/onboarding/creator/stripe-link      # Generate Stripe Connect link
GET    /api/onboarding/creator/status           # Check onboarding progress
POST   /api/onboarding/creator/profile          # Save profile (Step 2)
POST   /api/onboarding/creator/subscription     # Create subscription (Step 3)
PUT    /api/onboarding/creator/complete         # Mark onboarding complete

# Clipper Onboarding
GET    /api/onboarding/clipper/youtube-auth     # Initiate YouTube OAuth
POST   /api/onboarding/clipper/youtube-callback # Handle OAuth callback
GET    /api/onboarding/clipper/stripe-link      # Generate Stripe Connect link
GET    /api/onboarding/clipper/status           # Check onboarding progress
PUT    /api/onboarding/clipper/complete         # Mark onboarding complete
```

### Role-Based Access (Middleware validates role for all endpoints below)

**Creator Endpoints** (Require role=CREATOR)
```
GET    /api/creator/profile              # Get own profile
PUT    /api/creator/profile              # Update profile
PUT    /api/creator/settings/payment     # Update payment settings
GET    /api/creator/clippers             # Get clippers (active + pending)
POST   /api/creator/clippers/approve     # Approve clipper application
POST   /api/creator/clippers/reject      # Reject clipper application
PUT    /api/creator/clippers/[id]/auto-approve  # Toggle auto-approval
GET    /api/creator/submissions          # Get submissions (filterable by status)
PUT    /api/creator/submissions/[id]/approve    # Approve submission + pay
PUT    /api/creator/submissions/[id]/reject     # Reject submission
GET    /api/creator/analytics            # Get analytics data
GET    /api/creator/subscription         # Get subscription details
POST   /api/creator/subscription/update  # Change subscription plan
```

**Clipper Endpoints** (Require role=CLIPPER)
```
GET    /api/clipper/profile              # Get own profile
PUT    /api/clipper/profile              # Update profile
GET    /api/clipper/communities          # Get joined communities
POST   /api/clipper/communities/join     # Apply to join creator
GET    /api/clipper/submissions          # Get own submissions
POST   /api/clipper/submissions/create   # Submit new clip
GET    /api/clipper/submissions/[id]     # Get submission details
GET    /api/clipper/earnings             # Get earnings summary
GET    /api/clipper/earnings/history     # Get payment history
```

**Public Endpoints** (No auth required)
```
GET    /api/creators                     # List all creators (marketplace)
GET    /api/creators/[slug]              # Get creator public profile
```

**YouTube Integration**
```
POST   /api/youtube/verify               # Verify video ownership
GET    /api/youtube/video/[id]           # Get video metadata
POST   /api/youtube/refresh-views        # Refresh view count
```

**Admin Endpoints** (Require role=ADMIN)
```
GET    /api/admin/settings               # Get all platform settings
PUT    /api/admin/settings               # Update platform settings
GET    /api/admin/users                  # List all users (filterable by role)
PUT    /api/admin/users/[id]/suspend     # Suspend user
GET    /api/admin/transactions           # View all transactions
GET    /api/admin/audit-logs             # View audit logs
```

---

## 13. Success Metrics & KPIs (Unchanged from v1.0)

*(Metrics remain the same)*

---

## 14. Risk Assessment & Mitigation (Unchanged from v1.0)

*(Risks remain the same)*

---

## 15. Go-to-Market Strategy (Unchanged from v1.0)

*(GTM strategy remains the same)*

---

## 16. Assumptions & Open Questions (UPDATED)

### Critical Assumptions (Need Validation)

1. **Assumption:** Users will clearly understand the difference between Creator and Clipper accounts at signup
   - **Validation Method:** User testing on signup flow, track signup completion rates by account type
   - **Risk if Wrong:** Users create wrong account type, requires support to fix or account migration feature

2. **Assumption:** Separate dashboards for each role won't confuse users who might want both perspectives
   - **Validation Method:** Beta user interviews, track 403 error frequency
   - **Risk if Wrong:** May need to allow users to have both roles (requires significant schema changes)

3. **Assumption:** Role-based access control at signup is sufficient (no need to switch roles later)
   - **Validation Method:** Support ticket analysis, user feedback
   - **Risk if Wrong:** May need admin tool to change user roles or migration flow

4-7. *(Same as v1.0)*

---

### Open Questions (Need Research)

1. **UX:** Should we allow users to create both Creator AND Clipper accounts with same email?
   - **Current Decision:** No - one email = one role
   - **Alternative:** Allow dual roles with account switching
   - **Action:** Validate in beta, assess demand
   - **Timeline:** Month 2

2. **Security:** How do we prevent users from gaming the system by creating both account types?
   - **Action:** Implement fraud detection (same payment method, same IP, etc.)
   - **Timeline:** Before public launch

3. **Onboarding:** Should onboarding be skippable with "Complete Later" option?
   - **Current Decision:** No - must complete to access features
   - **Risk:** Higher drop-off during onboarding
   - **Action:** A/B test in beta
   - **Timeline:** Week 6-8

4. **Roles:** Will we ever need more granular roles (e.g., Agency, Manager, Team Member)?
   - **Current Decision:** Not for MVP
   - **Action:** Design database schema to allow role expansion
   - **Timeline:** Phase 3

5-6. *(Same as v1.0)*

---

## 17. Next Steps & Handoff to Development (UPDATED)

### Immediate Actions (This Week)

1. **Validate Updated Assumptions:**
   - [ ] Interview 3-5 potential users about account type selection UX
   - [ ] Create mockups of signup flow (Figma/Excalidraw)
   - [ ] Test YouTube OAuth flow
   - [ ] Review Stripe Connect documentation for both account types

2. **Setup Development Environment:**
   - [ ] Create GitHub repository
   - [ ] Initialize Next.js project
   - [ ] Set up Neon database
   - [ ] Create updated Prisma schema with roles
   - [ ] Set up Vercel account
   - [ ] Set up Google Cloud Console
   - [ ] Set up Stripe account

3. **Design Key Pages:**
   - [ ] Signup page (account type selection)
   - [ ] Creator signup form
   - [ ] Clipper signup form
   - [ ] Creator dashboard wireframe
   - [ ] Clipper dashboard wireframe
   - [ ] 403 error page

---

### Developer Agent Handoff Checklist

When ready to begin development with an AI agent, provide:

✅ **This updated PRD v1.1** (with role-based account creation)
✅ **GitHub repo link**
✅ **API credentials:**
   - Google Cloud Console project
   - Stripe API keys (test mode)
   - Database connection string
✅ **Prioritized feature list:** Start with Week 1 (account creation system)
✅ **Design references:** Wireframes for signup flow

**Suggested First Prompt to Developer Agent:**
```
I need you to build ClipCommerce MVP with role-based account creation.

Key Requirements:
1. Users choose between Creator or Clipper account at signup
2. Completely separate dashboards for each role (/dashboard for creators, /clipper for clippers)
3. Role-based access control enforced by middleware
4. Each role has different onboarding flow

Tech Stack:
- Next.js 14 (App Router) + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- NextAuth.js for auth with role-based sessions
- Tailwind CSS + shadcn/ui

Let's start with:
1. Setting up the updated Prisma schema with User.role enum
2. Creating the unified signup page (/signup) with account type selection
3. Implementing separate signup forms for creators and clippers
4. Setting up role-based middleware for route protection

Here's the Prisma schema... [paste schema from this PRD]

Ready to begin?
```

* * * * *

18\. Appendix
-------------

H

Continue

18\. Appendix (Continued)
-------------------------

### A. Key User Flows (Detailed) - UPDATED

#### Flow 1: Account Creation & Role Selection ⭐ NEW

```
1\. User lands on homepage
2. Clicks "Get Started" or "Sign Up"
3. Redirected to /signup (account type selection page)

4. PAGE DISPLAYS TWO CARDS:

   LEFT CARD - CREATOR:
   - Icon: 🎬
   - Heading: "I'm a Creator"
   - Description: "Manage clippers, automate payments, and grow your reach"
   - Features:
     - Connect with clippers
     - Set payment rates
     - Track performance
   - Button: "Sign Up as Creator"

   RIGHT CARD - CLIPPER:
   - Icon: ✂️
   - Heading: "I'm a Clipper"
   - Description: "Find creators, submit clips, and earn money automatically"
   - Features:
     - Browse creators
     - Submit clips
     - Get paid fast
   - Button: "Sign Up as Clipper"

5. User clicks on their chosen account type

6a. IF CREATOR:
    - Redirect to /signup/creator
    - Show "Create Your Creator Account" form
    - Fields: Email, Password, Confirm Password, Display Name, Terms checkbox
    - Submit → Creates User with role=CREATOR
    - Auto-login
    - Redirect to /onboarding/creator/step-1

6b. IF CLIPPER:
    - Redirect to /signup/clipper
    - Show "Create Your Clipper Account" form
    - Fields: Email, Password, Confirm Password, Display Name, Terms checkbox
    - Submit → Creates User with role=CLIPPER
    - Auto-login
    - Redirect to /onboarding/clipper/step-1
```

---

#### Flow 2: Creator Complete Onboarding ⭐ UPDATED
```
STEP 1: STRIPE CONNECT (/onboarding/creator/step-1)
1. Page shows: "Connect Your Stripe Account"
2. Explanation of why Stripe is needed
3. "Connect with Stripe" button
4. Clicks button → Generates Stripe Connect account link via API
5. Redirects to Stripe-hosted onboarding
6. Creator completes:
   - Business/personal details
   - Bank account information
   - Tax information (W-9 for US)
7. Stripe redirects to /onboarding/creator/stripe-return
8. Backend verifies Stripe account:
   - Stores stripeAccountId in User table
   - Checks details_submitted, charges_enabled
9. If successful → Redirect to /onboarding/creator/step-2
10. If failed → Show error, allow retry

STEP 2: PROFILE SETUP (/onboarding/creator/step-2)
1. Page shows: "Create Your Profile"
2. Form fields:
   - Display Name (required)
   - Description (optional, 500 char max)
   - Avatar Upload (optional, 5MB max)
   - Profile Slug (auto-generated, editable)
   - Preview: clipcommerce.com/creator/[slug]
3. Payment Rate Configuration:
   - Amount ($): Number input
   - Per X Views: Number input
   - Preview: "Clippers will earn $20 per 1,000 views"
   - Payout Mode: One-time (recurring grayed out)
   - Minimum Payout: Default $10
4. "Continue" button
5. On submit:
   - Validates all fields
   - Checks slug uniqueness
   - Uploads avatar to Vercel Blob Storage
   - Creates CreatorProfile record with all settings
6. Redirect to /onboarding/creator/step-3

STEP 3: SUBSCRIPTION SELECTION (/onboarding/creator/step-3)
1. Page shows: "Choose Your Subscription Plan"
2. Three plan cards displayed side-by-side
3. Each card shows:
   - Plan name
   - Price/month
   - Features list
   - Clipper limit
   - "Select [Plan]" button
4. User clicks on desired plan
5. Backend creates Stripe Checkout session:
   - price_id for selected tier
   - trial_period_days: 7
   - customer_email: user.email
6. Redirect to Stripe Checkout
7. Creator enters payment method
8. Stripe processes and redirects to /onboarding/creator/complete
9. Webhook receives subscription.created event:
   - Stores stripeSubscriptionId
   - Sets subscriptionTier
   - Sets subscriptionStatus = ACTIVE
   - Sets currentPeriodEnd
10. Update User: onboardingComplete = true
11. Redirect to /dashboard with success toast

DASHBOARD FIRST VISIT:
1. Shows welcome message: "Welcome to ClipCommerce, [Name]!"
2. Empty state cards:
   - "No clippers yet"
   - "Share your profile to get started"
3. CTA: "Copy Profile Link"
4. Tutorial tooltip (optional)
```

---

#### Flow 3: Clipper Complete Onboarding ⭐ UPDATED
```
STEP 1: YOUTUBE OAUTH (/onboarding/clipper/step-1)
1. Page shows: "Connect Your YouTube Channel"
2. Explanation: "We verify clip ownership to prevent fraud"
3. Permissions list:
   - View your YouTube channel
   - View video metadata
4. "Connect with YouTube" button (styled with YouTube colors)
5. Clicks button → Initiates YouTube OAuth
6. Redirect to Google consent screen:
   - URL: https://accounts.google.com/o/oauth2/v2/auth
   - scopes: youtube.readonly, youtube.force-ssl
   - redirect_uri: /onboarding/clipper/youtube-callback
7. User reviews permissions and clicks "Allow"
8. Google redirects back with authorization code
9. Backend exchanges code for tokens:
   - access_token
   - refresh_token
   - expires_in
10. Call YouTube API: channels.list(part=snippet, mine=true)
11. Extract channel data:
    - channelId
    - channelTitle
    - thumbnails.default.url
12. Store in ClipperProfile:
    - youtubeChannelId
    - youtubeChannelName
    - youtubeAccessToken (ENCRYPTED)
    - youtubeRefreshToken (ENCRYPTED)
    - youtubeTokenExpiry
13. Show success screen with channel info
14. "Continue" button → /onboarding/clipper/step-2

STEP 2: STRIPE CONNECT (/onboarding/clipper/step-2)
1. Page shows: "Connect Your Payout Account"
2. Explanation: "Receive payments securely"
3. "Connect with Stripe" button
4. Generates Stripe Connect account link (Express type)
5. Redirects to Stripe onboarding
6. Clipper completes:
   - Personal information
   - Bank account for payouts
   - Tax information (W-9/1099 for US)
7. Stripe redirects to /onboarding/clipper/stripe-return
8. Backend verifies account:
   - Stores stripeAccountId in User table
   - Checks payouts_enabled
9. If successful → /onboarding/clipper/step-3
10. If failed → Show error, allow retry

STEP 3: PROFILE COMPLETION (/onboarding/clipper/step-3)
1. Page shows: "You're Almost Ready!"
2. Display connected accounts summary:
   - ✓ YouTube: [Channel Name] with avatar
   - ✓ Stripe: Payment account connected
3. Optional: Upload profile avatar (separate from YouTube)
4. "Complete Setup" button
5. On click:
   - Update User: onboardingComplete = true
   - Create audit log entry
6. Show success animation
7. Redirect to /clipper with welcome message

CLIPPER DASHBOARD FIRST VISIT:
1. Welcome message: "Welcome, [Name]!"
2. Empty state:
   - "No communities yet"
   - "Browse creators to get started"
3. CTA cards:
   - "Browse Creators" → /clipper/creators
   - "Learn How It Works" → Tutorial video
```

---

#### Flow 4: Role-Based Login & Redirect ⭐ UPDATED
```
1. User navigates to /login
2. Enters email + password
3. Clicks "Log In"
4. Backend (NextAuth) validates credentials
5. Query User table for matching email + passwordHash
6. If invalid → Show error: "Invalid email or password"
7. If valid:
   a. Create session with user data + role
   b. Check onboardingComplete status
   c. Determine redirect based on role:

   IF role = CREATOR:
     - IF onboardingComplete = false:
       → Redirect to /onboarding/creator/step-1 (or last incomplete step)
     - IF onboardingComplete = true:
       → Redirect to /dashboard

   IF role = CLIPPER:
     - IF onboardingComplete = false:
       → Redirect to /onboarding/clipper/step-1 (or last incomplete step)
     - IF onboardingComplete = true:
       → Redirect to /clipper

   IF role = ADMIN:
     → Redirect to /admin

8. User lands on appropriate dashboard
```

---

#### Flow 5: 403 Error When Accessing Wrong Dashboard ⭐ NEW
```
SCENARIO: Clipper tries to access Creator dashboard

1. Clipper is logged in with session.user.role = CLIPPER
2. Clipper somehow navigates to /dashboard/submissions
   (e.g., via bookmark, manual URL entry, or old link)
3. Next.js middleware intercepts request:
   - Reads session from cookie
   - Extracts user.role
   - Checks route: /dashboard/* requires CREATOR
   - Current role: CLIPPER
   - MISMATCH detected
4. Middleware returns 403 Forbidden
5. Custom 403 page displays:

   ┌────────────────────────────────────────┐
   │          🚫 Access Denied              │
   │                                        │
   │  You don't have access to this page   │
   │                                        │
   │  This is the Creator Dashboard.        │
   │  You're currently logged in as a       │
   │  Clipper.                              │
   │                                        │
   │  [ Go to Clipper Dashboard ]           │
   │                                        │
   │  Need help? Contact support            │
   └────────────────────────────────────────┘

6. Clicking "Go to Clipper Dashboard" → /clipper
7. Audit log records unauthorized access attempt:
   - userId
   - attemptedRoute: /dashboard/submissions
   - actualRole: CLIPPER
   - requiredRole: CREATOR
   - timestamp

REVERSE SCENARIO: Creator accessing Clipper routes
- Same flow, but shows "Creator Dashboard" link
```

---

#### Flow 6: Clip Submission → Payment (Full Journey) ⭐ UPDATED
```
CLIPPER SIDE:

1. Clipper logs in → Lands on /clipper dashboard
2. Clicks "Submit New Clip" → /clipper/submit
3. IF no communities joined:
   - Show empty state: "Join a creator community first"
   - "Browse Creators" button → /clipper/creators
   - User must join community first (see Flow 7)
4. IF has ≥1 community:
   - Form displays
   - Step 1: Dropdown "Select Creator"
   - Lists all active communities (status = ACTIVE)
   - Shows each creator's rate below: "$20 per 1,000 views"
5. Clipper selects creator
6. Step 2: "Enter YouTube Video URL"
   - Text input with placeholder
   - Real-time validation (checks format)
7. Clipper pastes URL: https://youtube.com/watch?v=ABC123
8. Clicks "Verify & Preview"

VERIFICATION PROCESS:

9. Frontend extracts video ID: ABC123
10. API call: POST /api/youtube/verify
    - Body: { videoId: 'ABC123', clipperId: clipper.id }
11. Backend:
    a. Fetch clipper's youtubeChannelId from database
    b. Call YouTube Data API:
       GET https://www.googleapis.com/youtube/v3/videos
       ?part=snippet,statistics
       &id=ABC123
       &key=[API_KEY]
    c. Response contains:
       - snippet.channelId
       - snippet.title
       - snippet.thumbnails.high.url
       - snippet.publishedAt
       - statistics.viewCount
    d. VERIFY: response.snippet.channelId === clipper.youtubeChannelId
    e. IF MISMATCH:
       - Return 403: "Video not owned by your channel"
    f. IF MATCH:
       - Return video metadata + verification success
12. Frontend receives response

IF VERIFICATION FAILED:
13. Show error message:
    "❌ This video doesn't belong to your channel ([Channel Name])"
14. Clear form, allow retry
15. END FLOW

IF VERIFICATION SUCCESS:
16. Display video preview card:
    ┌────────────────────────────────────────┐
    │  [Video Thumbnail]                     │
    │                                        │
    │  Video Title: "Amazing Moments #42"    │
    │  Views: 15,432                         │
    │  Published: Oct 10, 2025               │
    │                                        │
    │  Calculated Payout:                    │
    │  $308.64 (based on 15,432 views)       │
    │                                        │
    │  [ Submit for Review ]                 │
    └────────────────────────────────────────┘
17. Clipper reviews info
18. Clicks "Submit for Review"

SUBMISSION CREATION:

19. API call: POST /api/clipper/submissions/create
    Body: {
      creatorId: [selected creator],
      youtubeVideoId: 'ABC123',
      videoMetadata: [cached from verification]
    }
20. Backend:
    a. Check for duplicate: (youtubeVideoId + creatorId) unique constraint
    b. Check if clipper has ACTIVE membership with this creator
    c. Check creator's auto-approval setting for this clipper
    d. Create Submission record:
       - creatorId
       - clipperId
       - youtubeVideoId
       - videoTitle, videoThumbnail, videoUrl
       - videoPublishedAt
       - viewsAtSubmit = 15432
       - viewsCurrent = 15432
       - status = PENDING (or APPROVED if auto-approved)
       - submittedAt = now()
    e. IF auto-approval enabled:
       - Set status = APPROVED
       - Trigger payment immediately (skip to step 29)
    f. IF manual approval required:
       - Set status = PENDING
       - Continue to step 21

21. Show success toast: "Submitted! Waiting for [Creator Name] to review."
22. Redirect to /clipper/history
23. Submission appears in "Pending" tab

CREATOR SIDE - REVIEW:

24. Creator receives notification (in-app badge):
    - "Submissions (1)" badge on sidebar
25. Creator navigates to /dashboard/submissions
26. Submission appears as card in queue:
    ┌────────────────────────────────────────┐
    │  [Video Thumbnail]                     │
    │                                        │
    │  Amazing Moments #42                   │
    │  By: @ClipperJane (✓ Verified)        │
    │  Submitted: 3 hours ago                │
    │                                        │
    │  Views: 15,432                         │
    │  Payout: $308.64                       │
    │                                        │
    │  [ Approve ]  [ Reject ]               │
    └────────────────────────────────────────┘
27. Creator clicks thumbnail → Opens YouTube video in new tab
28. Creator reviews video, decides to approve
29. Clicks "Approve" button

APPROVAL & PAYMENT:

30. Confirmation modal appears:
    ┌────────────────────────────────────────┐
    │     Approve this submission?           │
    │                                        │
    │  [Video Preview]                       │
    │                                        │
    │  Payout Breakdown:                     │
    │  Clipper payment:    $308.64           │
    │  Platform fee (10%): $30.86            │
    │  ────────────────────────────           │
    │  Total charge:       $339.50           │
    │                                        │
    │  [ Cancel ]  [ Confirm Approval ]      │
    └────────────────────────────────────────┘
31. Creator clicks "Confirm Approval"
32. API call: PUT /api/creator/submissions/[id]/approve
33. Backend payment processing:

    a. Update Submission status to APPROVED
    b. Calculate payment:
       - viewsAtApproval = 15432
       - rateAmount = 20.00
       - rateViews = 1000
       - paymentAmount = (15432 / 1000) * 20 = $308.64

    c. Get platform commission from PlatformSettings:
       - platformCommission = 10% (configurable)

    d. Calculate fees:
       - platformFee = 308.64 * 0.10 = $30.86
       - clipperNet = 308.64 - 30.86 = $277.78

    e. Check minimum payout:
       - IF clipperNet < creator.minPayout:
         → Return error (creator must override)
       - ELSE continue

    f. Create Stripe Connect transfer:
```javascript
       const transfer = await stripe.transfers.create({
         amount: 27778, // $277.78 in cents
         currency: 'usd',
         destination: clipper.stripeAccountId,
         source_transaction: creator.stripeAccountId,
         transfer_group: `submission_${submission.id}`,
         metadata: {
           submissionId: submission.id,
           videoId: 'ABC123',
           viewCount: 15432
         }
       });

       // Platform fee collected automatically
       const fee = await stripe.applicationFees.create({
         amount: 3086, // $30.86 in cents
         currency: 'usd',
         transfer: transfer.id
       });
```

    g. IF transfer succeeds:
       - Update Submission:
         * status = PAID
         * paymentAmount = 308.64
         * platformFee = 30.86
         * clipperNet = 277.78
         * stripeTransferId = transfer.id
         * paidAt = now()
       - Create Transaction record
       - Update ClipperProfile.totalEarned += 277.78
       - Update CreatorProfile stats
       - Create notifications for both parties
       - Return success

    h. IF transfer fails:
       - Update Submission status = PAYMENT_FAILED
       - Log error details
       - Notify admin
       - Return error to frontend

34. Frontend receives success
35. Show toast to creator: "✓ Approved! Payment sent to @ClipperJane"
36. Submission removed from pending queue
37. Submission moves to "Approved" tab

CLIPPER NOTIFICATION:

38. Clipper receives notification:
    "💰 Payment received! You earned $277.78 from [Creator Name]"
39. Clipper checks /clipper/earnings
40. New transaction appears in payment history
41. Total Earned increases by $277.78
42. Submission in /clipper/history shows status: "Paid ✓"

END OF FLOW
```

---

#### Flow 7: Clipper Joins Creator Community ⭐ UPDATED
```
1. Clipper navigates to /clipper/creators (marketplace)
2. Page displays grid of creator cards
3. Each card shows:
   - Creator avatar
   - Display name
   - Short bio
   - Payment rate: "$20 per 1,000 views"
   - Number of active clippers: "12 clippers"
   - Button state:
     * "Join Community" (if not applied)
     * "Application Pending" (if applied, waiting)
     * "Joined ✓" (if active member)
4. Clipper finds attractive creator
5. Clicks "View Profile" → Opens /creator/[slug] in new tab
6. Reviews full profile, decides to join
7. Clicks "Join Community" button
8. System validations:
   a. Check clipper completed onboarding (YouTube + Stripe)
   b. Check not already member/applied to this creator
   c. Check creator accepting new clippers (subscription limit)
9. IF validation fails:
   - Show appropriate error
   - IF onboarding incomplete: "Complete your profile setup first"
   - IF already applied: "You've already applied to this creator"
   - IF subscription limit: "This creator isn't accepting new clippers"
10. IF validation passes:
    - Show confirmation modal:
      ┌────────────────────────────────────────┐
      │  Apply to join [Creator Name]?         │
      │                                        │
      │  Payment Rate: $20 per 1,000 views     │
      │  Payout Mode: One-time                 │
      │  Min Payout: $10                       │
      │                                        │
      │  By applying, you agree to their       │
      │  terms and payment structure.          │
      │                                        │
      │  [ Cancel ]  [ Confirm Application ]   │
      └────────────────────────────────────────┘
11. Clipper clicks "Confirm Application"
12. API call: POST /api/clipper/communities/join
    Body: { creatorId: [id] }
13. Backend:
    a. Create ClipperMembership record:
       - creatorId
       - clipperId
       - status = PENDING
       - appliedAt = now()
       - autoApprove = false
    b. Create notification for creator:
       - type: NEW_CLIPPER_APPLICATION
       - title: "New clipper application"
       - message: "@ClipperJane wants to join your community"
       - actionUrl: /dashboard/clippers
    c. Increment creator's notification badge count
    d. Send email to creator (Phase 2)
14. Show success toast: "Application sent! Awaiting approval from [Creator]."
15. Button changes to "Application Pending" (grayed out, disabled)
16. Clipper can view application status in /clipper/communities

CREATOR APPROVAL:

17. Creator logs in, sees notification badge: "Clippers (1)"
18. Navigates to /dashboard/clippers → Pending Applications tab
19. Sees clipper application:
    ┌────────────────────────────────────────┐
    │  [@ClipperJane avatar]                 │
    │  @ClipperJane                          │
    │                                        │
    │  Channel: ClipperJane's Channel ✓      │
    │  Subscribers: 2.5K                     │
    │  Applied: 2 hours ago                  │
    │                                        │
    │  [ View Channel ] [ Approve ] [ Reject ]│
    └────────────────────────────────────────┘
20. Creator clicks "View Channel" → Opens YouTube in new tab
21. Creator reviews channel content
22. Creator decides to approve
23. Clicks "Approve" button
24. API call: POST /api/creator/clippers/approve
    Body: { membershipId: [id] }
25. Backend:
    a. Update ClipperMembership:
       - status = ACTIVE
       - approvedAt = now()
    b. Check creator hasn't exceeded subscription clipper limit
    c. Create notification for clipper:
       - type: APPLICATION_APPROVED
       - message: "You've been accepted by [Creator Name]!"
       - actionUrl: /clipper/submit
    d. Send email to clipper (Phase 2)
26. Show toast to creator: "✓ @ClipperJane approved!"
27. Clipper moves from Pending to Active tab

CLIPPER RECEIVES APPROVAL:

28. Clipper logs in, sees notification
29. Notification: "🎉 You've been accepted by [Creator Name]!"
30. Clipper navigates to /clipper/communities
31. Creator now appears in "Active Communities" list
32. "Submit Clip" button is now enabled for this creator
33. Clipper can start submitting clips

END OF FLOW
```

* * * * *

### B. Glossary (UPDATED)

**Core Concepts:**

-   **Account Type / Role:** The fundamental classification of a user as either a Creator, Clipper, or Admin. Set at signup and determines all available features.
-   **Clipper:** A content creator who creates short-form clips from longer-form content and posts them on social media platforms
-   **Content Creator / Creator:** The original creator of long-form content who hires/pays clippers
-   **Community:** A creator's group of approved clippers who can submit clips
-   **Submission:** A single clip submitted by a clipper for review and payment
-   **Rate:** The payment amount per X views (e.g., $20 per 1,000 views)
-   **Payout Mode:** One-time (pay once on approval) vs. Recurring (pay as views grow)

**Technical Terms:**

-   **OAuth:** Open Authorization - allows users to grant third-party access without sharing passwords
-   **Stripe Connect:** Stripe's product for marketplace/platform payments
-   **Connected Account:** A Stripe account linked to the platform for payouts or receiving funds
-   **Express Account:** Stripe account type with simplified onboarding (used for clippers and creators)
-   **Platform Fee/Commission:** The percentage taken by ClipCommerce on each transaction
-   **Auto-Approval:** Feature allowing creators to automatically approve clips from trusted clippers
-   **Onboarding:** The multi-step process new users complete after signup to activate their account
-   **Role-Based Access Control (RBAC):** System that restricts dashboard access based on user role
-   **403 Forbidden:** HTTP status code returned when a user attempts to access a resource they don't have permission for

**Status Terms:**

-   **Pending:** Awaiting action (submission waiting for review, clipper application waiting for approval)
-   **Active:** Currently operational (membership approved, subscription paid)
-   **Approved:** Creator has approved a submission for payment
-   **Rejected:** Creator or system has rejected a submission or application
-   **Paid:** Payment has been successfully processed and sent
-   **Payment Failed:** Payment attempt was unsuccessful

* * * * *

### C. Additional Resources (UPDATED)

**YouTube Data API:**

-   Docs: <https://developers.google.com/youtube/v3>
-   OAuth Guide: <https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps>
-   Quota Info: <https://developers.google.com/youtube/v3/determine_quota_cost>
-   Channel Verification: <https://developers.google.com/youtube/v3/docs/channels/list>

**Stripe Connect:**

-   Docs: <https://stripe.com/docs/connect>
-   Express Accounts: <https://stripe.com/docs/connect/express-accounts>
-   Transfers: <https://stripe.com/docs/connect/charges-transfers>
-   Application Fees: <https://stripe.com/docs/connect/direct-charges#collecting-fees>
-   Onboarding: <https://stripe.com/docs/connect/onboarding>

**Stripe Billing (for Creator Subscriptions):**

-   Docs: <https://stripe.com/docs/billing>
-   Subscriptions: <https://stripe.com/docs/billing/subscriptions/overview>
-   Pricing Tables: <https://stripe.com/docs/payments/checkout/pricing-table>

**Authentication & Authorization:**

-   NextAuth.js: <https://next-auth.js.org/>
-   JWT Sessions: <https://next-auth.js.org/configuration/options#session>
-   Callbacks: <https://next-auth.js.org/configuration/callbacks>
-   Role-Based Access: <https://next-auth.js.org/tutorials/securing-pages-and-api-routes>

**Tech Stack Documentation:**

-   Next.js 14: <https://nextjs.org/docs>
-   App Router: <https://nextjs.org/docs/app>
-   Middleware: <https://nextjs.org/docs/app/building-your-application/routing/middleware>
-   Prisma: <https://www.prisma.io/docs>
-   shadcn/ui: <https://ui.shadcn.com/>
-   Tailwind CSS: <https://tailwindcss.com/docs>

**Security Best Practices:**

-   OWASP Top 10: <https://owasp.org/www-project-top-ten/>
-   Token Storage: <https://owasp.org/www-community/vulnerabilities/Insecure_Storage>
-   Role-Based Access Control: <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

* * * * *

### D. Design System & UI Components ⭐ NEW

**Brand Colors (Suggested):**

css

```
/* Primary Colors */
--creator-primary: #3B82F6;    /* Blue - for Creator brand */
--clipper-primary: #10B981;    /* Green - for Clipper brand */
--admin-primary: #8B5CF6;      /* Purple - for Admin */

/* Neutral Colors */
--background: #FFFFFF;
--foreground: #0F172A;
--muted: #F1F5F9;
--border: #E2E8F0;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Text Colors */
--text-primary: #0F172A;
--text-secondary: #64748B;
--text-muted: #94A3B8;
```

**Key UI Components to Build:**

1.  **Account Type Selection Card** (Signup Page)
    -   Component: `<AccountTypeCard />`
    -   Props: type ("creator" | "clipper"), onSelect
    -   Visual: Hover effect, icon, description, CTA button
    -   Responsive: Stack vertically on mobile
2.  **Role Badge** (Throughout app)
    -   Component: `<RoleBadge />`
    -   Props: role ("CREATOR" | "CLIPPER" | "ADMIN")
    -   Displays small badge with icon and text
    -   Color-coded by role
3.  **Dashboard Layout** (Separate for each role)
    -   Component: `<CreatorDashboard />` and `<ClipperDashboard />`
    -   Shared: Sidebar, header, main content area
    -   Different: Navigation items, branding color
4.  **Submission Card** (Creator review queue)
    -   Component: `<SubmissionCard />`
    -   Shows: Thumbnail, title, clipper, views, payout, actions
    -   Expandable for details
5.  **Creator Profile Card** (Marketplace)
    -   Component: `<CreatorCard />`
    -   Shows: Avatar, name, rate, clipper count, join button
    -   Status-aware (joined, pending, available)
6.  **Onboarding Stepper** (Both onboarding flows)
    -   Component: `<OnboardingSteps />`
    -   Props: currentStep, totalSteps, steps[]
    -   Visual progress indicator
7.  **403 Error Page**
    -   Component: `<ForbiddenPage />`
    -   Props: userRole, attemptedResource
    -   Contextual messaging based on role mismatch
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createStripeConnectOnboardingLink, stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CREATOR' && user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only creators and clippers can refresh Stripe Connect' }, { status: 403 })
    }

    const { returnUrl, refreshUrl } = await request.json()

    if (!returnUrl || !refreshUrl) {
      return NextResponse.json({ error: 'Return URL and refresh URL are required' }, { status: 400 })
    }

    // Check if user has a Stripe account
    if (!user.stripeAccountId) {
      return NextResponse.json({ error: 'No Stripe account found' }, { status: 404 })
    }

    // Check account status
    const account = await stripe.accounts.retrieve(user.stripeAccountId)
    const isAccountComplete = account.details_submitted && account.charges_enabled

    // Log account status for debugging
    console.log('Account status for refresh:', {
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
      disabled_reason: account.requirements?.disabled_reason
    })

    if (isAccountComplete) {
      return NextResponse.json({ 
        error: 'Stripe account is already complete',
        isAccountComplete: true
      }, { status: 200 })
    }

    // Create new onboarding link for existing account
    const accountLink = await createStripeConnectOnboardingLink(
      user.stripeAccountId,
      returnUrl,
      refreshUrl
    )

    return NextResponse.json({
      success: true,
      stripeAccountId: user.stripeAccountId,
      onboardingUrl: accountLink.url,
      expiresAt: accountLink.expires_at,
      isAccountComplete: false
    })

  } catch (error) {
    console.error('Stripe Connect refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh Stripe Connect account' },
      { status: 500 }
    )
  }
}

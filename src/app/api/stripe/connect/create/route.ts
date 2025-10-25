import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createStripeConnectAccount, createStripeConnectOnboardingLink, stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CREATOR' && user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only creators and clippers can connect Stripe' }, { status: 403 })
    }

    const { returnUrl, refreshUrl } = await request.json()

    if (!returnUrl || !refreshUrl) {
      return NextResponse.json({ error: 'Return URL and refresh URL are required' }, { status: 400 })
    }

    // Check if user already has a Stripe account
    if (user.stripeAccountId) {
      // Check if the Stripe account is fully set up
      try {
        const account = await stripe.accounts.retrieve(user.stripeAccountId)
        const isAccountComplete = account.details_submitted && account.charges_enabled
        
        return NextResponse.json({ 
          error: 'Stripe account already connected',
          stripeAccountId: user.stripeAccountId,
          isAccountComplete,
          accountStatus: {
            details_submitted: account.details_submitted,
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled
          }
        }, { status: 200 }) // Return 200 instead of 400 for better UX
      } catch (stripeError) {
        console.error('Error checking Stripe account status:', stripeError)
        return NextResponse.json({ 
          error: 'Stripe account already connected',
          stripeAccountId: user.stripeAccountId 
        }, { status: 200 })
      }
    }

    // Create Stripe Connect account
    const stripeAccount = await createStripeConnectAccount(user.email!)

    // Update user with Stripe account ID
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: stripeAccount.id }
    })

    // Create onboarding link
    const accountLink = await createStripeConnectOnboardingLink(
      stripeAccount.id,
      returnUrl,
      refreshUrl
    )

    return NextResponse.json({
      success: true,
      stripeAccountId: stripeAccount.id,
      onboardingUrl: accountLink.url,
      expiresAt: accountLink.expires_at
    })

  } catch (error) {
    console.error('Stripe Connect creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe Connect account' },
      { status: 500 }
    )
  }
}

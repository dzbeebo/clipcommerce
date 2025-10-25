import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createStripeConnectAccount, createStripeConnectOnboardingLink } from '@/lib/stripe'
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
      return NextResponse.json({ 
        error: 'Stripe account already connected',
        stripeAccountId: user.stripeAccountId 
      }, { status: 400 })
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

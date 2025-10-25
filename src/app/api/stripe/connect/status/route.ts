import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (!user.stripeAccountId) {
      return NextResponse.json({ 
        connected: false,
        message: 'No Stripe account connected' 
      })
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(user.stripeAccountId)

    // Check if account is fully set up
    const isSetupComplete = account.details_submitted && 
                           account.charges_enabled && 
                           account.payouts_enabled

    return NextResponse.json({
      connected: true,
      stripeAccountId: user.stripeAccountId,
      isSetupComplete,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements,
      country: account.country,
      email: account.email
    })

  } catch (error) {
    console.error('Stripe Connect status error:', error)
    return NextResponse.json(
      { error: 'Failed to check Stripe Connect status' },
      { status: 500 }
    )
  }
}

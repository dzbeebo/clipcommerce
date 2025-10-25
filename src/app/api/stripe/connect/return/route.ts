import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (!user.stripeAccountId) {
      return NextResponse.json({ error: 'No Stripe account found for user' }, { status: 400 })
    }

    const accountId = user.stripeAccountId

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(accountId)

    // Check if account setup is complete
    const isSetupComplete = account.details_submitted && 
                           account.charges_enabled && 
                           account.payouts_enabled

    if (isSetupComplete) {
      // Update user's Stripe connection status
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          stripeAccountId: accountId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Stripe account connected successfully',
        isSetupComplete: true,
        redirectUrl: user.role === 'CREATOR' 
          ? '/onboarding/creator/step-2' 
          : '/onboarding/clipper/step-3'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Stripe account setup incomplete',
        isSetupComplete: false,
        requirements: account.requirements,
        redirectUrl: user.role === 'CREATOR' 
          ? '/onboarding/creator/step-1' 
          : '/onboarding/clipper/step-2'
      })
    }

  } catch (error) {
    console.error('Stripe Connect return error:', error)
    return NextResponse.json(
      { error: 'Failed to process Stripe Connect return' },
      { status: 500 }
    )
  }
}

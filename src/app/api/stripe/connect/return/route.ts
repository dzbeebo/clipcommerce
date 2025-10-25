import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Stripe Connect return API called')
    const user = await requireAuth()
    console.log('User:', user.id, user.role, 'Stripe Account ID:', user.stripeAccountId)
    
    if (!user.stripeAccountId) {
      console.log('❌ No Stripe account found for user')
      return NextResponse.json({ error: 'No Stripe account found for user' }, { status: 400 })
    }

    const accountId = user.stripeAccountId

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(accountId)

    // Log detailed account status for debugging
    console.log('Account setup status:', {
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
      country: account.country,
      type: account.type
    })

    // For Express accounts, we only need details_submitted and charges_enabled
    // Payouts might be enabled later or have different requirements
    const isSetupComplete = account.details_submitted && account.charges_enabled

    // Check if there are any critical requirements that prevent the account from being used
    const hasCriticalIssues = account.requirements?.disabled_reason === 'requirements.past_due' ||
                             account.requirements?.disabled_reason === 'requirements.pending_verification' ||
                             account.requirements?.disabled_reason === 'rejected.incomplete_verification' ||
                             account.requirements?.disabled_reason === 'rejected.fraud' ||
                             account.requirements?.disabled_reason === 'rejected.other'

    if (isSetupComplete && !hasCriticalIssues) {
      // Update user's Stripe connection status
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          stripeAccountId: accountId
        }
      })

      const redirectUrl = user.role === 'CREATOR' 
        ? '/onboarding/creator/step-2' 
        : '/onboarding/clipper/step-3'
      
      console.log('✅ Setup complete, redirecting to:', redirectUrl)

      return NextResponse.json({
        success: true,
        message: 'Stripe account connected successfully',
        isSetupComplete: true,
        redirectUrl
      })
    } else {
      // Account setup is incomplete or has issues
      const redirectUrl = user.role === 'CREATOR' 
        ? '/onboarding/creator/step-1' 
        : '/onboarding/clipper/step-2'
      
      console.log('❌ Setup incomplete, redirecting to:', redirectUrl)
      console.log('Account requirements:', account.requirements)

      // Provide more specific error message based on the issue
      let errorMessage = 'Stripe account setup incomplete'
      if (hasCriticalIssues) {
        errorMessage = `Stripe account setup incomplete: ${account.requirements?.disabled_reason || 'Account verification required'}`
      } else if (!account.details_submitted) {
        errorMessage = 'Please complete your Stripe account details'
      } else if (!account.charges_enabled) {
        errorMessage = 'Stripe account verification is still pending'
      }

      return NextResponse.json({
        success: false,
        message: errorMessage,
        isSetupComplete: false,
        requirements: account.requirements,
        redirectUrl,
        canRetry: !hasCriticalIssues // Allow retry if no critical issues
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

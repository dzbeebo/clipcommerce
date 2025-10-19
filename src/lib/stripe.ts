import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// Stripe Connect account creation
export async function createStripeConnectAccount(email: string, type: 'express' = 'express') {
  const account = await stripe.accounts.create({
    type: type as any,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

// Generate Stripe Connect onboarding link
export async function createStripeConnectOnboardingLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

// Create Stripe Checkout session for subscriptions
export async function createCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  trialPeriodDays = 7,
}: {
  priceId: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
  trialPeriodDays?: number
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: trialPeriodDays,
    },
  })

  return session
}

// Create Stripe Connect transfer
export async function createTransfer({
  amount,
  destination,
  transferGroup,
  metadata,
}: {
  amount: number
  destination: string
  transferGroup: string
  metadata: Record<string, string>
}) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    destination,
    transfer_group: transferGroup,
    metadata,
  })

  return transfer
}

// Create application fee (Note: Application fees are deprecated in Stripe Connect)
// This function is kept for reference but should not be used in production
export async function createApplicationFee({
  amount,
  transferId,
}: {
  amount: number
  transferId: string
}) {
  // Application fees are deprecated in Stripe Connect
  // Use platform fees in Connect accounts instead
  throw new Error('Application fees are deprecated. Use platform fees in Connect accounts instead.')
}

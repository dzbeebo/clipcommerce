import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'transfer.created':
        // Handle successful transfer
        await handleTransferPaid(event.data.object)
        break

      case 'transfer.updated':
        // Handle transfer updates (could be failed)
        await handleTransferFailed(event.data.object)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function handleTransferPaid(transfer: any) {
  try {
    // Update transaction status
    await prisma.transaction.updateMany({
      where: { stripeTransferId: transfer.id },
      data: {
        status: 'SUCCEEDED',
        completedAt: new Date()
      }
    })

    // Update submission status if needed
    await prisma.submission.updateMany({
      where: { stripeTransferId: transfer.id },
      data: {
        status: 'PAID'
      }
    })

    console.log(`Transfer ${transfer.id} marked as paid`)
  } catch (error) {
    console.error('Error handling transfer.paid:', error)
  }
}

async function handleTransferFailed(transfer: any) {
  try {
    // Update transaction status
    await prisma.transaction.updateMany({
      where: { stripeTransferId: transfer.id },
      data: {
        status: 'FAILED',
        failureReason: transfer.failure_message || 'Transfer failed',
        lastRetryAt: new Date()
      }
    })

    // Update submission status
    await prisma.submission.updateMany({
      where: { stripeTransferId: transfer.id },
      data: {
        status: 'PAYMENT_FAILED'
      }
    })

    console.log(`Transfer ${transfer.id} marked as failed`)
  } catch (error) {
    console.error('Error handling transfer.failed:', error)
  }
}

async function handleAccountUpdated(account: any) {
  try {
    // Update user's Stripe account status if needed
    await prisma.user.updateMany({
      where: { stripeAccountId: account.id },
      data: {
        // Add any account status fields if needed
      }
    })

    console.log(`Account ${account.id} updated`)
  } catch (error) {
    console.error('Error handling account.updated:', error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { createTransfer } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('CREATOR')
    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
    }

    // Get submission with related data
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        creator: {
          include: {
            user: true
          }
        },
        clipper: {
          include: {
            user: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Verify creator owns this submission
    if (submission.creator.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if submission is approved
    if (submission.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Submission must be approved before payment' }, { status: 400 })
    }

    // Calculate payment amounts
    const platformFeeRate = 0.05 // 5% platform fee
    const platformFee = submission.paymentAmount! * platformFeeRate
    const clipperNet = submission.paymentAmount! - platformFee

    // Check if clipper has Stripe account
    if (!submission.clipper.user.stripeAccountId) {
      return NextResponse.json({ 
        error: 'Clipper has not set up payment account. Please ask them to complete Stripe Connect setup.' 
      }, { status: 400 })
    }

    // Create transfer to clipper
    const transfer = await createTransfer({
      amount: clipperNet,
      destination: submission.clipper.user.stripeAccountId,
      transferGroup: `submission-${submission.id}`,
      metadata: {
        submissionId: submission.id,
        clipperId: submission.clipper.id,
        creatorId: submission.creator.id,
        platformFee: platformFee.toString(),
        clipperNet: clipperNet.toString()
      }
    })

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        submissionId: submission.id,
        amount: submission.paymentAmount!,
        platformFee: platformFee,
        clipperNet: clipperNet,
        stripeTransferId: transfer.id,
        status: 'PENDING'
      }
    })

    // Update submission status
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        platformFee: platformFee,
        clipperNet: clipperNet,
        stripeTransferId: transfer.id
      }
    })

    // Update clipper earnings
    await prisma.clipperProfile.update({
      where: { id: submission.clipper.id },
      data: {
        totalEarned: {
          increment: clipperNet
        }
      }
    })

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        platformFee: transaction.platformFee,
        clipperNet: transaction.clipperNet,
        status: transaction.status,
        stripeTransferId: transaction.stripeTransferId
      }
    })

  } catch (error) {
    console.error('Error processing payment:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient funds')) {
        return NextResponse.json({ 
          error: 'Insufficient funds in your account. Please add funds to your Stripe account.' 
        }, { status: 400 })
      }
      if (error.message.includes('Invalid account')) {
        return NextResponse.json({ 
          error: 'Clipper payment account is invalid. Please ask them to reconnect their Stripe account.' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

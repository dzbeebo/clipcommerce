'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CreditCard, Shield, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ClipperOnboardingStep2() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConnectStripe = async () => {
    setIsLoading(true)
    try {
      // Create Stripe Connect account and get onboarding URL
      const response = await fetch('/api/stripe/connect/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/stripe-connect-return?redirect=/onboarding/clipper/step-3`,
          refreshUrl: `${window.location.origin}/onboarding/clipper/step-2`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe Connect account')
      }

      // Redirect to Stripe onboarding
      window.location.href = data.onboardingUrl
    } catch (error) {
      console.error('Stripe connection error:', error)
      toast.error('Failed to connect Stripe account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ClipCommerce</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Up Payouts
          </h1>
          <p className="text-gray-600">
            Step 2 of 3 - Connect Stripe to receive payments from creators
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">YouTube Connect</span>
            </div>
            <div className="w-8 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Stripe Connect</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Complete Setup</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-green-600" />
              Stripe Connect for Payouts
            </CardTitle>
            <CardDescription>
              Set up your payout account to receive payments from creators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">How payouts work</h3>
              <p className="text-green-800 text-sm">
                When creators approve your clips, payments are automatically sent to your Stripe account. 
                You can then transfer the money to your bank account.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What you'll get:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Instant payments when clips are approved
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Secure transfer to your bank account
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Detailed payment history
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Tax reporting tools
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Security Notice</h3>
              <p className="text-yellow-800 text-sm">
                <Shield className="h-4 w-4 inline mr-1" />
                Your banking information is secured with bank-level encryption. 
                We never store your banking details.
              </p>
            </div>

            <Button
              onClick={handleConnectStripe}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Connecting...' : 'Connect Stripe for Payouts'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="text-center text-sm text-gray-500">
              By connecting Stripe, you agree to their{' '}
              <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-500">
                Terms of Service
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

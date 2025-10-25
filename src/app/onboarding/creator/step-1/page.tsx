'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CreditCard, Shield, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function CreatorOnboardingStep1() {
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
          returnUrl: `${window.location.origin}/stripe-connect-return?redirect=/onboarding/creator/step-2`,
          refreshUrl: `${window.location.origin}/onboarding/creator/step-1`,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ClipCommerce</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your Stripe Account
          </h1>
          <p className="text-gray-600">
            Step 1 of 3 - Set up payments to pay clippers for their work
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Stripe Connect</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Profile Setup</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Subscription</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
              Stripe Connect Setup
            </CardTitle>
            <CardDescription>
              Connect your Stripe account to pay clippers for their work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Why do I need Stripe?</h3>
              <p className="text-blue-800 text-sm">
                Stripe Connect allows you to pay clippers directly for their approved clips. 
                We use it to process payments securely and handle all the complex payment logic.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What you'll get:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Secure payment processing
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Automatic payments to clippers
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Detailed payment reports
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Fraud protection
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Security Notice</h3>
              <p className="text-yellow-800 text-sm">
                <Shield className="h-4 w-4 inline mr-1" />
                Your Stripe account is secured with bank-level encryption. 
                We never store your banking information.
              </p>
            </div>

            <Button
              onClick={handleConnectStripe}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Connecting...' : 'Connect Stripe Account'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="text-center text-sm text-gray-500">
              By connecting Stripe, you agree to their{' '}
              <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

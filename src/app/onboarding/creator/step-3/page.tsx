'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, Star, Zap, Crown } from 'lucide-react'
import { toast } from 'sonner'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    clippers: 10,
    features: [
      'Up to 10 clippers',
      'Basic analytics',
      'Email support',
      'Standard payment processing'
    ],
    recommended: false,
    icon: Star,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    clippers: 50,
    features: [
      'Up to 50 clippers',
      'Advanced analytics',
      'Priority support',
      'Custom payment rates',
      'Auto-approval settings'
    ],
    recommended: true,
    icon: Zap,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    clippers: 'Unlimited',
    features: [
      'Unlimited clippers',
      'Full analytics suite',
      'Dedicated support',
      'Custom integrations',
      'White-label options'
    ],
    recommended: false,
    icon: Crown,
  },
]

export default function CreatorOnboardingStep3() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Stripe subscription
      toast.success('Subscription created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to create subscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ClipCommerce</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600">
            Step 3 of 3 - Select a subscription plan to start managing clippers
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Stripe Connect</span>
            </div>
            <div className="w-8 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Profile Setup</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Subscription</span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-blue-600 shadow-lg'
                    : 'hover:shadow-md'
                } ${plan.recommended ? 'border-blue-200' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    Up to {plan.clippers} clippers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trial Notice */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎉 Start with a 7-day free trial
              </h3>
              <p className="text-gray-600">
                No credit card required. Cancel anytime during your trial.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {isLoading ? 'Creating Subscription...' : 'Start Free Trial'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

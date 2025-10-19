'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, User, DollarSign } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { creatorProfileSchema, type CreatorProfileInput } from '@/lib/validations'
import { toast } from 'sonner'

export default function CreatorOnboardingStep2() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatorProfileInput>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      rateAmount: 20,
      rateViews: 1000,
      minPayout: 10,
    }
  })

  const rateAmount = watch('rateAmount', 20)
  const rateViews = watch('rateViews', 1000)

  const onSubmit = async (data: CreatorProfileInput) => {
    setIsLoading(true)
    try {
      // TODO: Implement profile creation API
      toast.success('Profile created successfully!')
      router.push('/onboarding/creator/step-3')
    } catch (error) {
      console.error('Profile creation error:', error)
      toast.error('Failed to create profile')
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
            Set Up Your Profile
          </h1>
          <p className="text-gray-600">
            Step 2 of 3 - Create your creator profile and set payment rates
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
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Profile Setup</span>
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
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Creator Profile
            </CardTitle>
            <CardDescription>
              Set up your public profile and payment preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="Your public name"
                  {...register('displayName')}
                  className={errors.displayName ? 'border-red-500' : ''}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500">{errors.displayName.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell clippers about your content and what you're looking for..."
                  rows={4}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  {watch('description')?.length || 0}/500 characters
                </p>
              </div>

              {/* Profile Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Profile URL *</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">clipcommerce.com/creator/</span>
                  <Input
                    id="slug"
                    placeholder="your-username"
                    {...register('slug')}
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Payment Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Settings
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateAmount">Rate Amount ($)</Label>
                    <Input
                      id="rateAmount"
                      type="number"
                      step="0.01"
                      min="1"
                      max="1000"
                      {...register('rateAmount', { valueAsNumber: true })}
                      className={errors.rateAmount ? 'border-red-500' : ''}
                    />
                    {errors.rateAmount && (
                      <p className="text-sm text-red-500">{errors.rateAmount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rateViews">Per Views</Label>
                    <Input
                      id="rateViews"
                      type="number"
                      min="100"
                      max="1000000"
                      {...register('rateViews', { valueAsNumber: true })}
                      className={errors.rateViews ? 'border-red-500' : ''}
                    />
                    {errors.rateViews && (
                      <p className="text-sm text-red-500">{errors.rateViews.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Example:</strong> You'll pay ${rateAmount} for every {rateViews.toLocaleString()} views a clip gets.
                    <br />
                    <strong>Rate:</strong> ${(rateAmount / rateViews * 1000).toFixed(2)} per 1,000 views
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="minPayout">Minimum Payout ($)</Label>
                  <Input
                    id="minPayout"
                    type="number"
                    step="0.01"
                    min="5"
                    max="100"
                    {...register('minPayout', { valueAsNumber: true })}
                    className={errors.minPayout ? 'border-red-500' : ''}
                  />
                  {errors.minPayout && (
                    <p className="text-sm text-red-500">{errors.minPayout.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Minimum amount before a clipper can request payout
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Creating Profile...' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

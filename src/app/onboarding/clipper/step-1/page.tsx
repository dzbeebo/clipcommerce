'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs, breadcrumbConfigs } from '@/components/layout/Breadcrumbs'
import { ArrowRight, Youtube, Shield, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ClipperOnboardingStep1() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConnectYouTube = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement YouTube OAuth integration
      toast.success('YouTube account connected!')
      router.push('/onboarding/clipper/step-2')
    } catch (error) {
      console.error('YouTube connection error:', error)
      toast.error('Failed to connect YouTube account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-secondary/5 to-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbConfigs['/onboarding/clipper/step-1']} />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Connect Your YouTube Channel
            </h1>
            <p className="text-text-secondary">
              Step 1 of 3 - Verify ownership of your YouTube channel
            </p>
          </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-secondary">YouTube Connect</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Stripe Connect</span>
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
              <Youtube className="h-6 w-6 mr-2 text-red-600" />
              YouTube Channel Verification
            </CardTitle>
            <CardDescription>
              Connect your YouTube channel to verify ownership and enable clip submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h3 className="font-semibold text-secondary mb-2">Why do I need to connect YouTube?</h3>
              <p className="text-text-secondary text-sm">
                We need to verify that you own the YouTube channel you're submitting clips from. 
                This prevents fraud and ensures you get paid for your own content.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">What we'll access:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-text-secondary">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Your channel information (name, avatar, subscriber count)
                </li>
                <li className="flex items-center text-text-secondary">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Video metadata (title, views, publish date)
                </li>
                <li className="flex items-center text-text-secondary">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Channel ownership verification
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
              <p className="text-blue-800 text-sm">
                <Shield className="h-4 w-4 inline mr-1" />
                We only access the minimum required data. We never modify your videos or channel settings.
                You can revoke access at any time.
              </p>
            </div>

            <Button
              onClick={handleConnectYouTube}
              disabled={isLoading}
              className="w-full bg-secondary text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4 mr-2" />
                  Connect YouTube Channel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              By connecting YouTube, you agree to their{' '}
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-500">
                Terms of Service
              </a>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

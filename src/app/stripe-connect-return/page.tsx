'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function StripeConnectReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your Stripe connection...')
  const [canRetry, setCanRetry] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  const handleRetry = async () => {
    setStatus('loading')
    setMessage('Retrying Stripe connection...')
    
    try {
      const redirect = searchParams.get('redirect')
      console.log('Retry - Redirect parameter:', redirect)

      // Call our API to process the return
      const response = await fetch('/api/stripe/connect/return')
      const data = await response.json()
      console.log('Stripe return API response (retry):', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process Stripe return')
      }

      if (data.success && data.isSetupComplete) {
        setStatus('success')
        setMessage('Stripe account connected successfully!')
        
        // Use the redirect parameter from URL, then API response, then default
        const finalRedirect = redirect || data.redirectUrl || '/dashboard'
        console.log('Final redirect URL:', finalRedirect)
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(finalRedirect)
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.message || 'Stripe account setup incomplete. Please try again.')
        setCanRetry(data.canRetry || false)
        setRedirectUrl(data.redirectUrl || null)
      }
    } catch (error) {
      console.error('Stripe return processing error (retry):', error)
      setStatus('error')
      setMessage('Failed to process Stripe connection. Please try again.')
      setCanRetry(true)
    }
  }

  const handleRefreshStripe = async () => {
    setStatus('loading')
    setMessage('Creating new Stripe onboarding link...')
    
    try {
      const redirect = searchParams.get('redirect')
      const refreshUrl = redirect ? `/onboarding/clipper/step-2` : '/onboarding/clipper/step-2'
      
      // Call the refresh endpoint to get a new onboarding link
      const response = await fetch('/api/stripe/connect/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/stripe-connect-return?redirect=${redirect || '/onboarding/clipper/step-3'}`,
          refreshUrl: `${window.location.origin}${refreshUrl}`,
        }),
      })

      const data = await response.json()
      console.log('Stripe refresh API response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh Stripe connection')
      }

      if (data.success && data.onboardingUrl) {
        // Redirect to the new Stripe onboarding link
        window.location.href = data.onboardingUrl
      } else {
        throw new Error('No onboarding URL received')
      }
    } catch (error) {
      console.error('Stripe refresh error:', error)
      setStatus('error')
      setMessage('Failed to refresh Stripe connection. Please try again.')
      setCanRetry(true)
    }
  }

  useEffect(() => {
    const processReturn = async () => {
      try {
        const redirect = searchParams.get('redirect')
        console.log('Redirect parameter:', redirect)

        // Call our API to process the return (no account_id needed in URL)
        const response = await fetch('/api/stripe/connect/return')
        const data = await response.json()
        console.log('Stripe return API response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process Stripe return')
        }

        if (data.success && data.isSetupComplete) {
          setStatus('success')
          setMessage('Stripe account connected successfully!')
          
          // Use the redirect parameter from URL, then API response, then default
          const finalRedirect = redirect || data.redirectUrl || '/dashboard'
          console.log('Final redirect URL:', finalRedirect)
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(finalRedirect)
          }, 2000)
        } else {
          setStatus('error')
          setMessage(data.message || 'Stripe account setup incomplete. Please try again.')
          setCanRetry(data.canRetry || false)
          setRedirectUrl(data.redirectUrl || null)
        }
      } catch (error) {
        console.error('Stripe return processing error:', error)
        setStatus('error')
        setMessage('Failed to process Stripe connection. Please try again.')
        setCanRetry(true)
      }
    }

    processReturn()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            {status === 'loading' && <Loader2 className="h-6 w-6 mr-2 animate-spin text-blue-600" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 mr-2 text-green-600" />}
            {status === 'error' && <XCircle className="h-6 w-6 mr-2 text-red-600" />}
            Stripe Connect
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Redirecting you to the next step...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {message}
              </div>
              <div className="flex flex-col space-y-2">
                {canRetry && (
                  <>
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleRefreshStripe}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Complete Stripe Setup
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    if (redirectUrl) {
                      router.push(redirectUrl)
                    } else {
                      router.back()
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  {redirectUrl ? 'Continue to Previous Step' : 'Go Back'}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function StripeConnectReturn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 mr-2 animate-spin text-blue-600" />
              Stripe Connect
            </CardTitle>
            <CardDescription>
              Processing your Stripe connection...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <StripeConnectReturnContent />
    </Suspense>
  )
}

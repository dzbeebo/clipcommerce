'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function StripeConnectReturn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your Stripe connection...')

  useEffect(() => {
    const processReturn = async () => {
      try {
        const accountId = searchParams.get('account_id')
        const redirect = searchParams.get('redirect')

        if (!accountId) {
          throw new Error('No account ID provided')
        }

        // Call our API to process the return
        const response = await fetch(`/api/stripe/connect/return?account_id=${accountId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process Stripe return')
        }

        if (data.success && data.isSetupComplete) {
          setStatus('success')
          setMessage('Stripe account connected successfully!')
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(redirect || '/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage(data.message || 'Stripe account setup incomplete. Please try again.')
        }
      } catch (error) {
        console.error('Stripe return processing error:', error)
        setStatus('error')
        setMessage('Failed to process Stripe connection. Please try again.')
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
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

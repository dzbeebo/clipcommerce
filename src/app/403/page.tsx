'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function ForbiddenPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const attempted = searchParams.get('attempted')

  const getErrorMessage = () => {
    if (role === 'clipper' && attempted === 'dashboard') {
      return {
        title: 'Creator Dashboard Access Denied',
        description: 'This is the Creator dashboard. You\'re currently logged in as a Clipper.',
        actionText: 'Go to Clipper Dashboard',
        actionUrl: '/clipper'
      }
    }
    
    if (role === 'creator' && attempted === 'clipper') {
      return {
        title: 'Clipper Dashboard Access Denied',
        description: 'This is the Clipper dashboard. You\'re currently logged in as a Creator.',
        actionText: 'Go to Creator Dashboard',
        actionUrl: '/dashboard'
      }
    }
    
    if (role === 'user' && attempted === 'admin') {
      return {
        title: 'Admin Panel Access Denied',
        description: 'This is the Admin panel. You don\'t have admin privileges.',
        actionText: 'Go to Your Dashboard',
        actionUrl: '/dashboard'
      }
    }

    return {
      title: 'Access Denied',
      description: 'You don\'t have permission to access this page.',
      actionText: 'Go to Dashboard',
      actionUrl: '/dashboard'
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {errorInfo.title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button asChild className="w-full">
              <Link href={errorInfo.actionUrl}>
                {errorInfo.actionText}
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            Need help?{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-500">
              Contact support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Scissors, ArrowRight, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join ClippingMarket
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your account type to get started. You can always change your role later.
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Creator Card */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="h-16 w-16 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">I&apos;m a Creator</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Manage clippers, automate payments, and grow your reach
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Connect with verified clippers
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Set custom payment rates
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Track performance & ROI
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Automated payment processing
                </li>
              </ul>
              <Button asChild className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700">
                <Link href="/signup/creator">
                  Sign Up as Creator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Clipper Card */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="h-16 w-16 rounded-xl bg-green-600 flex items-center justify-center mb-4">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">I&apos;m a Clipper</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Find creators, submit clips, and earn money automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Browse creator opportunities
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Submit clips with one click
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Get paid fast & securely
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Build your reputation
                </li>
              </ul>
              <Button asChild className="w-full text-lg py-6 bg-green-600 hover:bg-green-700">
                <Link href="/signup/clipper">
                  Sign Up as Clipper
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

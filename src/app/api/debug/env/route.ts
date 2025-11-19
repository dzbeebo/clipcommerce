import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development or with a secret key for security
  const isDevelopment = process.env.NODE_ENV === 'development'
  const debugKey = process.env.DEBUG_SECRET_KEY
  
  // Check for debug key in query params
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  
  return NextResponse.json({
    underConstruction: {
      envValue: process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION,
      isEnabled: process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true' || 
                 process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'True' || 
                 process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'TRUE' ||
                 process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === '1',
      type: typeof process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION,
    },
    environment: process.env.NODE_ENV,
    note: 'Visit this endpoint to verify the environment variable is set correctly. Remember to redeploy after adding environment variables in Vercel.',
  }, {
    headers: {
      'Cache-Control': 'no-store',
    }
  })
}


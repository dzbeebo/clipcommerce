import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development or with a secret key for security
  const isDevelopment = process.env.NODE_ENV === 'development'
  const debugKey = process.env.DEBUG_SECRET_KEY
  
  // Check for debug key in query params
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  
  return NextResponse.json({
    underConstruction: {
      note: 'Under construction mode is now controlled through admin settings (/admin/settings), not environment variables.',
      envValue: process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION || 'Not used (database-controlled)',
      isEnabled: 'Check database PlatformSettings table with key "underConstruction"',
    },
    environment: process.env.NODE_ENV,
    note: 'Under construction mode is controlled through the admin settings page, not environment variables.',
  }, {
    headers: {
      'Cache-Control': 'no-store',
    }
  })
}


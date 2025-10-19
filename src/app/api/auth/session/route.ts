import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      { user },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Session error:', error)
    
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
}

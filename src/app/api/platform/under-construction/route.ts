import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get under construction setting from database
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'underConstruction' },
    })
    
    // Fallback to environment variable if not in database
    const envValue = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION
    const isEnabled = 
      setting?.value === 'true' ||
      envValue === 'true' ||
      envValue === 'True' ||
      envValue === 'TRUE' ||
      envValue === '1'
    
    return NextResponse.json({
      enabled: isEnabled,
    })
  } catch (error) {
    console.error('Error checking under construction status:', error)
    // Fallback to environment variable on error
    const envValue = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION
    const isEnabled = 
      envValue === 'true' ||
      envValue === 'True' ||
      envValue === 'TRUE' ||
      envValue === '1'
    
    return NextResponse.json({
      enabled: isEnabled,
    })
  }
}


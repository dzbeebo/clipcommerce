import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get under construction setting from database (controlled through admin settings)
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'underConstruction' },
    })
    
    // Only enable if explicitly set to 'true' in database
    // Default to false if setting doesn't exist
    const isEnabled = setting?.value === 'true'
    
    return NextResponse.json({
      enabled: isEnabled,
    })
  } catch (error) {
    console.error('Error checking under construction status:', error)
    // Default to false on error
    return NextResponse.json({
      enabled: false,
    })
  }
}


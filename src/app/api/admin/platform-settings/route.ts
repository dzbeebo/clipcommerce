import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole('ADMIN')
    
    const settings = await prisma.platformSettings.findMany({
      orderBy: { key: 'asc' },
    })
    
    // Convert to key-value object
    const settingsMap: Record<string, string> = {}
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value
    })
    
    return NextResponse.json({
      settings: settingsMap,
    })
  } catch (error) {
    console.error('Error fetching platform settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireRole('ADMIN')
    
    const { settings } = await request.json()
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      )
    }
    
    // Update or create each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.platformSettings.upsert({
        where: { key },
        update: {
          value: String(value),
          updatedBy: adminUser.id,
        },
        create: {
          key,
          value: String(value),
          updatedBy: adminUser.id,
        },
      })
    )
    
    await Promise.all(updates)
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating platform settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    )
  }
}


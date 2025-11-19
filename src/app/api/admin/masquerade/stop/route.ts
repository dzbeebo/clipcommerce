import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Check if masquerading
    const masqueradeAdminId = cookieStore.get('masquerade-admin-id')?.value
    if (!masqueradeAdminId) {
      return NextResponse.json(
        { error: 'Not currently masquerading' },
        { status: 400 }
      )
    }

    // Clear masquerade cookies
    cookieStore.delete('masquerade-admin-id')
    cookieStore.delete('masquerade-user-id')

    return NextResponse.json({
      success: true,
      message: 'Masquerade stopped',
    })
  } catch (error) {
    console.error('Error stopping masquerade:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to stop masquerade' },
      { status: 500 }
    )
  }
}


import { NextResponse } from 'next/server'
import { testDatabaseConnection, testUserQuery } from '@/lib/db-test'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    const userTest = await testUserQuery()
    if (!userTest.success) {
      return NextResponse.json({
        success: false,
        error: 'User query failed',
        details: userTest.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userTest.count,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

// Database connection test utility
import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database connection successful:', result)
    return { success: true, result }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { success: false, error: error.message }
  }
}

export async function testUserQuery() {
  try {
    // Test a simple user query
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    return { success: true, count: userCount }
  } catch (error) {
    console.error('User query failed:', error)
    return { success: false, error: error.message }
  }
}

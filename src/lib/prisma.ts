import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get database URL with connection pooling for serverless
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  
  // For Supabase in production, add connection pooling parameters
  if (process.env.NODE_ENV === 'production' && url.includes('supabase.co')) {
    // Add connection pooling parameters to prevent prepared statement reuse
    const urlObj = new URL(url)
    urlObj.searchParams.set('pgbouncer', 'true')
    urlObj.searchParams.set('connection_limit', '1')
    urlObj.searchParams.set('pool_timeout', '0')
    return urlObj.toString()
  }
  
  return url
}

// Create a new Prisma client instance
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Use global instance to prevent multiple connections
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

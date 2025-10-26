// Simple in-memory cache for API responses
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  userProfile: (userId: string) => `user:${userId}`,
  dashboardData: (userId: string, role: string) => `dashboard:${role}:${userId}`,
  submissions: (userId: string, page: number = 1) => `submissions:${userId}:${page}`,
  analytics: (userId: string, period: string) => `analytics:${userId}:${period}`,
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  USER_PROFILE: 10 * 60 * 1000, // 10 minutes
  DASHBOARD_DATA: 5 * 60 * 1000, // 5 minutes
  SUBMISSIONS: 2 * 60 * 1000, // 2 minutes
  ANALYTICS: 15 * 60 * 1000, // 15 minutes
} as const

// Utility function to wrap API calls with caching
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.DASHBOARD_DATA
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch fresh data
  const data = await fetchFn()
  
  // Cache the result
  cache.set(key, data, ttl)
  
  return data
}

// Cleanup expired cache entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}

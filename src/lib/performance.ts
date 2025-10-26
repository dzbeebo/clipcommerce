// Performance monitoring utilities
interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiCallTime: number
  cacheHitRate: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private apiCallTimes: Map<string, number[]> = new Map()
  private cacheHits = 0
  private cacheMisses = 0

  // Track page load performance
  trackPageLoad(pageName: string, startTime: number) {
    const loadTime = performance.now() - startTime
    this.metrics.set(pageName, {
      loadTime,
      renderTime: 0,
      apiCallTime: 0,
      cacheHitRate: 0
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Page ${pageName} loaded in ${loadTime.toFixed(2)}ms`)
    }
  }

  // Track API call performance
  trackApiCall(endpoint: string, startTime: number) {
    const duration = performance.now() - startTime
    
    if (!this.apiCallTimes.has(endpoint)) {
      this.apiCallTimes.set(endpoint, [])
    }
    
    this.apiCallTimes.get(endpoint)!.push(duration)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API ${endpoint} completed in ${duration.toFixed(2)}ms`)
    }
  }

  // Track cache performance
  trackCacheHit() {
    this.cacheHits++
  }

  trackCacheMiss() {
    this.cacheMisses++
  }

  // Get performance summary
  getSummary() {
    const totalCacheRequests = this.cacheHits + this.cacheMisses
    const cacheHitRate = totalCacheRequests > 0 ? (this.cacheHits / totalCacheRequests) * 100 : 0

    return {
      pages: Object.fromEntries(this.metrics),
      apiCalls: Object.fromEntries(
        Array.from(this.apiCallTimes.entries()).map(([endpoint, times]) => [
          endpoint,
          {
            average: times.reduce((a, b) => a + b, 0) / times.length,
            min: Math.min(...times),
            max: Math.max(...times),
            count: times.length
          }
        ])
      ),
      cache: {
        hitRate: cacheHitRate,
        hits: this.cacheHits,
        misses: this.cacheMisses
      }
    }
  }

  // Clear metrics
  clear() {
    this.metrics.clear()
    this.apiCallTimes.clear()
    this.cacheHits = 0
    this.cacheMisses = 0
  }
}

export const performanceMonitor = new PerformanceMonitor()

// React hook for performance tracking
export function usePerformanceTracking(pageName: string) {
  const startTime = performance.now()
  
  if (typeof window !== 'undefined') {
    // Track page load when component mounts
    performanceMonitor.trackPageLoad(pageName, startTime)
  }
}

// Higher-order function to track API calls
export function withPerformanceTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  endpoint: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now()
    try {
      const result = await fn(...args)
      performanceMonitor.trackApiCall(endpoint, startTime)
      return result
    } catch (error) {
      performanceMonitor.trackApiCall(endpoint, startTime)
      throw error
    }
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window !== 'undefined' && 'performance' in window && 'PerformanceObserver' in window) {
    try {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('📊 LCP:', lastEntry.startTime.toFixed(2) + 'ms')
      }).observe({ entryTypes: ['largest-contentful-paint'], buffered: true })

      // Track First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          console.log('📊 FID:', (entry as any).processingStart - entry.startTime + 'ms')
        })
      }).observe({ entryTypes: ['first-input'], buffered: true })

      // Track Cumulative Layout Shift (CLS)
      new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('📊 CLS:', clsValue.toFixed(4))
      }).observe({ entryTypes: ['layout-shift'], buffered: true })
    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }
}

// Initialize performance tracking
if (typeof window !== 'undefined') {
  trackWebVitals()
}

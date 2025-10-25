import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

// Validate that publishable key is present
if (!supabasePublishableKey) {
  console.error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing!')
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required. Please add it to your environment variables.')
}

// Validate that secret key is present
if (!supabaseSecretKey) {
  console.error('SUPABASE_SECRET_KEY is missing!')
  throw new Error('SUPABASE_SECRET_KEY is required. Please add it to your environment variables.')
}

// Log key status
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Server Keys Status:')
  console.log('  Publishable Key: ✅ New (sb_publishable_)')
  console.log('  Secret Key: ✅ New (sb_secret_)')
} else {
  // In production, just log that keys are available without exposing them
  console.log('🔑 Supabase Server Keys: ✅ Available')
}

// Admin client for admin operations (user creation, etc.)
// Uses the secret key for admin operations
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Server-side Supabase client for API routes
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabasePublishableKey, // Use publishable key for server-side operations
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Server-side Supabase client for server components
export async function createServerSupabaseClientForServerComponents() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabasePublishableKey, // Use publishable key for server-side operations
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

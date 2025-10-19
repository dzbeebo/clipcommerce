import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use new Supabase API keys only
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

// Validate that new keys are present
if (!supabasePublishableKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required. Please add it to your .env.local file.')
}
if (!supabaseSecretKey) {
  throw new Error('SUPABASE_SECRET_KEY is required. Please add it to your .env.local file.')
}

// Log key status in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Keys Status:')
  console.log('  Publishable Key: ✅ New (sb_publishable_)')
  console.log('  Secret Key: ✅ New (sb_secret_)')
}

// Client-side Supabase client (uses publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Server-side Supabase client for API routes
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseSecretKey, // Use secret key for server-side operations
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Server-side Supabase client for server components
export async function createServerSupabaseClientForServerComponents() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseSecretKey, // Use secret key for server-side operations
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

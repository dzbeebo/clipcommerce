import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Prioritize new API keys, fallback to legacy keys for backward compatibility
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!

// Log which keys are being used (for debugging)
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Keys Status:')
  console.log('  Publishable Key:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ New (sb_publishable_)' : '⚠️ Legacy (anon)')
  console.log('  Secret Key:', process.env.SUPABASE_SECRET_KEY ? '✅ New (sb_secret_)' : '⚠️ Legacy (service_role)')
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

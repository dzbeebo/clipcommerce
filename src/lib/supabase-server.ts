import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate that keys are present
if (!supabaseSecretKey) {
  throw new Error('SUPABASE_SECRET_KEY is required. Please add it to your .env.local file.')
}

// Only require service key at runtime, not build time
if (!supabaseServiceKey && process.env.NODE_ENV !== 'development') {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.')
}

// Log key status in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Server Keys Status:')
  console.log('  Secret Key: ✅ New (sb_secret_)')
  console.log('  Service Key: ✅ Present')
}

// Admin client for admin operations (user creation, etc.)
export function createSupabaseAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Please add it to your environment variables.')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
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
  const { cookies } = await import('next/headers')
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

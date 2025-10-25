import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Validate that publishable key is present
if (!supabasePublishableKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required. Please add it to your .env.local file.')
}

// Log key status in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Client Keys Status:')
  console.log('  Publishable Key: ✅ New (sb_publishable_)')
}

// Client-side Supabase client (uses publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

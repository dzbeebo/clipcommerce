// Re-export client-side Supabase client
export { supabase } from './supabase-client'

// Re-export server-side Supabase clients
export { 
  createServerSupabaseClient, 
  createServerSupabaseClientForServerComponents,
  createSupabaseAdminClient
} from './supabase-server'

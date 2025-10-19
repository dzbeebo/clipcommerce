# Supabase API Keys Migration Plan for ClipCommerce

## 🎯 Overview
This document outlines the migration plan for ClipCommerce to adopt Supabase's new API key system, replacing the legacy `anon` and `service_role` keys with the new `sb_publishable_...` and `sb_secret_...` keys.

## 📅 Timeline
- **Current Phase:** Early Access (Available now)
- **Full Launch:** July 2025
- **Legacy Deprecation:** November 2025
- **Complete Removal:** Late 2026

## 🔄 Migration Steps

### Phase 1: Immediate Preparation (Now)
1. **Update Environment Variables:**
   ```env
   # New Supabase API Keys
   NEXT_PUBLIC_SUPABASE_URL=https://blbgusssrqzjxczmtqyt.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   
   # Legacy keys (keep during transition)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Update Supabase Client Configuration:**
   ```typescript
   // src/lib/supabase.ts
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
   const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!
   
   // Client-side (browser)
   export const supabase = createClient(supabaseUrl, supabasePublishableKey)
   
   // Server-side (API routes)
   export function createServerSupabaseClient() {
     return createServerClient(supabaseUrl, supabaseSecretKey, {
       // ... cookie configuration
     })
   }
   ```

### Phase 2: Code Updates (July 2025)
1. **Update Client-Side Usage:**
   - Replace all `anon` key references with `publishable` key
   - Ensure no secret keys are exposed in client-side code

2. **Update Server-Side Usage:**
   - Replace all `service_role` key references with `secret` key
   - Add additional security checks for server-side only usage

3. **Update API Routes:**
   ```typescript
   // Before
   const supabase = createServerSupabaseClient()
   
   // After
   const supabase = createServerSupabaseClient() // Uses secret key internally
   ```

### Phase 3: Testing & Validation (July-August 2025)
1. **Test Authentication Flow:**
   - User registration
   - User login
   - Session management
   - Role-based access control

2. **Test Database Operations:**
   - CRUD operations
   - Real-time subscriptions
   - Row Level Security (RLS)

3. **Test API Routes:**
   - Creator signup/login
   - Clipper signup/login
   - Session management
   - Logout functionality

### Phase 4: Production Migration (September 2025)
1. **Deploy to Staging:**
   - Test with new keys in staging environment
   - Validate all functionality works correctly

2. **Deploy to Production:**
   - Update production environment variables
   - Monitor for any issues
   - Have rollback plan ready

### Phase 5: Cleanup (November 2025+)
1. **Remove Legacy Keys:**
   - Remove `anon` and `service_role` key references
   - Clean up environment variables
   - Update documentation

2. **Final Validation:**
   - Ensure all functionality works with new keys only
   - Update team documentation
   - Train team on new key management

## 🔧 Implementation Details

### Current Files to Update:
- `src/lib/supabase.ts` - Main Supabase client configuration
- `src/lib/auth.ts` - Authentication utilities
- `src/app/api/auth/*` - All authentication API routes
- `middleware.ts` - Route protection middleware
- `.env.local` - Environment variables
- `.env.example` - Example environment variables

### Security Considerations:
1. **Never expose secret keys in client-side code**
2. **Use environment variables for all keys**
3. **Implement proper key rotation practices**
4. **Monitor for unauthorized access attempts**

### Testing Checklist:
- [ ] User registration works
- [ ] User login works
- [ ] Session management works
- [ ] Role-based access control works
- [ ] Database operations work
- [ ] API routes work
- [ ] Middleware protection works
- [ ] Logout functionality works

## 📚 Resources
- [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Migration Guide](https://supabase.com/docs/guides/api/api-keys#migration-guide)
- [Security Best Practices](https://supabase.com/docs/guides/api/api-keys#security-best-practices)

## 🚨 Important Notes
- Legacy keys will continue to work until November 2025
- New keys are available now for testing
- Migration is not urgent but should be completed before November 2025
- Test thoroughly in development before production deployment

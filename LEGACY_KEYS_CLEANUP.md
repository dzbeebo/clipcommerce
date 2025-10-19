# Legacy Supabase Keys Cleanup Guide

## 🎯 When to Remove Legacy Keys

**Recommended Timeline:**
- **Now - July 2025:** Keep both new and legacy keys (current setup)
- **July 2025 - November 2025:** Test thoroughly with new keys only
- **November 2025+:** Remove legacy keys completely

## 🧹 Steps to Remove Legacy Keys

### 1. Test with New Keys Only
Temporarily comment out legacy keys in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://blbgusssrqzjxczmtqyt.supabase.co

# New Supabase API Keys (Primary)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aMkRKAG-mv-4dhUO-KwDMA_qlIDHNac
SUPABASE_SECRET_KEY=sb_secret_CtMGIkq_hKJ8PfKh-nlDUg_I0t7mnX5

# Legacy Keys (Comment out for testing)
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

DATABASE_URL=postgresql://postgres.xxx:ACTUAL_PASSWORD@db.blbgusssrqzjxczmtqyt.supabase.co:5432/postgres
```

### 2. Test All Functionality
Run these tests to ensure everything works:

```bash
# Test build
npm run build

# Test development server
npm run dev

# Test database connection
npx prisma db push

# Test authentication flows
# - User registration
# - User login
# - Session management
# - Role-based access
```

### 3. Update Code (When Ready)
Remove fallback logic from `src/lib/supabase.ts`:

```typescript
// Before (with fallback)
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!

// After (new keys only)
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!
```

### 4. Clean Up Environment Files
Remove legacy keys from:
- `.env.local`
- `.env.example`
- Production environment variables

### 5. Update Documentation
- Remove references to legacy keys
- Update setup instructions
- Update team documentation

## ⚠️ Important Notes

1. **Don't Remove Yet:** Keep legacy keys until you're 100% sure new keys work
2. **Test Thoroughly:** Ensure all authentication flows work with new keys only
3. **Have Rollback Plan:** Keep legacy keys in version control for quick rollback
4. **Monitor Logs:** Watch for any authentication errors after migration

## 🔍 Verification Checklist

- [ ] App builds successfully with new keys only
- [ ] Development server starts without errors
- [ ] Database connection works
- [ ] User registration works
- [ ] User login works
- [ ] Session management works
- [ ] Role-based access control works
- [ ] API routes work correctly
- [ ] No console errors about missing keys
- [ ] Production deployment works

## 🚨 Rollback Plan

If issues occur, quickly restore legacy keys:

```env
# Restore legacy keys temporarily
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Then investigate and fix issues before trying again.

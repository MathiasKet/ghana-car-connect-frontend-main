-- =============================================================
-- FIX: Insert missing admin profile for mrkett25@gmail.com
-- Run this in your Supabase Dashboard > SQL Editor
-- =============================================================

-- Step 1: Insert the admin profile directly (bypasses RLS since you run it as DB admin).
-- This ensures the profile row exists in public.users.
INSERT INTO public.users (id, email, name, phone, role, is_verified, is_active)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', 'Admin'),
  au.raw_user_meta_data->>'phone',
  'admin',
  true,
  true
FROM auth.users au
WHERE au.email = 'mrkett25@gmail.com'
ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      is_verified = true,
      is_active = true;

-- Step 2: Drop the old INSERT-only policy and replace with a broader UPSERT-safe policy
-- (Supabase uses INSERT + ON CONFLICT for upserts, so the INSERT policy must allow it)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 3: Also ensure the "Users can view own profile" policy doesn't conflict
-- with the admin viewing their own row (should be fine but kept for clarity)
-- No change needed here.

-- Step 4: Verify the fix worked
SELECT id, email, name, role, is_verified, is_active 
FROM public.users 
WHERE email = 'mrkett25@gmail.com';

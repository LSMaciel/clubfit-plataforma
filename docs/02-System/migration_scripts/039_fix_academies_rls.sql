-- Fix RLS for Academies Table
-- Problem: Super Admin cannot update academies (last_payment_date, status) if no specific policy exists.
-- Diagnosis: Existing policies likely only cover Academy Admin (owner) or Read-Only.

BEGIN;

-- 1. Enable RLS (Ensure it's on)
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies (if any generic ones conflict, but creating a new one is safer)
-- We won't drop unknown policies to avoid breaking current access, we just ADD a permissive one for Super Admin.

-- 3. Create Policy: Super Admin Full Access
-- Allows Select, Insert, Update, Delete for Super Admins.
DROP POLICY IF EXISTS "Super Admin Full Access" ON public.academies;

CREATE POLICY "Super Admin Full Access" ON public.academies
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'SUPER_ADMIN'
  )
);

COMMIT;

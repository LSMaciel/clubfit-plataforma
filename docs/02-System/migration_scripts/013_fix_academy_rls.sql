-- MIGRATION: 013_fix_academy_rls.sql
-- DESCRIPTION: Fixes Row Level Security policies for the 'academies' table.
--              Ensures Academy Admins can update their own academy settings (e.g. colors).

BEGIN;

-- 1. Enable RLS on academies table (ensure it is on)
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (clean slate for this table's policies)
DROP POLICY IF EXISTS "Public read access to academies" ON public.academies;
DROP POLICY IF EXISTS "Admins can update own academy" ON public.academies;

-- 3. Policy: Public Read Access (Needed for Login/Student App to find academy by slug)
--    We allow anyone to SELECT academy basic info (needed for the login page to resolve slug)
CREATE POLICY "Public read access to academies"
ON public.academies
FOR SELECT
USING (true);

-- 4. Policy: Admins can UPDATE their own academy
--    This is the missing piece causing the "Save Error" in Admin Settings.
CREATE POLICY "Admins can update own academy"
ON public.academies
FOR UPDATE
TO authenticated
USING (
    id IN (
        SELECT academy_id 
        FROM public.users 
        WHERE users.id = auth.uid()
    )
)
WITH CHECK (
    id IN (
        SELECT academy_id 
        FROM public.users 
        WHERE users.id = auth.uid()
    )
);

COMMIT;

-- MIGRATION: 002_update_rls.sql (V2 - Robust)
-- DESCRIPTION: Updates RLS policies to enforce strict security in the new N:N partner model.
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

-- 0. Ensure RLS is enabled on target tables (Crucial step)
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_usages ENABLE ROW LEVEL SECURITY;

-- 1. BENEFITS: Enforce visibility based on ACTIVE academy_partner link

-- Drop old policies if they exist (using DO block to avoid errors if names differ)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone from the academy can view benefits" ON public.benefits;
    DROP POLICY IF EXISTS "Students can view benefits of their academy" ON public.benefits;
    DROP POLICY IF EXISTS "Users can view active benefits" ON public.benefits; -- Drop self if re-running
    DROP POLICY IF EXISTS "Partners can manage their own benefits" ON public.benefits;
END $$;

-- New Policy: Users (Admins/Students) can ONLY see benefits IF:
-- 1. The benefit belongs to their academy (optimized check via user/student academy_id)
-- 2. AND there is an ACTIVE link between that academy and the partner.
CREATE POLICY "Users can view active benefits"
ON public.benefits FOR SELECT
USING (
    academy_id IN (
        -- User's Academy
        SELECT academy_id FROM public.users WHERE auth.uid() = id
        UNION ALL
        -- Student's Academy
        SELECT academy_id FROM public.students WHERE auth.uid() = user_id
    )
    AND
    EXISTS (
        SELECT 1 
        FROM public.academy_partners ap
        WHERE ap.partner_id = public.benefits.partner_id
        AND ap.academy_id = public.benefits.academy_id
        AND ap.status = 'ACTIVE'
    )
);

-- Policy for Partners to manage their own benefits
CREATE POLICY "Partners can manage their own benefits"
ON public.benefits FOR ALL
USING (
    partner_id IN (
        SELECT id FROM public.partners WHERE owner_id = auth.uid()
    )
);


-- 2. BENEFIT USAGES: Audit visibility

DO $$
BEGIN
    DROP POLICY IF EXISTS "Academy can view usages" ON public.benefit_usages;
END $$;

CREATE POLICY "Academy can view usages"
ON public.benefit_usages FOR SELECT
USING (
    academy_id IN (
        SELECT academy_id FROM public.users WHERE auth.uid() = id
    )
);

COMMIT;

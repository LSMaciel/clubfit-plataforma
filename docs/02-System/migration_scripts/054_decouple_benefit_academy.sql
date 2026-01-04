-- MIGRATION: 054_decouple_benefit_academy.sql
-- DESCRIPTION: Makes benefits.academy_id nullable to support Global Partners creating promotions without being tied to a single academy context.

BEGIN;

-- 1. Make academy_id nullable
ALTER TABLE public.benefits ALTER COLUMN academy_id DROP NOT NULL;

-- 2. Update RLS policies for benefits
-- We need to ensure Partners can still manage their benefits even if academy_id is null.
-- Currently, existing policies might rely on academy_id. Let's check/recreate them to be safe.

-- Drop existing restricted policies if likely to conflict (Assuming standard naming or clean slate for this specific logic)
-- Better approach: Add a new inclusive policy or rely on ownership.

-- Policy: Partners can view/manage THEIR OWN benefits (via partner_id -> owner_id)
DROP POLICY IF EXISTS "Partners can manage own benefits" ON public.benefits;

CREATE POLICY "Partners can manage own benefits"
ON public.benefits
FOR ALL
USING (
    partner_id IN (
        SELECT id FROM public.partners WHERE owner_id = auth.uid()
    )
);

-- Policy: Academy Admins can view benefits of partners linked to their academy
DROP POLICY IF EXISTS "Academy Admins can view linked benefits" ON public.benefits;

CREATE POLICY "Academy Admins can view linked benefits"
ON public.benefits
FOR SELECT
USING (
    partner_id IN (
        SELECT partner_id FROM public.academy_partners 
        WHERE academy_id IN (
            SELECT academy_id FROM public.users WHERE id = auth.uid()
        )
    )
);

-- Policy: Students can view benefits (Public/Active ones linked to their academy)
-- This is usually handled by the 'getPromotionsFeed' query accessing via Admin Client or specific RLS.
-- But for direct access:
DROP POLICY IF EXISTS "Students can view active benefits" ON public.benefits;

CREATE POLICY "Students can view active benefits"
ON public.benefits
FOR SELECT
USING (
    status = 'ACTIVE' AND
    partner_id IN (
        SELECT partner_id FROM public.academy_partners
        WHERE academy_id IN (
            SELECT academy_id FROM public.students WHERE user_id = auth.uid()
        )
        AND status = 'ACTIVE'
    )
);

COMMIT;

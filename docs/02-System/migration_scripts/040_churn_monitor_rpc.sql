-- Migration: Create Churn Monitor RPC
-- Story: STORY-13C-03
-- Objective: Identify academies with no activity (voucher generation) in the last X days.

BEGIN;

-- Function: get_churn_risks
-- Returns academies that have NO student_access_tokens in the threshold window.
-- Logic:
-- 1. Get all ACTIVE academies.
-- 2. Left Join with max token creation date.
-- 3. Filter where date is older than threshold OR null (never used).

CREATE OR REPLACE FUNCTION public.get_churn_risks(days_threshold int)
RETURNS TABLE (
    academy_id uuid,
    academy_name text,
    slug text,
    last_activity_date timestamptz,
    days_inactive int
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with creator permissions (to access all tokens)
SET search_path = public, extensions
AS $$
BEGIN
    RETURN QUERY
    WITH LastActivity AS (
        SELECT 
            s.academy_id,
            MAX(sat.created_at) as last_token_date
        FROM public.students s
        JOIN public.student_access_tokens sat ON sat.student_id = s.id
        GROUP BY s.academy_id
    )
    SELECT 
        a.id as academy_id,
        a.name as academy_name,
        a.slug,
        la.last_token_date as last_activity_date,
        -- Calculate days inactive. If null (never), treat as infinity (or arbitrarily high number like 999)
        COALESCE(
            EXTRACT(DAY FROM NOW() - la.last_token_date)::int,
            999 -- Never active
        ) as days_inactive
    FROM public.academies a
    LEFT JOIN LastActivity la ON la.academy_id = a.id
    WHERE 
        a.status = 'ACTIVE'
        AND (
            la.last_token_date IS NULL 
            OR 
            la.last_token_date < (NOW() - (days_threshold || ' days')::interval)
        )
    ORDER BY days_inactive DESC;
END;
$$;

-- Grant execution permission to authenticated users (The app will handle Role checks)
GRANT EXECUTE ON FUNCTION public.get_churn_risks(int) TO authenticated;

COMMIT;

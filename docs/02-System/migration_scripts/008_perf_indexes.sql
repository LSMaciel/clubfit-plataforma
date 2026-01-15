-- Migration: 008_perf_indexes
-- Description: Adds performance indexes to optimize RLS policies and common queries.
-- Story: STORY-PERF-00-02

-- 1. Academy Partners Link (Optimization for RLS Subqueries)
-- Many RLS policies check if a connection exists: WHERE academy_id = X AND partner_id = Y
CREATE INDEX IF NOT EXISTS idx_academy_partners_link 
ON public.academy_partners (academy_id, partner_id);

COMMENT ON INDEX public.idx_academy_partners_link IS 'Optimizes lookups for academy-partner relationships used in RLS policies';

-- 2. Users Academy & Role (Optimization for Permission Checks)
-- Policies often check: users.academy_id = X AND users.role = 'ADMIN'
CREATE INDEX IF NOT EXISTS idx_users_academy_role 
ON public.users (academy_id, role);

COMMENT ON INDEX public.idx_users_academy_role IS 'Optimizes role-based permission checks within an academy context';

-- 3. Benefits Partner & Status (Optimization for Public Listings)
-- Queries often filter: WHERE partner_id = X AND status = 'ACTIVE'
CREATE INDEX IF NOT EXISTS idx_benefits_partner 
ON public.benefits (partner_id, status);

COMMENT ON INDEX public.idx_benefits_partner IS 'Optimizes listing of active benefits for a specific partner';

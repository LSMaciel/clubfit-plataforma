-- MIGRATION: 022_add_border_theme_columns.sql
-- DESCRIPTION: Adds 'color_border' and 'border_radius' to 'academies' table.

BEGIN;

-- 1. Add new columns with defaults
ALTER TABLE public.academies 
    ADD COLUMN IF NOT EXISTS color_border text DEFAULT '#CBD5E1', -- Slate 300
    ADD COLUMN IF NOT EXISTS border_radius text DEFAULT '1rem';   -- 16px default (Rounded-2xl)

-- 2. Reload Schema Cache
NOTIFY pgrst, 'reload schema';

COMMIT;

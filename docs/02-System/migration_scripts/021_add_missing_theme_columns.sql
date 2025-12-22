-- MIGRATION: 021_add_missing_theme_columns.sql
-- DESCRIPTION: Adds the missing theme color columns to the 'academies' table.
--              Also migrates data from the legacy 'primary_color' to the new 'color_primary'.

BEGIN;

-- 1. Add new color columns
ALTER TABLE public.academies 
    ADD COLUMN IF NOT EXISTS color_primary text DEFAULT '#000000',
    ADD COLUMN IF NOT EXISTS color_secondary text DEFAULT '#F59E0B',
    ADD COLUMN IF NOT EXISTS color_background text DEFAULT '#F8FAFC',
    ADD COLUMN IF NOT EXISTS color_surface text DEFAULT '#FFFFFF',
    ADD COLUMN IF NOT EXISTS color_text_primary text DEFAULT '#0F172A',
    ADD COLUMN IF NOT EXISTS color_text_secondary text DEFAULT '#64748B';

-- 2. Migrate existing data (Legacy -> New)
-- If 'primary_color' has a value, copy it to 'color_primary'
UPDATE public.academies 
SET color_primary = primary_color 
WHERE primary_color IS NOT NULL;

-- 3. Reload Schema Cache (Just in case)
NOTIFY pgrst, 'reload schema';

COMMIT;

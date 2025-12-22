-- MIGRATION: 012_add_theme_columns.sql
-- DESCRIPTION: Adds theme customization columns to the 'academies' table for PROJ-009 (Customization Engine).
--              These columns allow full white-label control over the student app's colors.
-- AUTHOR: AI Agent
-- DATE: 2025-12-21

BEGIN;

DO $$
BEGIN

    -- Adding Theme Columns (Nullable by default to support existing records)
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_primary text;
    
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_secondary text;
    
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_background text;
    
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_surface text;
    
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_text_primary text;
    
    ALTER TABLE public.academies
    ADD COLUMN IF NOT EXISTS color_text_secondary text;

    RAISE NOTICE '✅ Theme columns added to academies table.';

END $$;

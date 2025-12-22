-- MIGRATION: 023_enhance_partner_schema.sql
-- DESCRIPTION: Adds columns for Partner Profile Enrichment (PROJ-010).
--              Includes socials, opening hours, gallery, and amenities.

BEGIN;

-- 1. Add new columns to 'partners' table
ALTER TABLE public.partners
    ADD COLUMN IF NOT EXISTS whatsapp text,
    ADD COLUMN IF NOT EXISTS instagram text,
    ADD COLUMN IF NOT EXISTS website text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS logo_url text, -- Capa/Logo específico se não usar o da academia (opcional, mas bom ter)
    ADD COLUMN IF NOT EXISTS gallery_urls text[], -- Array de URLs
    ADD COLUMN IF NOT EXISTS menu_url text,      -- PDF do cardápio
    ADD COLUMN IF NOT EXISTS opening_hours jsonb, -- JSON estruturado
    ADD COLUMN IF NOT EXISTS amenities text[];    -- Array de tags (wifi, parking, etc)

-- 2. Create Index for faster lookup if needed (usually by ID is enough, but maybe by specific amenity later)
CREATE INDEX IF NOT EXISTS idx_partners_amenities ON public.partners USING GIN (amenities);

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';

COMMIT;

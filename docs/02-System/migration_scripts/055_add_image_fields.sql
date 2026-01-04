-- MIGRATION: 055_add_image_fields.sql
-- DESCRIPTION: Adds main_image_url to benefits and logo_url/cover_url to partners.
-- AUTHOR: AI Agent
-- DATE: 2026-01-03

BEGIN;

-- 1. Add 'main_image_url' to 'benefits' table
ALTER TABLE public.benefits 
ADD COLUMN IF NOT EXISTS main_image_url text;

-- 2. Add 'logo_url' and 'cover_url' to 'partners' table
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS cover_url text;

COMMIT;

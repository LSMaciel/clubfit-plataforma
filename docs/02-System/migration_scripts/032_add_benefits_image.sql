-- Add cover_image_url to benefits table
-- Part of STORY-12B-03: Image Support

ALTER TABLE public.benefits 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

COMMENT ON COLUMN public.benefits.cover_image_url IS 'URL of the promotional cover image (Banner).';

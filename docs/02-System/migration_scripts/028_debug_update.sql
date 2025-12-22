-- DIAGNOSTIC: 028_debug_update.sql
-- Check if the ID exists and try to force update.

-- 1. Check existence
SELECT id, name FROM public.partners WHERE id = 'd8acb197-872d-40b8-90f0-06594667f78e';

-- 2. Try Update (Simple)
UPDATE public.partners 
SET whatsapp = '5511999999999', amenities = ARRAY['debug']
WHERE id = 'd8acb197-872d-40b8-90f0-06594667f78e';

-- 3. Check if updated
SELECT id, whatsapp, amenities FROM public.partners WHERE id = 'd8acb197-872d-40b8-90f0-06594667f78e';

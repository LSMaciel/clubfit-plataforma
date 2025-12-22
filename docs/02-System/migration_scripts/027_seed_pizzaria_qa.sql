-- MIGRATION: 027_seed_pizzaria_qa.sql
-- DESCRIPTION: Seeds 'Pizzaria QA' with rich data for testing (PROJ-010).
-- FIXED: Uses specific UUID to ensure update happens.

BEGIN;

UPDATE public.partners
SET 
    whatsapp = '5511977777777',
    instagram = 'pizzariaqa',
    website = 'https://pizzariaqa.com.br',
    phone = '1133334444',
    amenities = ARRAY['delivery', 'wifi', 'kids'],
    opening_hours = '{
        "monday": {"open": "18:00", "close": "23:00"},
        "tuesday": {"open": "18:00", "close": "23:00"},
        "wednesday": {"open": "18:00", "close": "23:00"},
        "thursday": {"open": "18:00", "close": "23:00"},
        "friday": {"open": "18:00", "close": "23:59"},
        "saturday": {"open": "18:00", "close": "23:59"},
        "sunday": {"open": "18:00", "close": "23:00"}
    }'::jsonb,
    gallery_urls = ARRAY[
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
    ]
WHERE id = 'd8acb197-872d-40b8-90f0-06594667f78e'; 

COMMIT;

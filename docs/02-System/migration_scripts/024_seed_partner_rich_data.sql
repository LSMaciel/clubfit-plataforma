-- MIGRATION: 024_seed_partner_rich_data.sql
-- DESCRIPTION: Populates partners with rich test data for PROJ-010 development.

BEGIN;

-- 1. Update 'Mega Suplementos' (Exemplo de Loja de Produtos)
UPDATE public.partners
SET 
    whatsapp = '5511999999999',
    instagram = 'megasuplementos',
    website = 'https://megasuplementos.com.br',
    amenities = ARRAY['parking', 'credit_card', 'delivery'],
    opening_hours = '{
        "monday": {"open": "09:00", "close": "19:00"},
        "tuesday": {"open": "09:00", "close": "19:00"},
        "wednesday": {"open": "09:00", "close": "19:00"},
        "thursday": {"open": "09:00", "close": "19:00"},
        "friday": {"open": "09:00", "close": "19:00"},
        "saturday": {"open": "09:00", "close": "14:00"},
        "sunday": null
    }'::jsonb,
    gallery_urls = ARRAY[
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800', 
        'https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?auto=format&fit=crop&q=80&w=800'
    ]
WHERE name ILIKE '%Mega%';

-- 2. Update 'Ironberg' (Exemplo de Academia/Serviço)
UPDATE public.partners
SET 
    whatsapp = '5511988888888',
    instagram = 'ironberg_ct',
    amenities = ARRAY['wifi', 'shower', 'parking', 'ac'],
    opening_hours = '{
        "monday": {"open": "06:00", "close": "23:00"},
        "tuesday": {"open": "06:00", "close": "23:00"},
        "wednesday": {"open": "06:00", "close": "23:00"},
        "thursday": {"open": "06:00", "close": "23:00"},
        "friday": {"open": "06:00", "close": "23:00"},
        "saturday": {"open": "08:00", "close": "18:00"},
        "sunday": {"open": "08:00", "close": "14:00"}
    }'::jsonb
WHERE name ILIKE '%Ironberg%';

COMMIT;

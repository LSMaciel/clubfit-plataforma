-- SEED: 017_seed_marketplace_categories.sql
-- DESCRIPTION: Populates the database with standard Marketplace Categories and Tags.
--              Safe to run multiple times (uses ON CONFLICT DO NOTHING).

BEGIN;

-- 1. Insert Partner Tags
INSERT INTO public.partner_tags (name, icon_name) VALUES 
('Delivery', 'bike'),
('Voucher', 'ticket'),
('Cashback', 'coins'),
('Online', 'globe'),
('Presencial', 'map-pin'),
('Kids Friendly', 'baby'),
('Pet Friendly', 'dog'),
('24 Horas', 'clock')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Macro Categories (PARENTS)
INSERT INTO public.categories (name, slug, icon_name, parent_id) VALUES
('Gastronomia', 'gastronomia', 'utensils', NULL),
('Saúde & Bem-estar', 'saude-bem-estar', 'activity', NULL),
('Educação', 'educacao', 'graduation-cap', NULL),
('Lazer & Entretenimento', 'lazer-entretenimento', 'ticket', NULL),
('Serviços', 'servicos', 'briefcase', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Sub-Categories (CHILDREN) linked to Parents
-- We use a DO block or CTEs to find the parent IDs dynamically.

WITH parents AS (
    SELECT id, slug FROM public.categories WHERE parent_id IS NULL
)
INSERT INTO public.categories (name, slug, icon_name, parent_id) VALUES
-- Gastronomia
('Restaurantes', 'restaurantes', 'utensils', (SELECT id FROM parents WHERE slug = 'gastronomia')),
('Fast Food', 'fast-food', 'sandwich', (SELECT id FROM parents WHERE slug = 'gastronomia')),
('Cafeterias', 'cafeterias', 'coffee', (SELECT id FROM parents WHERE slug = 'gastronomia')),
('Sorveterias', 'sorveterias', 'ice-cream', (SELECT id FROM parents WHERE slug = 'gastronomia')),

-- Saúde
('Academias', 'academias-parceiras', 'dumbbell', (SELECT id FROM parents WHERE slug = 'saude-bem-estar')),
('Clínicas', 'clinicas', 'stethoscope', (SELECT id FROM parents WHERE slug = 'saude-bem-estar')),
('Suplementos', 'suplementos', 'pill', (SELECT id FROM parents WHERE slug = 'saude-bem-estar')),
('Estética', 'estetica', 'sparkles', (SELECT id FROM parents WHERE slug = 'saude-bem-estar')),

-- Educação
('Idiomas', 'idiomas', 'languages', (SELECT id FROM parents WHERE slug = 'educacao')),
('Faculdades', 'faculdades', 'library', (SELECT id FROM parents WHERE slug = 'educacao')),
('Cursos Livres', 'cursos-livres', 'book-open', (SELECT id FROM parents WHERE slug = 'educacao')),

-- Lazer
('Cinemas', 'cinemas', 'film', (SELECT id FROM parents WHERE slug = 'lazer-entretenimento')),
('Parques', 'parques', 'tree-pine', (SELECT id FROM parents WHERE slug = 'lazer-entretenimento')),
('Shows', 'shows', 'music', (SELECT id FROM parents WHERE slug = 'lazer-entretenimento')),

-- Serviços
('Lavanderia', 'lavanderia', 'shirt', (SELECT id FROM parents WHERE slug = 'servicos')),
('Barbearia', 'barbearia', 'scissors', (SELECT id FROM parents WHERE slug = 'servicos')),
('Automotivo', 'automotivo', 'car', (SELECT id FROM parents WHERE slug = 'servicos')),
('Pet Shop', 'pet-shop', 'bone', (SELECT id FROM parents WHERE slug = 'servicos'))

ON CONFLICT (slug) DO NOTHING;

COMMIT;

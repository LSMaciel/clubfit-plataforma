-- MIGRATION: 014_create_marketplace_schema.sql
-- DESCRIPTION: Creates the schema for the Marketplace structure (PROJ-009).
--              Includes hierarchical categories, partner tags, and their relationships.

BEGIN;

-- 1. Tabela: Categories (Hierárquica)
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    icon_name text, -- Referência para ícone no Frontend (ex: Lucide)
    parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL, -- Auto-referência para subcategorias
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Tabela: Partner Tags (Atributos como "Delivery", "Pet Friendly")
CREATE TABLE IF NOT EXISTS public.partner_tags (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    icon_name text,
    created_at timestamptz DEFAULT now()
);

-- 3. Tabela de Junção: Partner <-> Categories (N:N)
CREATE TABLE IF NOT EXISTS public.partner_categories (
    partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (partner_id, category_id)
);

-- 4. Tabela de Junção: Partner <-> Tags (N:N)
CREATE TABLE IF NOT EXISTS public.partner_tags_link (
    partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES public.partner_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (partner_id, tag_id)
);

-- 5. Indexes para Performance
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_partner_categories_cat ON public.partner_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_tags_link_tag ON public.partner_tags_link(tag_id);

-- 6. Trigger para updated_at em Categories
CREATE TRIGGER handle_updated_at_categories BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- 7. RLS (Segurança)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tags_link ENABLE ROW LEVEL SECURITY;

-- Políticas: Leitura Pública (Qualquer um vê o catálogo), Escrita apenas Super Admin (Por enquanto)
CREATE POLICY "Public read access categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access partner_tags" ON public.partner_tags FOR SELECT USING (true);
CREATE POLICY "Public read access partner_categories" ON public.partner_categories FOR SELECT USING (true);
CREATE POLICY "Public read access partner_tags_link" ON public.partner_tags_link FOR SELECT USING (true);

-- (Opcional) Políticas de Escrita para Super Admin seriam adicionadas aqui se tivéssemos gestão via App. 
-- Por enquanto, gestão será via Banco/Seed.

COMMIT;

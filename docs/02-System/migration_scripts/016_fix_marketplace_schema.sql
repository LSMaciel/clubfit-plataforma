-- MIGRATION: 016_fix_marketplace_schema.sql
-- DESCRIPTION: Idempotent script to complete the Marketplace schema.
--              It safely handles the fact that 'categories' table already exists.
--              It creates missing tables (partner_tags, links) and resets policies.

BEGIN;

-- 1. Tabela Categories (Já existe, apenas garantimos RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Corrigir Trigger (Apagar se existir para recriar sem erro)
DROP TRIGGER IF EXISTS handle_updated_at_categories ON public.categories;
CREATE TRIGGER handle_updated_at_categories BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- 3. Tabela: Partner Tags (Criar se não existir)
CREATE TABLE IF NOT EXISTS public.partner_tags (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    icon_name text,
    created_at timestamptz DEFAULT now()
);

-- 4. Tabelas de Junção (Criar se não existir)
CREATE TABLE IF NOT EXISTS public.partner_categories (
    partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (partner_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.partner_tags_link (
    partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES public.partner_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (partner_id, tag_id)
);

-- 5. Indexes (IF NOT EXISTS evita erro se já tiver)
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_partner_categories_cat ON public.partner_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_tags_link_tag ON public.partner_tags_link(tag_id);

-- 6. RLS Policies (Apagar antigas e recriar para garantir estado limpo)
-- Categories
DROP POLICY IF EXISTS "Public read access categories" ON public.categories;
CREATE POLICY "Public read access categories" ON public.categories FOR SELECT USING (true);

-- Tags
ALTER TABLE public.partner_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access partner_tags" ON public.partner_tags;
CREATE POLICY "Public read access partner_tags" ON public.partner_tags FOR SELECT USING (true);

-- Links
ALTER TABLE public.partner_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access partner_categories" ON public.partner_categories;
CREATE POLICY "Public read access partner_categories" ON public.partner_categories FOR SELECT USING (true);

ALTER TABLE public.partner_tags_link ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access partner_tags_link" ON public.partner_tags_link;
CREATE POLICY "Public read access partner_tags_link" ON public.partner_tags_link FOR SELECT USING (true);

COMMIT;

-- MIGRATION: 006_fix_partners_rls.sql
-- DESCRIPTION: Corrigi as políticas de RLS para garantir que alunos vejam parceiros da sua academia.
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

-- 1. Habilitar RLS (Garantia)
ALTER TABLE public.academy_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- 2. Limpar Políticas Antigas (para recriar corretamente)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Students can view links of their academy" ON public.academy_partners;
    DROP POLICY IF EXISTS "Academy Admins can view own partner links" ON public.academy_partners;
    DROP POLICY IF EXISTS "Users can view active benefits" ON public.partners;
    DROP POLICY IF EXISTS "Users can view linked partners" ON public.partners;

    -- Novos drops para garantir idempotência
    DROP POLICY IF EXISTS "Student view own academy links" ON public.academy_partners;
    DROP POLICY IF EXISTS "Admin view own academy links" ON public.academy_partners;
    DROP POLICY IF EXISTS "Admin manage own academy links" ON public.academy_partners;
    DROP POLICY IF EXISTS "Users view active partners" ON public.partners;
END $$;

-- 3. Políticas para Academy Partners (A tabela de vínculo)

-- Aluno vê vínculo se for da sua academia
CREATE POLICY "Student view own academy links"
ON public.academy_partners FOR SELECT
USING (
    academy_id IN (
        SELECT academy_id FROM public.students WHERE user_id = auth.uid()
    )
);

-- Admin vê vínculo se for da sua academia
CREATE POLICY "Admin view own academy links"
ON public.academy_partners FOR SELECT
USING (
    academy_id IN (
        SELECT academy_id FROM public.users WHERE id = auth.uid()
    )
);

-- Admin gerencia vínculo da sua academia
CREATE POLICY "Admin manage own academy links"
ON public.academy_partners FOR ALL
USING (
    academy_id IN (
        SELECT academy_id FROM public.users WHERE id = auth.uid()
    )
);


-- 4. Políticas para Partners (A tabela global)

-- Qualquer usuário (Aluno ou Admin) pode ver um parceiro SE houver um vínculo ATIVO com sua academia
CREATE POLICY "Users view active partners"
ON public.partners FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.academy_partners ap
        WHERE ap.partner_id = id
        AND ap.status = 'ACTIVE'
        AND ap.academy_id IN (
            -- Academia do Aluno
            SELECT academy_id FROM public.students WHERE user_id = auth.uid()
            UNION ALL
            -- Academia do Admin
            SELECT academy_id FROM public.users WHERE id = auth.uid()
        )
    )
    OR
    -- O próprio dono do parceiro vê sua empresa
    owner_id = auth.uid()
);

COMMIT;

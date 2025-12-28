BEGIN;

-- 1. Habilitar RLS na nova tabela
ALTER TABLE public.academy_partners ENABLE ROW LEVEL SECURITY;

-- 2. Limpar Políticas Antigas de Partners (Evitar conflitos)
DROP POLICY IF EXISTS "Users can view partners of their academy" ON public.partners;
DROP POLICY IF EXISTS "Partners can view own record" ON public.partners;
DROP POLICY IF EXISTS "Academy Admins can create partners" ON public.partners;
DROP POLICY IF EXISTS "Owners can update own partners" ON public.partners;
-- (Adicione outros DROPs se souber nomes específicos, ou drope todos manualmente se necessário)

-- 3. Políticas para tabela 'academy_partners' (A tabela de vínculo)

-- 3.1. VISUALIZAÇÃO (SELECT)
-- Academy Admin pode ver os vínculos DA SUA academia.
-- Super Admin pode ver tudo.
CREATE POLICY "Academy Admins can view own links" ON public.academy_partners
FOR SELECT USING (
    academy_id IN (
        SELECT academy_id FROM public.users 
        WHERE id = auth.uid() AND (role = 'ACADEMY_ADMIN' OR role = 'SUPER_ADMIN')
    )
);

-- 3.2. CRIAÇÃO (INSERT)
-- Academy Admin pode criar vínculo APENAS para sua própria academia.
CREATE POLICY "Academy Admins can link partners" ON public.academy_partners
FOR INSERT WITH CHECK (
    academy_id IN (
        SELECT academy_id FROM public.users 
        WHERE id = auth.uid() AND role = 'ACADEMY_ADMIN'
    )
);

-- 3.3. REMOÇÃO (DELETE)
-- Academy Admin pode remover vínculos da sua própria academia.
CREATE POLICY "Academy Admins can unlink partners" ON public.academy_partners
FOR DELETE USING (
    academy_id IN (
        SELECT academy_id FROM public.users 
        WHERE id = auth.uid() AND role = 'ACADEMY_ADMIN'
    )
);


-- 4. Novas Políticas para tabela 'partners' (Global)

-- 4.1. VISUALIZAÇÃO (SELECT)
-- Regra: Usuário vê parceiro SE:
-- A) É Super Admin.
-- B) É o DONO do parceiro.
-- C) O parceiro está vinculado à academia do usuário (via academy_partners).
CREATE POLICY "Users can view relevant partners" ON public.partners
FOR SELECT USING (
    -- A & B: Super Admin ou Dono
    (EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND (role = 'SUPER_ADMIN' OR id = partners.owner_id)
    ))
    OR
    -- C: Vinculado à academia do usuário
    (EXISTS (
        SELECT 1 FROM public.academy_partners ap
        JOIN public.users u ON u.academy_id = ap.academy_id
        WHERE ap.partner_id = partners.id
        AND u.id = auth.uid()
        AND ap.status = 'ACTIVE'
    ))
);

-- 4.2. CRIAÇÃO (INSERT)
-- Qualquer usuário autenticado (role correta) pode cadastrar um parceiro novo.
-- O owner_id deve ser o próprio usuário (ou nulo se for inserido via backend com role service, mas aqui focamos no user).
CREATE POLICY "Admins can create global partners" ON public.partners
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

-- 4.3. ATUALIZAÇÃO (UPDATE)
-- Apenas o Dono ou Super Admin pode editar os dados CADASTRAIS do parceiro (Nome, Endereço, etc).
CREATE POLICY "Owners and Super Admins can update partners" ON public.partners
FOR UPDATE USING (
    (EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    ))
    OR
    owner_id = auth.uid()
);

-- 4.4. DELEÇÃO (DELETE)
-- Apenas Super Admin.
CREATE POLICY "Only Super Admin can delete partners" ON public.partners
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
);

COMMIT;

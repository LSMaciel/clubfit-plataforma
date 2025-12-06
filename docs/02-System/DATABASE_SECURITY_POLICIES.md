# Políticas de Segurança de Banco de Dados (RLS)

**Status:** Implementado (STORY-002)
**Descrição:** Este documento contém o script SQL responsável por ativar o Row Level Security e definir as políticas de acesso baseadas em isolamento Multi-tenant.

---

## Script SQL (V1)

```sql
BEGIN;

--------------------------------------------------------------------------------
-- 1. FUNÇÃO AUXILIAR (SECURITY DEFINER)
-- Permite buscar dados do usuário logado mesmo com RLS ativo na tabela users.
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_data()
RETURNS TABLE(academy_id uuid, role public.user_role) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
  SELECT academy_id, role FROM public.users WHERE id = auth.uid();
$$;

--------------------------------------------------------------------------------
-- 2. HABILITAR RLS EM TODAS AS TABELAS
--------------------------------------------------------------------------------
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_usages ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 3. POLÍTICAS DE SEGURANÇA (POLICIES)
--------------------------------------------------------------------------------

-- === TABELA: ACADEMIES ===
-- Leitura pública: Necessário para carregar a tela de login com o slug da academia.
CREATE POLICY "Public read access" ON public.academies 
FOR SELECT USING (true);

-- Escrita: Apenas Super Admin.
CREATE POLICY "Super Admin full access" ON public.academies 
FOR ALL USING ( 
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN' 
);


-- === TABELA: USERS ===
-- Leitura: Usuário vê seu próprio perfil.
CREATE POLICY "Read own profile" ON public.users 
FOR SELECT USING ( auth.uid() = id );

-- Gestão: Admin da Academia vê usuários da sua academia (exceto Super Admin).
CREATE POLICY "Academy Admin manages staff" ON public.users 
FOR ALL USING (
  academy_id = (SELECT academy_id FROM public.get_user_data())
  OR
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN'
);


-- === TABELA: PARTNERS ===
-- Leitura/Escrita: Admin e Parceiros veem parceiros da SUA academia.
CREATE POLICY "Academy Isolation for Partners" ON public.partners
FOR ALL USING (
  academy_id = (SELECT academy_id FROM public.get_user_data())
  OR
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN'
);


-- === TABELA: STUDENTS ===
-- Leitura: Aluno vê seu próprio cadastro.
CREATE POLICY "Student reads own data" ON public.students
FOR SELECT USING ( user_id = auth.uid() );

-- Gestão: Admin/Parceiro veem alunos da SUA academia (para validar e gerir).
CREATE POLICY "Staff manages students" ON public.students
FOR ALL USING (
  academy_id = (SELECT academy_id FROM public.get_user_data())
  OR
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN'
);


-- === TABELA: BENEFITS ===
-- Leitura: Pública (Vitrine de promoções da academia).
CREATE POLICY "Public read benefits" ON public.benefits
FOR SELECT USING (true);

-- Escrita: Parceiro ou Admin gerenciam benefícios da sua academia.
CREATE POLICY "Staff manages benefits" ON public.benefits
FOR ALL USING (
  academy_id = (SELECT academy_id FROM public.get_user_data())
  OR
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN'
);


-- === TABELA: STUDENT_ACCESS_TOKENS (QR Codes) ===
-- Aluno: Cria e vê seus próprios tokens.
CREATE POLICY "Student manages own tokens" ON public.student_access_tokens
FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Parceiro/Admin: Leitura permitida para tokens gerados para benefícios da SUA academia.
CREATE POLICY "Staff validates tokens" ON public.student_access_tokens
FOR SELECT USING (
  benefit_id IN (SELECT id FROM public.benefits WHERE academy_id = (SELECT academy_id FROM public.get_user_data()))
);


-- === TABELA: BENEFIT_USAGES (Histórico) ===
-- Isolamento total por academia.
CREATE POLICY "Academy Isolation for Usages" ON public.benefit_usages
FOR ALL USING (
  academy_id = (SELECT academy_id FROM public.get_user_data())
  OR
  (SELECT role FROM public.get_user_data()) = 'SUPER_ADMIN'
);

COMMIT;
```
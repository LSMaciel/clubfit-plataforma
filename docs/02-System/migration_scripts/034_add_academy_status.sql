-- Migration: Add Status Field to Academies (Lifecycle Control) - FIXED
-- Story: STORY-13A-01
-- Epic: EPIC-13A (Super Admin)
-- Fix: Partners table does not have academy_id (Global Table). Added Join with academy_partners.

BEGIN;

-- 1. Criar o TYPE ENUM para status da academia (se não existir)
DO $$ BEGIN
    CREATE TYPE public.academy_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar coluna na tabela academies
ALTER TABLE public.academies 
ADD COLUMN IF NOT EXISTS status public.academy_status NOT NULL DEFAULT 'ACTIVE';

-- 3. Atualizar RLS Policies

-- Policy para PARTNERS 
-- Lógica: O parceiro é visível se existir um vínculo (academy_partners) com uma academia ATIVA.
-- Nota: Isso supõe que a aplicação filtra por academy_id via Join, e o RLS garante que o link é válido.
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.partners;
DROP POLICY IF EXISTS "Enable read access for active academies only" ON public.partners;

CREATE POLICY "Enable read access for active academies only" ON public.partners
FOR SELECT
USING (
  exists (
    select 1 from public.academy_partners ap
    join public.academies a on a.id = ap.academy_id
    where ap.partner_id = partners.id
    and a.status = 'ACTIVE'
  )
);

-- Policy para BENEFITS
-- Lógica: O benefício tem academy_id desnormalizado, então checamos direto.
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.benefits;
DROP POLICY IF EXISTS "Enable read access for active academies only" ON public.benefits;

CREATE POLICY "Enable read access for active academies only" ON public.benefits
FOR SELECT
USING (
  exists (
    select 1 from public.academies
    where id = benefits.academy_id
    and status = 'ACTIVE'
  )
);

COMMIT;

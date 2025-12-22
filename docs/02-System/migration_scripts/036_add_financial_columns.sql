-- Migration: Add Financial Columns to Academies
-- Story: STORY-13C-01
-- Epic: EPIC-13C (Painel Financeiro)

BEGIN;

-- Adicionar colunas financeiras na tabela academies se não existirem
ALTER TABLE public.academies 
ADD COLUMN IF NOT EXISTS due_day smallint CHECK (due_day BETWEEN 1 AND 31),
ADD COLUMN IF NOT EXISTS last_payment_date date;

-- Comentários para documentação
COMMENT ON COLUMN public.academies.due_day IS 'Dia do mês de vencimento da mensalidade (1-31)';
COMMENT ON COLUMN public.academies.last_payment_date IS 'Data da última mensalidade quitada';

COMMIT;

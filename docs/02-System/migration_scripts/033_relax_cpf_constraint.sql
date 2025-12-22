-- Migration: Relax CPF Constraint (Global -> Per Academy)
-- Objetivo: Permitir que o mesmo CPF seja cadastrado em academias diferentes (Modelo "Silo").
-- Ticket: PROJ-012 (Discussão sobre Multi-Academia)

BEGIN;

-- 1. Remover a restrição antiga (Global)
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS unique_cpf;

-- 2. Adicionar a nova restrição (Composta: CPF + Academia)
-- Isso garante que:
-- - O CPF 123 pode existir na Academia A
-- - O CPF 123 pode existir na Academia B
-- - O CPF 123 NÃO pode existir duas vezes na Academia A
ALTER TABLE public.students ADD CONSTRAINT unique_student_per_academy UNIQUE (academy_id, cpf);

COMMIT;

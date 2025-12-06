-- MIGRATION: STORY-003 - Tornar benefit_id opcional na tabela de tokens
-- Motivo: Permitir geração de "Tokens de Carteira" genéricos, não vinculados a um benefício específico no momento da geração.

ALTER TABLE public.student_access_tokens 
ALTER COLUMN benefit_id DROP NOT NULL;

-- Comentário para documentação
COMMENT ON COLUMN public.student_access_tokens.benefit_id IS 'Pode ser NULL para tokens genéricos de identidade (Carteira Digital)';

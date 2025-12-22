BEGIN;

-- 1. Adicionar Colunas para Promoções Avançadas (PROJ-012)
ALTER TABLE public.benefits
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'STANDARD',
ADD COLUMN IF NOT EXISTS configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS constraints jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 2. Adicionar Índice para Performance (Filtrar por tipo)
CREATE INDEX IF NOT EXISTS idx_benefits_type ON public.benefits(type);

-- 3. Documentação das Colunas
COMMENT ON COLUMN public.benefits.type IS 'Tipo de promoção: STANDARD, DISCOUNT_PERCENTAGE, BOGO, GIFT, FREE_SHIPPING';
COMMENT ON COLUMN public.benefits.configuration IS 'Configuração do benefício (ex: valor do desconto, qtd itens). JSONB.';
COMMENT ON COLUMN public.benefits.constraints IS 'Regras de validação (ex: horário, canal, limite por cpf). JSONB.';

COMMIT;

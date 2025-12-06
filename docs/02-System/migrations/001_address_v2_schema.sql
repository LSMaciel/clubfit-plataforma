-- Migration: 001_address_v2_schema.sql
-- Description: Adiciona colunas de endereço estruturado e geolocalização
-- Author: Antigravity Agent
-- Date: 2025-12-05

BEGIN;

-- 1. Atualizar Tabela Partners (Adicionar campos de endereço)
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text, -- UF (2 chars)
ADD COLUMN IF NOT EXISTS complement text,
ADD COLUMN IF NOT EXISTS latitude numeric, -- Melhor precisão que float
ADD COLUMN IF NOT EXISTS longitude numeric;

-- 2. Atualizar Tabela Academies (Adicionar campos de endereço)
ALTER TABLE public.academies
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS complement text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

COMMIT;

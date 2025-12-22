-- MIGRATION: 009_fix_academy_links.sql
-- DESCRIPTION: Força a criação/atualização de links ATIVOS entre a Academia de teste e os Parceiros QA.
--              Isso resolve o erro "Este benefício não está mais disponível para sua academia" ao gerar voucher.
-- AUTHOR: AI Agent
-- DATE: 2025-12-20

BEGIN;

DO $$
DECLARE
    v_target_academy_id uuid := '01e063a9-5e16-4f9f-ac02-05db0309debd'; -- ID da Academia do Aluno (Smart Fit Mock)
    v_partner_pizza_id uuid;
    v_partner_cross_id uuid;
BEGIN
    -- 1. Recuperar IDs dos Parceiros
    SELECT id INTO v_partner_pizza_id FROM public.partners WHERE cnpj = '00000000000199';
    SELECT id INTO v_partner_cross_id FROM public.partners WHERE cnpj = '00000000000299';

    -- 2. Corrigir Link da Pizzaria
    IF v_partner_pizza_id IS NOT NULL THEN
        RAISE NOTICE '🔗 Vinculando Pizzaria QA...';
        
        INSERT INTO public.academy_partners (academy_id, partner_id, status, created_at, updated_at)
        VALUES (v_target_academy_id, v_partner_pizza_id, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (academy_id, partner_id) 
        DO UPDATE SET status = 'ACTIVE', updated_at = NOW();
    END IF;

    -- 3. Corrigir Link do Crossfit
    IF v_partner_cross_id IS NOT NULL THEN
        RAISE NOTICE '🔗 Vinculando Crossfit QA...';

        INSERT INTO public.academy_partners (academy_id, partner_id, status, created_at, updated_at)
        VALUES (v_target_academy_id, v_partner_cross_id, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (academy_id, partner_id) 
        DO UPDATE SET status = 'ACTIVE', updated_at = NOW();
    END IF;

    RAISE NOTICE '✅ Vínculos corrigidos com sucesso! Tente gerar o voucher novamente.';

END $$;

COMMIT;

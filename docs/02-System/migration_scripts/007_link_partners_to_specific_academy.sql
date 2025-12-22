-- MIGRATION: 007_link_partners_to_specific_academy.sql
-- DESCRIPTION: Força o vínculo dos parceiros de QA para a academia ESPECÍFICA onde o usuário está logado.
--              ID da Academia Alvo: 01e063a9-5e16-4f9f-ac02-05db0309debd
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

DO $$
DECLARE
    v_target_academy_id uuid := '01e063a9-5e16-4f9f-ac02-05db0309debd'; -- ID pego dos logs
    v_partner_a_id uuid;
    v_partner_b_id uuid;
BEGIN
    RAISE NOTICE '🔧 Corrigindo dados para a Academia ID: %', v_target_academy_id;

    -- 1. Encontrar os parceiros de QA (criados no script 003)
    SELECT id INTO v_partner_a_id FROM public.partners WHERE cnpj = '00000000000199'; -- Pizzaria QA
    SELECT id INTO v_partner_b_id FROM public.partners WHERE cnpj = '00000000000299'; -- Crossfit QA

    IF v_partner_a_id IS NULL OR v_partner_b_id IS NULL THEN
        RAISE NOTICE '⚠️ Parceiros de QA não encontrados. Rodando o seed básico primeiro...';
        -- Fallback: Se não existirem, cria agora rapidinho
        INSERT INTO public.partners (name, cnpj, description, address, city, state, zip_code)
        VALUES ('Pizzaria QA', '00000000000199', 'A melhor pizza do ambiente de teste', 'Rua dos Bugs, 100', 'São Paulo', 'SP', '01000-000')
        ON CONFLICT (cnpj) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_partner_a_id;

        INSERT INTO public.partners (name, cnpj, description, address, city, state, zip_code)
        VALUES ('Academia Crossfit QA', '00000000000299', 'Parceiro de treino cruzado', 'Av. dos Testes, 200', 'São Paulo', 'SP', '01000-000')
        ON CONFLICT (cnpj) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_partner_b_id;
    END IF;

    -- 2. Criar Vínculos (Academy Partners) para ESTA academia específica
    
    INSERT INTO public.academy_partners (academy_id, partner_id, status)
    VALUES (v_target_academy_id, v_partner_a_id, 'ACTIVE')
    ON CONFLICT (academy_id, partner_id) DO UPDATE SET status = 'ACTIVE';

    INSERT INTO public.academy_partners (academy_id, partner_id, status)
    VALUES (v_target_academy_id, v_partner_b_id, 'ACTIVE')
    ON CONFLICT (academy_id, partner_id) DO UPDATE SET status = 'ACTIVE';

    -- 3. Garantir que os benefícios também sejam desta academia (para aparecerem no card)
    -- O sistema filtra por academy_id na tabela benefits também.
    UPDATE public.benefits
    SET academy_id = v_target_academy_id
    WHERE partner_id IN (v_partner_a_id, v_partner_b_id);

    RAISE NOTICE '✅ Vínculos criados com sucesso! Agora vai aparecer.';

END $$;

COMMIT;

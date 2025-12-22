-- MIGRATION: 011_force_fix_by_slug.sql
-- DESCRIPTION: Script "Marreta" para alinhar TUDO (Aluno, Benefícios, Links) para a academia 'smart-fit-test'.
--              Isso garante que o teste funcione independente dos IDs aleatórios gerados anteriormente.
-- AUTHOR: AI Agent
-- DATE: 2025-12-20

BEGIN;

DO $$
DECLARE
    v_slug text := 'smart-fit-test';
    v_target_academy_id uuid;
    v_partner_pizza_id uuid;
    v_partner_cross_id uuid;
BEGIN
    -- 1. Recuperar ID da Academia pelo Slug
    SELECT id INTO v_target_academy_id FROM public.academies WHERE slug = v_slug;

    IF v_target_academy_id IS NULL THEN
        RAISE EXCEPTION '❌ Academia com slug "%" não encontrada! Crie-a primeiro ou verifique o nome.', v_slug;
    END IF;

    RAISE NOTICE '🎯 Alinhando dados para Academia: % (ID: %)', v_slug, v_target_academy_id;

    -- 2. Recuperar IDs dos Parceiros QA
    SELECT id INTO v_partner_pizza_id FROM public.partners WHERE cnpj = '00000000000199';
    SELECT id INTO v_partner_cross_id FROM public.partners WHERE cnpj = '00000000000299';

    -- 3. Atualizar TODOS os Alunos de Teste para pertencer a esta academia
    -- (No ambiente de QA local, assumimos que podemos mover o aluno logado)
    UPDATE public.students 
    SET academy_id = v_target_academy_id
    WHERE email LIKE '%teste%' OR email LIKE '%student%';
    
    RAISE NOTICE '   ✅ Alunos de teste movidos para a academia correta.';

    -- 4. Atualizar os Benefícios QA para pertencer a esta academia
    IF v_partner_pizza_id IS NOT NULL THEN
        UPDATE public.benefits
        SET academy_id = v_target_academy_id
        WHERE partner_id = v_partner_pizza_id;
    END IF;

    IF v_partner_cross_id IS NOT NULL THEN
        UPDATE public.benefits
        SET academy_id = v_target_academy_id
        WHERE partner_id = v_partner_cross_id;
    END IF;

    RAISE NOTICE '   ✅ Benefícios QA movidos para a academia correta.';

    -- 5. Recriar/Atualizar Links na tabela academy_partners
    IF v_partner_pizza_id IS NOT NULL THEN
        INSERT INTO public.academy_partners (academy_id, partner_id, status, created_at, updated_at)
        VALUES (v_target_academy_id, v_partner_pizza_id, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (academy_id, partner_id) 
        DO UPDATE SET status = 'ACTIVE', updated_at = NOW();
    END IF;

    IF v_partner_cross_id IS NOT NULL THEN
        INSERT INTO public.academy_partners (academy_id, partner_id, status, created_at, updated_at)
        VALUES (v_target_academy_id, v_partner_cross_id, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (academy_id, partner_id) 
        DO UPDATE SET status = 'ACTIVE', updated_at = NOW();
    END IF;
    
    RAISE NOTICE '   ✅ Vínculos Academy-Partner forçados para ACTIVE.';

END $$;

COMMIT;

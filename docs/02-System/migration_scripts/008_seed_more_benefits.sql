-- MIGRATION: 008_seed_more_benefits.sql
-- DESCRIPTION: Adiciona várias promoções aos parceiros de QA para testar a "experiência McDonald's"
--              (Carrossel/Lista de ofertas por parceiro)
-- AUTHOR: AI Agent
-- DATE: 2025-12-20

BEGIN;

DO $$
DECLARE
    v_target_academy_id uuid := '01e063a9-5e16-4f9f-ac02-05db0309debd'; -- Academy ID do seu usuário
    v_partner_pizza_id uuid;
    v_partner_cross_id uuid;
BEGIN
    -- 1. Recuperar IDs dos Parceiros
    SELECT id INTO v_partner_pizza_id FROM public.partners WHERE cnpj = '00000000000199';
    SELECT id INTO v_partner_cross_id FROM public.partners WHERE cnpj = '00000000000299';

    IF v_partner_pizza_id IS NOT NULL THEN
        RAISE NOTICE '🍕 Adicionando Cardápio na Pizzaria QA...';
        
        -- Oferta 1
        INSERT INTO public.benefits (partner_id, academy_id, title, rules, status, validity_start, validity_end)
        VALUES (v_partner_pizza_id, v_target_academy_id, 'Combo Família: Pizza G + Refri', 'Válido seg-qui. Apresente este voucher.', 'ACTIVE', NOW(), NOW() + interval '1 year');

        -- Oferta 2
        INSERT INTO public.benefits (partner_id, academy_id, title, rules, status, validity_start, validity_end)
        VALUES (v_partner_pizza_id, v_target_academy_id, 'Borda Recheada Grátis', 'Na compra de qualquer pizza média ou grande.', 'ACTIVE', NOW(), NOW() + interval '6 months');

        -- Oferta 3
        INSERT INTO public.benefits (partner_id, academy_id, title, rules, status, validity_start, validity_end)
        VALUES (v_partner_pizza_id, v_target_academy_id, '50% OFF na 2ª Pizza', 'Válido para pizzas do mesmo tamanho ou menor.', 'ACTIVE', NOW(), NOW() + interval '1 month');
    END IF;

    IF v_partner_cross_id IS NOT NULL THEN
        RAISE NOTICE '🏋️ Adicionando Planos no Crossfit QA...';

        -- Oferta 1
        INSERT INTO public.benefits (partner_id, academy_id, title, rules, status, validity_start, validity_end)
        VALUES (v_partner_cross_id, v_target_academy_id, '1ª Mensalidade Grátis', 'No plano anual. Exclusivo ClubFit.', 'ACTIVE', NOW(), NOW() + interval '1 year');

        -- Oferta 2
        INSERT INTO public.benefits (partner_id, academy_id, title, rules, status, validity_start, validity_end)
        VALUES (v_partner_cross_id, v_target_academy_id, 'Aula Experimental (Day Pass)', 'Agende sua aula no balcão.', 'ACTIVE', NOW(), NOW() + interval '1 year');
    END IF;

    RAISE NOTICE '✅ Novas promoções cadastradas com sucesso!';

END $$;

COMMIT;

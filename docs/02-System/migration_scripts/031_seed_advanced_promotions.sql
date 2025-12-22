-- MIGRATION: 031_seed_advanced_promotions.sql
-- DESCRIPTION: Seeds 'Pizzaria QA' with 5 advanced promotion types for PROJ-012.

DO $$
DECLARE
    v_partner_id uuid := 'd8acb197-872d-40b8-90f0-06594667f78e';
    v_academy_id uuid;
BEGIN
    -- 1. Get Linked Academy (Assuming first active link)
    SELECT academy_id INTO v_academy_id 
    FROM public.academy_partners 
    WHERE partner_id = v_partner_id AND status = 'ACTIVE' 
    LIMIT 1;

    -- Safety Check
    IF v_academy_id IS NULL THEN
        RAISE NOTICE 'Partner not linked to any active academy. Skipping seed.';
        RETURN;
    END IF;

    -- 2. Insert Promotions
    
    -- [A] Happy Hour 15% OFF (DISCOUNT_PERCENTAGE)
    INSERT INTO public.benefits (partner_id, academy_id, title, description, type, configuration, constraints, status)
    VALUES (
        v_partner_id, v_academy_id, 
        'Happy Hour 15% OFF', 
        'Desconto em todo cardápio durante o Happy Hour.',
        'DISCOUNT_PERCENTAGE',
        '{"value": 15, "mode": "PERCENT"}'::jsonb,
        '{"time": [{"days": [1, 2], "start": "18:00", "end": "20:00"}]}'::jsonb,
        'ACTIVE'
    );

    -- [B] R$ 10,00 OFF (DISCOUNT_FIXED)
    INSERT INTO public.benefits (partner_id, academy_id, title, description, type, configuration, constraints, status)
    VALUES (
        v_partner_id, v_academy_id, 
        'Desconto de R$ 10', 
        'Válido para pedidos acima de R$ 60.',
        'DISCOUNT_FIXED',
        '{"value": 10, "mode": "FIXED"}'::jsonb,
        '{"min_spend": 60}'::jsonb,
        'ACTIVE'
    );

    -- [C] Em Dobro (DEAL_BOGO)
    INSERT INTO public.benefits (partner_id, academy_id, title, description, type, configuration, constraints, status)
    VALUES (
        v_partner_id, v_academy_id, 
        'Pizza em Dobro', 
        'Compre 1 Pizza Grande e leve outra igual.',
        'DEAL_BOGO',
        '{"buy_qty": 1, "get_qty": 1}'::jsonb,
        '{"channel": "STORE"}'::jsonb,
        'ACTIVE'
    );

    -- [D] Entrega Grátis (FREE_SHIPPING)
    INSERT INTO public.benefits (partner_id, academy_id, title, description, type, configuration, constraints, status)
    VALUES (
        v_partner_id, v_academy_id, 
        'Entrega Grátis', 
        'Para pedidos delivery acima de R$ 40.',
        'FREE_SHIPPING',
        '{}'::jsonb,
        '{"channel": "DELIVERY", "min_spend": 40}'::jsonb,
        'ACTIVE'
    );

    -- [E] Brinde (GIFT)
    INSERT INTO public.benefits (partner_id, academy_id, title, description, type, configuration, constraints, status)
    VALUES (
        v_partner_id, v_academy_id, 
        'Guaraná Grátis', 
        'Ganhe um Guaraná 2L na compra de qualquer Pizza Gigante.',
        'GIFT',
        '{"gift_name": "Guaraná 2L"}'::jsonb,
        '{}'::jsonb,
        'ACTIVE'
    );

END $$;

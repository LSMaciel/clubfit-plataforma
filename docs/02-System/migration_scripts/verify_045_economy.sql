-- Script de Validação da STORY-14A-02
-- Simula inserção de voucher e verifica se a economia foi calculada.

BEGIN;

DO $$
DECLARE
    v_student_id UUID;
    v_partner_id UUID;
    v_benefit_id UUID;
    v_token TEXT := 'TESTE_ECONOMY_' || floor(random() * 1000)::text;
    v_economy_value DECIMAL;
    v_total_economy DECIMAL;
BEGIN
    -- 1. Setup: Pegar um aluno e um parceiro
    SELECT id INTO v_student_id FROM public.students LIMIT 1;
    SELECT id INTO v_partner_id FROM public.partners LIMIT 1;
    
    IF v_student_id IS NULL OR v_partner_id IS NULL THEN
        RAISE EXCEPTION '❌ ERRO: Necessário ter pelo menos 1 aluno e 1 parceiro no banco.';
    END IF;

    -- 1.1 Criar uma Categoria de Teste e Vincular ao Parceiro (Para garantir que o JOIN funcione)
    INSERT INTO public.categories (name, slug, average_ticket)
    VALUES ('Categoria Teste', 'cat-teste-eco', 200.00)
    ON CONFLICT (slug) DO UPDATE SET average_ticket = 200.00;
    
    UPDATE public.partners 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'cat-teste-eco')
    WHERE id = v_partner_id;

    -- 2. Garantir que temos um Benefício de Porcentagem para teste
    --    Se já tiver, usa. Se não, cria.
    INSERT INTO public.benefits (partner_id, academy_id, title, status, type, configuration, rules)
    VALUES (
        v_partner_id,
        (SELECT academy_id FROM public.academy_partners WHERE partner_id = v_partner_id LIMIT 1), -- Busca vínculo real
        'Benefício Teste Economia (20% OFF)',
        'ACTIVE',
        'DISCOUNT_PERCENTAGE',
        '{"percentage": 20}'::jsonb,
        'Teste automatizado'
    )
    RETURNING id INTO v_benefit_id;
    
    -- (Opcional) Garantir que a Categoria desse parceiro tem Ticket Médio (Mock ou Update)
    -- UPDATE public.categories SET average_ticket = 200.00 WHERE id = (SELECT category_id FROM public.partners WHERE id = v_partner_id);

    -- 3. Inserir Voucher
    INSERT INTO public.student_access_tokens (student_id, benefit_id, token, expires_at, status)
    VALUES (v_student_id, v_benefit_id, v_token, NOW() + interval '1 hour', 'PENDING');

    -- 4. Verificar Valor Calculado na Tabela de Voucher
    SELECT estimated_economy INTO v_economy_value
    FROM public.student_access_tokens
    WHERE token = v_token;

    -- 5. Verificar Analytics (Soma Total)
    SELECT estimated_economy INTO v_total_economy
    FROM public.analytics_daily_academy_metrics
    WHERE date = CURRENT_DATE 
    AND academy_id = (SELECT academy_id FROM public.students WHERE id = v_student_id);

    -- 6. Report
    RAISE NOTICE '------------------------------------------------';
    RAISE NOTICE '📝 Token Gerado: %', v_token;
    RAISE NOTICE '💰 Economia Calculada (No Token): R$ %', v_economy_value;
    RAISE NOTICE '📈 Economia Total no Dia (Analytics): R$ %', v_total_economy;
    RAISE NOTICE '------------------------------------------------';

    IF v_economy_value > 0 THEN
        RAISE NOTICE '✅ SUCESSO! O cálculo de economia ocorreu.';
    ELSE
        RAISE NOTICE '⚠️ AVISO: Economia veio zerada. Verifique se o parceiro tem categoria e se o benefício está configurado corretamente.';
    END IF;

    -- ROLLBACK; -- Descomente para não persistir o teste
END $$;

-- Exibir Resultados na Grade (Melhor para o Supabase Dashboard)
SELECT 
    '1. Last Voucher' as check_type, 
    token, 
    estimated_economy, 
    status, 
    created_at 
FROM public.student_access_tokens 
ORDER BY created_at DESC 
LIMIT 1;

SELECT 
    '2. Academy Daily' as check_type, 
    cast(vouchers_generated as text), 
    estimated_economy, 
    null as status, 
    updated_at 
FROM public.analytics_daily_academy_metrics 
WHERE date = CURRENT_DATE;

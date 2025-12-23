-- Script de Validação da STORY-14A-01
-- Este script insere um voucher fake e verifica se as tabelas de analytics foram populadas.

BEGIN;

DO $$
DECLARE
    v_student_id UUID;
    v_benefit_id UUID;
    v_token TEXT := 'TESTE_ANALYTICS_' || floor(random() * 1000)::text;
    v_count_academy INT;
    v_count_partner INT;
BEGIN
    -- 1. Pegar um aluno e benefício ativos para teste
    SELECT id INTO v_student_id FROM public.students LIMIT 1;
    SELECT id INTO v_benefit_id FROM public.benefits LIMIT 1;

    IF v_student_id IS NULL OR v_benefit_id IS NULL THEN
        RAISE NOTICE '❌ Não há alunos ou benefícios para teste. Rode o seed primeiro.';
        RETURN;
    END IF;

    -- 2. Inserir Voucher (Isso deve disparar o Trigger)
    INSERT INTO public.student_access_tokens (student_id, benefit_id, token, expires_at, status)
    VALUES (v_student_id, v_benefit_id, v_token, NOW() + interval '1 hour', 'PENDING');

    -- 3. Verificar Tabela Academy Metrics
    SELECT vouchers_generated INTO v_count_academy
    FROM public.analytics_daily_academy_metrics
    WHERE date = CURRENT_DATE 
    AND academy_id = (SELECT academy_id FROM public.students WHERE id = v_student_id);

    -- 4. Verificar Tabela Partner Performance
    SELECT vouchers_generated INTO v_count_partner
    FROM public.analytics_partner_performance
    WHERE month = DATE_TRUNC('month', CURRENT_DATE)
    AND partner_id = (SELECT partner_id FROM public.benefits WHERE id = v_benefit_id);

    -- 5. Resultados
    IF v_count_academy > 0 AND v_count_partner > 0 THEN
        RAISE NOTICE '✅ SUCESSO! Trigger funcionou.';
        RAISE NOTICE '   Academy Count: %', v_count_academy;
        RAISE NOTICE '   Partner Count: %', v_count_partner;
    ELSE
        RAISE NOTICE '❌ FALHA! Contadores não incrementados.';
    END IF;
    
    -- Cleanup (Remover o dado de teste para não sujar muito, mas as tabelas analíticas ficarão incrementadas, o que é ok para teste manual)
    -- ROLLBACK; -- Descomente para não salvar nada, mas para ver o resultado precisa do RAISE ou consultar fora.
END $$;

END;

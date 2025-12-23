-- Script de Validação da STORY-14C-01
-- Verifica se a RPC retorna os KPIs corretamente

BEGIN;

DO $$
DECLARE
    v_academy_id UUID;
    v_metrics JSON;
BEGIN
    -- 1. Pega uma academia (preferencialmente a que tem dados dos testes anteriores)
    SELECT academy_id INTO v_academy_id 
    FROM public.analytics_daily_academy_metrics 
    LIMIT 1;

    IF v_academy_id IS NULL THEN
        -- Se não tiver analytics, pega qualquer academia para testar o formato Zero
        SELECT id INTO v_academy_id FROM public.academies LIMIT 1;
    END IF;

    -- 2. Chama a RPC
    v_metrics := public.get_academy_dashboard_metrics(v_academy_id);

    -- 3. Valida e Loga
    RAISE NOTICE '------------------------------------------------';
    RAISE NOTICE '🏫 Academia ID: %', v_academy_id;
    RAISE NOTICE '📊 Métricas JSON: %', v_metrics;
    
    IF (v_metrics->'current_month'->>'economy')::DECIMAL >= 0 THEN
        RAISE NOTICE '✅ SUCESSO! JSON retornado corretamente.';
    ELSE
         RAISE EXCEPTION '❌ ERRO: JSON inválido ou nulo.';
    END IF;

    RAISE NOTICE '------------------------------------------------';

    -- ROLLBACK;
END $$;

-- Exibir na Grade
SELECT * FROM public.get_academy_dashboard_metrics(
    COALESCE(
        (SELECT academy_id FROM public.analytics_daily_academy_metrics LIMIT 1),
        (SELECT id FROM public.academies LIMIT 1)
    )
);

END;

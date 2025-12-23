-- Script de Validação da STORY-14B-01
-- Verifica se a RPC retorna os dados corretos para um aluno

BEGIN;

DO $$
DECLARE
    v_student_id UUID;
    v_total DECIMAL;
    v_count BIGINT;
BEGIN
    -- 1. Pega um aluno que sabemos que tem vouchers (do teste anterior)
    SELECT student_id INTO v_student_id 
    FROM public.student_access_tokens 
    ORDER BY created_at DESC 
    LIMIT 1;

    IF v_student_id IS NULL THEN
        RAISE EXCEPTION '❌ Nenhum aluno com vouchers encontrado. Rode o teste anterior (045) primeiro.';
    END IF;

    -- 2. Chama a RPC
    SELECT total_economy, vouchers_count INTO v_total, v_count
    FROM public.get_student_economy_summary(v_student_id);

    -- 3. Valida
    RAISE NOTICE '------------------------------------------------';
    RAISE NOTICE '👤 Aluno ID: %', v_student_id;
    RAISE NOTICE '💰 Economia Total: R$ %', v_total;
    RAISE NOTICE '🎟️ Vouchers: %', v_count;
    RAISE NOTICE '------------------------------------------------';

    IF v_total > 0 THEN
        RAISE NOTICE '✅ SUCESSO! A RPC retornou valores.';
    ELSE
        RAISE NOTICE '⚠️ AVISO: A RPC retornou zero. Verifique se o aluno realmente tem vouchers com "estimated_economy" preenchido.';
    END IF;

    -- ROLLBACK;
END $$;

-- Exibir na Grade
SELECT * FROM public.get_student_economy_summary(
    (SELECT student_id FROM public.student_access_tokens ORDER BY created_at DESC LIMIT 1)
);

END;

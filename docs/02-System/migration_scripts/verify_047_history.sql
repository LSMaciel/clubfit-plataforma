-- Script de Validação da STORY-14B-02
-- Verifica se a RPC de histórico retorna os vouchers detalhados

BEGIN;

DO $$
DECLARE
    v_student_id UUID;
    v_rows INT := 0;
BEGIN
    -- 1. Pega um aluno com vouchers
    SELECT student_id INTO v_student_id 
    FROM public.student_access_tokens 
    LIMIT 1;

    IF v_student_id IS NULL THEN
        RAISE EXCEPTION '❌ Nenhum aluno com vouchers. Rode os testes anteriores.';
    END IF;

    -- 2. Chama a RPC
    -- (Apenas para validar se não dá erro de SQL/Sintaxe)
    PERFORM * FROM public.get_student_voucher_history(v_student_id, 5, 0);

    RAISE NOTICE '✅ RPC executada com sucesso (sem erros de sintaxe).';
END $$;

-- Exibir output na grade
SELECT * FROM public.get_student_voucher_history(
    (SELECT student_id FROM public.student_access_tokens LIMIT 1),
    10, 
    0
);

END;

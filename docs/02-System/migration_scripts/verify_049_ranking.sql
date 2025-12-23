-- Script de Validação da STORY-14C-02
-- Verifica se a RPC de Ranking retorna dados agrupados

BEGIN;

DO $$
DECLARE
    v_academy_id UUID;
    v_rows INT := 0;
BEGIN
    -- 1. Pega uma academia (preferencialmente a que tem dados dos testes anteriores)
    SELECT academy_id INTO v_academy_id 
    FROM public.student_access_tokens
    JOIN public.students ON student_access_tokens.student_id = students.id
    LIMIT 1;

    IF v_academy_id IS NULL THEN
        -- Fallback
        SELECT id INTO v_academy_id FROM public.academies LIMIT 1;
    END IF;

    -- 2. Chama a RPC (Teste de Execução)
    PERFORM * FROM public.get_academy_partners_ranking(v_academy_id);

    RAISE NOTICE '✅ RPC Ranking executada com sucesso.';

END $$;

-- Exibir na Grade
SELECT * FROM public.get_academy_partners_ranking(
    COALESCE(
        (SELECT academy_id FROM public.students WHERE id IN (SELECT student_id FROM public.student_access_tokens LIMIT 1)),
        (SELECT id FROM public.academies LIMIT 1)
    )
);

END;

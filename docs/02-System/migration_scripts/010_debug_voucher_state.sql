-- MIGRATION: 010_debug_voucher_state.sql
-- DESCRIPTION: Diagnóstico profundo para entender por que a validação do voucher falha.
--              Verifica IDs da Academia (slug smart-fit-test), do Aluno teste, e dos Links.
-- AUTHOR: AI Agent
-- DATE: 2025-12-20

BEGIN;

DO $$
DECLARE
    v_slug text := 'smart-fit-test';
    v_academy_id uuid;
    v_student_count int;
    v_partners_linked int;
    v_benefits_count int;
BEGIN
    -- 1. Identificar ID da Academia pelo Slug que o usuário está acessando
    SELECT id INTO v_academy_id FROM public.academies WHERE slug = v_slug;
    
    RAISE NOTICE '🔍 DIAGNÓSTICO PARA SLUG: %', v_slug;
    RAISE NOTICE '   -> Academy ID: %', v_academy_id;

    IF v_academy_id IS NULL THEN
        RAISE NOTICE '   ❌ ACADEMIA NÃO ENCONTRADA COM ESSE SLUG!';
        RETURN;
    END IF;

    -- 2. Verificar quantos alunos estão vinculados a essa academia
    SELECT count(*) INTO v_student_count FROM public.students WHERE academy_id = v_academy_id;
    RAISE NOTICE '   -> Alunos vinculados a esta academia: %', v_student_count;

    -- 3. Verificar Vínculos de Parceiros ATIVOS
    RAISE NOTICE '   -> Parceiros ATIVOS vinculados:';
    FOR v_partners_linked IN 
        SELECT count(*) 
        FROM public.academy_partners ap 
        WHERE ap.academy_id = v_academy_id AND ap.status = 'ACTIVE'
    LOOP
        RAISE NOTICE '      Total: %', v_partners_linked;
    END LOOP;

    -- Listar detalhes dos parceiros ativos
    DECLARE
        rec record;
    BEGIN
        FOR rec IN 
            SELECT p.name, p.id, ap.status 
            FROM public.academy_partners ap
            JOIN public.partners p ON p.id = ap.partner_id
            WHERE ap.academy_id = v_academy_id
        LOOP
            RAISE NOTICE '      - Parceiro: % (ID: %, Status: %)', rec.name, rec.id, rec.status;
        END LOOP;
    END;

    -- 4. Verificar Benefícios dessa Academia
    SELECT count(*) INTO v_benefits_count FROM public.benefits WHERE academy_id = v_academy_id AND status = 'ACTIVE';
    RAISE NOTICE '   -> Benefícios Ativos desta Academia: %', v_benefits_count;
    
    -- Listar alguns benefícios para conferência
    DECLARE
        ben record;
    BEGIN
        FOR ben IN 
            SELECT b.title, b.partner_id, p.name as partner_name
            FROM public.benefits b
            JOIN public.partners p ON p.id = b.partner_id
            WHERE b.academy_id = v_academy_id
            LIMIT 5
        LOOP
            RAISE NOTICE '      - Benefit: % (Partner: %)', ben.title, ben.partner_name;
        END LOOP;
    END;

END $$;

ROLLBACK; -- Rollback para não alterar nada, apenas ler logs (ou COMMIT se quiser persistir algo, mas aqui é só leitura)

-- MIGRATION: 005_debug_partners_view.sql
-- DESCRIPTION: Script de diagnóstico para entender por que o aluno não vê parceiros.
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

DO $$
DECLARE
    v_student_record record;
    v_academy_id uuid;
    v_partners_found integer;
    v_links_found integer;
    v_active_links integer;
BEGIN
    RAISE NOTICE '--- INICIANDO DIAGNÓSTICO ---';

    -- 1. Verificar Aluno (Pega qualquer um ou o específico do QA)
    SELECT * INTO v_student_record FROM public.students WHERE cpf = '99999999999' OR full_name ILIKE '%João%' LIMIT 1;
    
    IF v_student_record IS NULL THEN
        RAISE NOTICE '❌ ERRO CRÍTICO: Nenhum aluno de teste encontrado (CPF 999... ou nome João).';
        RETURN;
    END IF;

    v_academy_id := v_student_record.academy_id;
    RAISE NOTICE '1. Identificação do Aluno:';
    RAISE NOTICE '   - Nome: %', v_student_record.full_name;
    RAISE NOTICE '   - Academy ID: %', v_academy_id;

    IF v_academy_id IS NULL THEN
        RAISE NOTICE '❌ ERRO: Este aluno não está vinculado a nenhuma academia (academy_id IS NULL).';
        RETURN;
    END IF;

    -- 2. Verificar se a Academia existe
    PERFORM 1 FROM public.academies WHERE id = v_academy_id;
    IF NOT FOUND THEN
        RAISE NOTICE '❌ ERRO: O ID da academia do aluno (%) não existe na tabela academies.', v_academy_id;
        RETURN;
    ELSE
        RAISE NOTICE '✅ Academia existe.';
    END IF;

    -- 3. Verificar Vínculos (Academy_Partners)
    SELECT COUNT(*) INTO v_links_found FROM public.academy_partners WHERE academy_id = v_academy_id;
    SELECT COUNT(*) INTO v_active_links FROM public.academy_partners WHERE academy_id = v_academy_id AND status = 'ACTIVE';
    
    RAISE NOTICE '2. Vínculos da Academia:';
    RAISE NOTICE '   - Total de Vínculos encontrados: %', v_links_found;
    RAISE NOTICE '   - Vínculos ATIVOS: %', v_active_links;

    IF v_active_links = 0 THEN
        RAISE NOTICE '⚠️ AVISO: A academia do aluno não tem parceiros ATIVOS vinculados.';
        
        -- Debug extra: Mostrar quais parceiros existem no banco
        SELECT COUNT(*) INTO v_partners_found FROM public.partners;
        RAISE NOTICE '   - Total de Parceiros Globais no sistema: %', v_partners_found;
        IF v_partners_found > 0 THEN
             RAISE NOTICE '   💡 DICA: Existem parceiros, mas não estão vinculados a esta academia. Use o painel Admin para vincular.';
        END IF;
    ELSE
        RAISE NOTICE '✅ Vínculos parecem OK.';
        
        -- 4. Verificar Benefícios dos Parceiros Ativos
        DECLARE
            v_benefit_count integer;
            rec record;
        BEGIN
            FOR rec IN 
                SELECT p.name, ap.status as link_status, b.status as benefit_status, b.title
                FROM public.academy_partners ap
                JOIN public.partners p ON p.id = ap.partner_id
                LEFT JOIN public.benefits b ON b.partner_id = p.id
                WHERE ap.academy_id = v_academy_id AND ap.status = 'ACTIVE'
            LOOP
                RAISE NOTICE '   -> Parceiro [%]: % | Benefit: % (%)', rec.link_status, rec.name, rec.title, rec.benefit_status;
            END LOOP;
        END;
    END IF;

    RAISE NOTICE '--- FIM DO DIAGNÓSTICO ---';

END $$;

COMMIT;

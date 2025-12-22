-- MIGRATION: 004_fix_student_academy.sql
-- DESCRIPTION: Forces all students to belong to the primary testing academy.
--              This resolves the "Empty View" issue if the user's student record 
--              was linked to a different (empty) academy than the one seeded.
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

DO $$
DECLARE
    v_academy_id uuid;
BEGIN
    -- 1. Obter o ID da Academia Principal (A mesma usada no Seed)
    -- Pegamos a primeira que existir.
    SELECT id INTO v_academy_id FROM public.academies LIMIT 1;

    IF v_academy_id IS NULL THEN
        RAISE EXCEPTION '❌ Nenhuma academia encontrada.';
    END IF;

    RAISE NOTICE '🔄 Atualizando todos os alunos para a Academia ID: %', v_academy_id;

    -- 2. Atualizar TODOS os alunos para pertencerem a esta academia
    -- Isso garante que o usuário logado veja os dados criados no seed.
    UPDATE public.students
    SET academy_id = v_academy_id;
    
    -- 3. Opcional: Atualizar usuários Admin também, para que o painel Admin mostre os mesmos dados
    UPDATE public.users
    SET academy_id = v_academy_id
    WHERE role IN ('ACADEMY_ADMIN', 'SUPER_ADMIN'); -- Ajuste conforme os roles do seu sistema

    RAISE NOTICE '✅ Correção aplicada! Todos os alunos agora estão vinculados à academia de teste.';

END $$;

COMMIT;

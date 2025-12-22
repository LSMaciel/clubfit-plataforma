-- VERIFICATION SCRIPT: verify_002.sql
-- DESCRIPTION: Checks if RLS policies are behaving as expected (simulated logic).
-- execute this in SQL Editor.

BEGIN;

DO $$ 
DECLARE
    -- Mock IDs (You might need to replace these with real IDs found via SELECT if on a live DB, 
    -- but here we simulate the logic flow or rely on existing data).
    v_academy_id uuid;
    v_partner_id uuid;
    v_user_id uuid;
BEGIN
    RAISE NOTICE '--- INICIANDO VERIFICAÇÃO 002 (Lógica) ---';

    -- Note: Testing RLS via "DO" block as 'postgres' superuser often bypasses RLS.
    -- Real RLS testing usually requires `SET ROLE authenticated; SET request.jwt.claim.sub = '...'`.
    -- Since we can't easily switch roles in this simple script editor without exact JWTs,
    -- We will verify the existence of the Policies.

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'benefits' 
        AND policyname = 'Users can view active benefits'
    ) THEN
        RAISE NOTICE 'OK: Policy "Users can view active benefits" criada com sucesso.';
    ELSE
        RAISE EXCEPTION 'ERRO: Policy de benefícios não encontrada.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'benefit_usages' 
        AND policyname = 'Academy can view usages'
    ) THEN
        RAISE NOTICE 'OK: Policy "Academy can view usages" criada com sucesso.';
    ELSE
        RAISE EXCEPTION 'ERRO: Policy de usages não encontrada.';
    END IF;

    RAISE NOTICE '--- VERIFICAÇÃO ESTRUTURAL CONCLUÍDA ---';
    RAISE NOTICE 'Para testar o acesso real, faça login no Frontend ou use a API impersonando um usuário.';

END $$;

ROLLBACK;

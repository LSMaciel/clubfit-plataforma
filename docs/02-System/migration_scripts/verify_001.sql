-- VERIFICATION SCRIPT: verify_001.sql
-- Run this AFTER running 001_global_partners.sql to confirm success.

BEGIN;

DO $$ 
DECLARE
    partner_count integer;
    link_count integer;
    missing_links integer;
BEGIN
    RAISE NOTICE '--- INICIANDO VERIFICAÇÃO 001 ---';

    -- Check 1: Tabela academy_partners existe?
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'academy_partners') THEN
        RAISE EXCEPTION 'ERRO: Tabela academy_partners não foi encontrada.';
    ELSE
        RAISE NOTICE 'OK: Tabela academy_partners existe.';
    END IF;

    -- Check 2: Coluna academy_id foi removida de partners?
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'partners' AND column_name = 'academy_id'
    ) THEN
        RAISE EXCEPTION 'ERRO: Coluna academy_id AINDA EXISTE na tabela partners.';
    ELSE
        RAISE NOTICE 'OK: Coluna academy_id removida de partners.';
    END IF;

    -- Check 3: Integridade dos dados (Quantidade)
    -- Nota: Como já rodamos a migration, não temos o 'before' exato aqui, 
    -- mas podemos checar se há parceiros sem nenhum link (pode ser válido, mas é um alerta).
    select count(*) into partner_count from public.partners;
    select count(distinct partner_id) into link_count from public.academy_partners;
    
    missing_links := partner_count - link_count;

    IF missing_links > 0 THEN
        RAISE NOTICE 'ALERTA: Existem % parceiros sem vínculo com nenhuma academia. (Isso é normal se você criou parceiros globais sem vínculo, mas anormal se for logo após a migração de um banco populado).', missing_links;
    ELSE
        RAISE NOTICE 'OK: Todos os % parceiros possuem pelo menos um vínculo.', partner_count;
    END IF;

    RAISE NOTICE '--- VERIFICAÇÃO CONCLUÍDA COM SUCESSO ---';
END $$;

ROLLBACK; -- Sempre rollback em script de verificação para não deixar lixo, embora aqui seja apenas leitura/notices.

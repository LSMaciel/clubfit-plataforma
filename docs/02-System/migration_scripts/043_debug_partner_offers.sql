-- SCRIPT: 043_debug_partner_offers.sql
-- OBJECTIVE: Inspect data for 'Monster Suplementos' to diagnose missing offers.

DO $$
DECLARE
    partner_var UUID;
    academy_var UUID;
BEGIN
    RAISE NOTICE '--- INICIANDO DIAGNÓSTICO ---';

    -- 1. Buscar Pareiro
    SELECT id INTO partner_var FROM public.partners WHERE name ILIKE '%Monster%' LIMIT 1;
    
    IF partner_var IS NULL THEN
        RAISE NOTICE '❌ Parceiro "Monster" NÃO ENCONTRADO no banco de dados.';
    ELSE
        RAISE NOTICE '✅ Parceiro Encontrado: ID %', partner_var;
        
        -- 2. Verificar Vínculos (Academy Partners)
        RAISE NOTICE '--- VINCULOS (ACADEMY_PARTNERS) ---';
        PERFORM * FROM public.academy_partners WHERE partner_id = partner_var;
        IF NOT FOUND THEN
             RAISE NOTICE '⚠️ Este parceiro NÃO tem vínculo com nenhuma academia (Tabela academy_partners vazia para este ID).';
        ELSE
             -- Listar status dos vínculos
             FOR academy_var IN SELECT academy_id FROM public.academy_partners WHERE partner_id = partner_var LOOP
                RAISE NOTICE '   -> Vinculado à Academia % com Status: %', 
                    academy_var, 
                    (SELECT status FROM public.academy_partners WHERE partner_id = partner_var AND academy_id = academy_var);
             END LOOP;
        END IF;

        -- 3. Verificar Benefícios (Offers)
        RAISE NOTICE '--- BENEFÍCIOS (TABLE: BENEFITS) ---';
        PERFORM * FROM public.benefits WHERE partner_id = partner_var;
        
        IF NOT FOUND THEN
            RAISE NOTICE '❌ NENHUM benefício encontrado na tabela `benefits` para este parceiro.';
        ELSE
            -- Listar benefícios encontrados
            DECLARE
                benefit_row RECORD;
            BEGIN
                FOR benefit_row IN SELECT id, title, status, validity_end FROM public.benefits WHERE partner_id = partner_var LOOP
                    RAISE NOTICE '   -> Benefício: "%" | Status: % | Validade: %', 
                        benefit_row.title, 
                        benefit_row.status, 
                        benefit_row.validity_end;
                END LOOP;
            END;
        END IF;

    END IF;

    RAISE NOTICE '--- FIM DO DIAGNÓSTICO ---';
END $$;

-- Query simples para visualização (Select puro) caso o cliente prefira ver grid de resultados
SELECT 
    p.name as parceiro,
    b.title as oferta,
    b.status,
    b.validity_end
FROM public.partners p
LEFT JOIN public.benefits b ON b.partner_id = p.id
WHERE p.name ILIKE '%Monster%';

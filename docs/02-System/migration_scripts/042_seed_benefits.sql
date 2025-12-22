-- MIGRATION: 042_seed_benefits.sql
-- DESCRIPTION: Seeds benefits for 'Monster Suplementos' if missing.

DO $$
DECLARE
    partner_var UUID;
BEGIN
    SELECT id INTO partner_var FROM public.partners WHERE name ILIKE '%Monster%' LIMIT 1;

    IF partner_var IS NOT NULL THEN
        -- Insert a standard discount benefit if none exists
        IF NOT EXISTS (SELECT 1 FROM public.benefits WHERE partner_id = partner_var) THEN
            INSERT INTO public.benefits (partner_id, title, description, rules, status, validity_end)
            VALUES (
                partner_var, 
                '15% de Desconto em Whey', 
                'Ganhe 15% OFF na compra de qualquer Whey Protein.', 
                'Válido para pagamentos no PIX ou Dinheiro. Apresente o App.', 
                'ACTIVE', 
                NOW() + INTERVAL '1 year'
            );
            RAISE NOTICE 'Benefício criado para Monster Suplementos com sucesso.';
        ELSE
             -- If exists but maybe inactive, update it
             UPDATE public.benefits SET status = 'ACTIVE', validity_end = NOW() + INTERVAL '1 year' WHERE partner_id = partner_var;
             RAISE NOTICE 'Benefícios de Monster Suplementos atualizados para ACTIVE.';
        END IF;
    ELSE
        RAISE NOTICE 'Parceiro Monster Suplementos não encontrado.';
    END IF;
END $$;

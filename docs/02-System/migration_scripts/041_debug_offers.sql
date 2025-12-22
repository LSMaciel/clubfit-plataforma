-- 1. Get Partner ID
DO $$
DECLARE
    partner_id_var UUID;
BEGIN
    SELECT id INTO partner_id_var FROM public.partners WHERE name ILIKE '%Monster%' LIMIT 1;
    
    RAISE NOTICE 'Partner found: %', partner_id_var;

    -- 2. List all offers for this partner
    PERFORM id, title, discount_amount, discount_type, status, partner_id 
    FROM public.offers 
    WHERE partner_id = partner_id_var;

END $$;

-- Simpler select to just dump
SELECT 
    p.name as partner_name,
    o.id as offer_id,
    o.title,
    o.status,
    o.discount_amount,
    o.discount_type
FROM public.offers o
JOIN public.partners p ON p.id = o.partner_id
WHERE p.name ILIKE '%Monster%';

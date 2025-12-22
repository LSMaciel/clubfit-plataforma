-- FIND TEST URL
SELECT 
    a.slug as academy_slug,
    p.id as partner_id,
    p.name as partner_name
FROM partners p
JOIN academy_partners ap ON ap.partner_id = p.id
JOIN academies a ON a.id = ap.academy_id
WHERE p.name ILIKE '%Ironberg%'
LIMIT 1;

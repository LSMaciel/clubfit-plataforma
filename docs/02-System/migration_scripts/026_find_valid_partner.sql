-- FIND ANY VALID PARTNER URL
-- Lists the first 5 active links between Academy and Partner.
-- Use one of these rows to construct your URL: /student/[academy_slug]/partner/[partner_id]

SELECT 
    a.name as academy_name,
    a.slug as academy_slug,
    p.name as partner_name,
    p.id as partner_id
FROM academy_partners ap
JOIN academies a ON a.id = ap.academy_id
JOIN partners p ON p.id = ap.partner_id
WHERE ap.status = 'ACTIVE'
ORDER BY a.created_at DESC
LIMIT 5;

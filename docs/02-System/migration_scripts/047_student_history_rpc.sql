BEGIN;

-- Função para listar histórico com dados do parceiro
CREATE OR REPLACE FUNCTION public.get_student_voucher_history(
    p_student_id UUID,
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    token_id UUID,
    token_code TEXT,
    created_at TIMESTAMPTZ,
    status public.usage_status,
    estimated_economy DECIMAL,
    benefit_title TEXT,
    partner_name TEXT,
    partner_logo TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sat.id,
        sat.token,
        sat.created_at,
        sat.status,
        COALESCE(sat.estimated_economy, 0.00),
        b.title,
        p.name,
        p.gallery_urls[1] as partner_logo -- Usando a primeira foto da galeria como logo
    FROM 
        public.student_access_tokens sat
    JOIN 
        public.benefits b ON sat.benefit_id = b.id
    JOIN 
        public.partners p ON b.partner_id = p.id
    WHERE 
        sat.student_id = p_student_id
    ORDER BY 
        sat.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

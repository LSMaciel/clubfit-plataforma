BEGIN;

-- Função para Ranking de Parceiros
CREATE OR REPLACE FUNCTION public.get_academy_partners_ranking(
    p_academy_id UUID,
    p_start_date DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE), -- Default Mês Atual
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    partner_id UUID,
    partner_name TEXT,
    partner_logo TEXT,
    category_name TEXT,
    total_vouchers BIGINT, -- Agregado de vouchers_generated (int)
    total_economy DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.gallery_urls[1], -- Logo (Primeira foto)
        c.name as category_name,
        COUNT(sat.id)::BIGINT as total_vouchers,
        COALESCE(SUM(sat.estimated_economy), 0)::DECIMAL as total_economy
    FROM 
        public.student_access_tokens sat
    JOIN 
        public.benefits b ON sat.benefit_id = b.id
    JOIN 
        public.partners p ON b.partner_id = p.id
    LEFT JOIN
        public.categories c ON p.category_id = c.id
    WHERE 
        sat.status IN ('PENDING', 'VALIDATED') -- Consideramos gerados
        AND b.id IN (
            -- Filtrar benefícios desta academia (Via parceiros vinculados)
            SELECT b2.id FROM public.benefits b2 
            WHERE b2.partner_id IN (
                SELECT ap.partner_id FROM public.academy_partners ap WHERE ap.academy_id = p_academy_id
            )
        )
        -- Filtro adicional de segurança: O aluno deve pertencer à academia (embora o benefício já filtre, é bom garantir)
        -- Mas um aluno de outra academia poderia gerar voucher se o parceiro for compartilhado? 
        -- Regra de Negócio: O Ranking é da ACADEMIA. Então só conta vouchers gerados por ALUNOS DA ACADEMIA.
        AND sat.student_id IN (SELECT id FROM public.students WHERE academy_id = p_academy_id)
        AND sat.created_at >= p_start_date
        AND sat.created_at <= (p_end_date + INTERVAL '1 day') -- Até o fim do dia
    GROUP BY 
        p.id, p.name, p.gallery_urls, c.name
    ORDER BY 
        total_vouchers DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

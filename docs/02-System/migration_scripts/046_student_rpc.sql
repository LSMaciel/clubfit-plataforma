BEGIN;

-- Função para o Widget de Economia (Performance otimizada)
CREATE OR REPLACE FUNCTION public.get_student_economy_summary(p_student_id UUID)
RETURNS TABLE (
    total_economy DECIMAL,
    vouchers_count BIGINT,
    last_voucher_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(estimated_economy), 0.00) as total_economy,
        COUNT(*) as vouchers_count,
        MAX(created_at) as last_voucher_date
    FROM 
        public.student_access_tokens
    WHERE 
        student_id = p_student_id
        AND status IN ('PENDING', 'VALIDATED'); -- Consideramos gerados ou validados
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

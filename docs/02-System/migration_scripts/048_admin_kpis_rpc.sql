BEGIN;

-- Função para KPIs do Dashboard (Mês atual vs Mês anterior)
CREATE OR REPLACE FUNCTION public.get_academy_dashboard_metrics(p_academy_id UUID)
RETURNS JSON AS $$
DECLARE
    v_current_month DATE := DATE_TRUNC('month', CURRENT_DATE);
    v_previous_month DATE := v_current_month - INTERVAL '1 month';
    
    -- Mês Atual
    v_curr_economy DECIMAL;
    v_curr_vouchers INT;
    v_curr_active_students INT;
    
    -- Mês Anterior (Para delta)
    v_prev_economy DECIMAL;
    
    -- Série temporal (Últimos 30 dias)
    v_daily_series JSON;
BEGIN
    -- 1. Totais Mês Atual
    SELECT 
        COALESCE(SUM(estimated_economy), 0),
        COALESCE(SUM(vouchers_generated), 0),
        COALESCE(SUM(active_students), 0) -- Nota: Active Students somado pode duplicar alunos únicos, mas serve como "Atividade". Se quisermos únicos, precisaríamos de outra tabela, mas para MVP "Dias de Aluno Ativo" serve.
    INTO 
        v_curr_economy, v_curr_vouchers, v_curr_active_students
    FROM public.analytics_daily_academy_metrics
    WHERE academy_id = p_academy_id AND date >= v_current_month;

    -- 2. Totais Mês Anterior
    SELECT 
        COALESCE(SUM(estimated_economy), 0)
    INTO 
        v_prev_economy
    FROM public.analytics_daily_academy_metrics
    WHERE academy_id = p_academy_id 
    AND date >= v_previous_month 
    AND date < v_current_month;

    -- 3. Série Temporal (Array de Objetos)
    SELECT json_agg(t) INTO v_daily_series
    FROM (
        SELECT date, estimated_economy
        FROM public.analytics_daily_academy_metrics
        WHERE academy_id = p_academy_id AND date >= (CURRENT_DATE - INTERVAL '30 days')
        ORDER BY date ASC
    ) t;

    -- Retorna JSON estruturado
    RETURN json_build_object(
        'current_month', json_build_object(
            'economy', v_curr_economy,
            'vouchers', v_curr_vouchers,
            'activity', v_curr_active_students
        ),
        'previous_month', json_build_object(
            'economy', v_prev_economy
        ),
        'daily_series', COALESCE(v_daily_series, '[]'::json)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

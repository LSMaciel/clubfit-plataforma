BEGIN;

-- 1. Tabela: Métricas Diárias da Academia
CREATE TABLE IF NOT EXISTS public.analytics_daily_academy_metrics (
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
    vouchers_generated INT DEFAULT 0,
    active_students INT DEFAULT 0, -- Alunos que fizeram alguma ação no dia
    estimated_economy DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (date, academy_id)
);

-- 2. Tabela: Performance de Parceiros (Mensal)
CREATE TABLE IF NOT EXISTS public.analytics_partner_performance (
    month DATE NOT NULL, -- Sempre o dia 01 do mês (ex: 2024-01-01)
    partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE, -- Para saber performance NA academia
    vouchers_generated INT DEFAULT 0,
    views INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (month, partner_id, academy_id)
);

-- 3. Função Trigger: Incrementar Contadores ao Gerar Voucher
CREATE OR REPLACE FUNCTION public.increment_analytics_vouchers()
RETURNS TRIGGER AS $$
DECLARE
    v_academy_id UUID;
    v_partner_id UUID;
    v_date DATE := CURRENT_DATE;
    v_month DATE := DATE_TRUNC('month', CURRENT_DATE);
BEGIN
    -- Buscar Academy ID do Aluno
    SELECT academy_id INTO v_academy_id FROM public.students WHERE id = NEW.student_id;
    
    -- Buscar Partner ID do Benefício
    SELECT partner_id INTO v_partner_id FROM public.benefits WHERE id = NEW.benefit_id;

    -- A. Atualizar Daily Academy Metrics (UPSERT)
    INSERT INTO public.analytics_daily_academy_metrics (date, academy_id, vouchers_generated)
    VALUES (v_date, v_academy_id, 1)
    ON CONFLICT (date, academy_id)
    DO UPDATE SET vouchers_generated = analytics_daily_academy_metrics.vouchers_generated + 1,
                  updated_at = NOW();

    -- B. Atualizar Partner Performance (UPSERT)
    INSERT INTO public.analytics_partner_performance (month, partner_id, academy_id, vouchers_generated)
    VALUES (v_month, v_partner_id, v_academy_id, 1)
    ON CONFLICT (month, partner_id, academy_id)
    DO UPDATE SET vouchers_generated = analytics_partner_performance.vouchers_generated + 1,
                  updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar Trigger
DROP TRIGGER IF EXISTS tr_increment_analytics_vouchers ON public.student_access_tokens;
CREATE TRIGGER tr_increment_analytics_vouchers
AFTER INSERT ON public.student_access_tokens
FOR EACH ROW
EXECUTE FUNCTION public.increment_analytics_vouchers();

COMMIT;

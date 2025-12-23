BEGIN;

-- 1. Garantir Tabela de Categorias (Safety Check)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Colunas Novas
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS average_ticket DECIMAL(10,2) DEFAULT 100.00;
ALTER TABLE public.student_access_tokens ADD COLUMN IF NOT EXISTS estimated_economy DECIMAL(10,2);
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- 3. Função de Cálculo
CREATE OR REPLACE FUNCTION public.fn_calculate_benefit_economy(p_benefit_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_type TEXT;
    v_config JSONB;
    v_avg_ticket DECIMAL;
    v_discount_value DECIMAL := 0;
BEGIN
    -- Buscar dados do Benefício + Ticket Médio da Categoria do Parceiro
    SELECT 
        b.type,
        b.configuration,
        COALESCE(c.average_ticket, 100.00) -- Default 100 se null
    INTO 
        v_type, 
        v_config, 
        v_avg_ticket
    FROM public.benefits b
    JOIN public.partners p ON b.partner_id = p.id
    LEFT JOIN public.categories c ON p.category_id = c.id
    WHERE b.id = p_benefit_id;

    -- Lógica de Cálculo
    IF v_type = 'DISCOUNT_FIXED' THEN
        -- Extrair valor do JSON (ex: { "value": 15 })
        v_discount_value := COALESCE((v_config->>'value')::DECIMAL, 0);
        
    ELSIF v_type = 'DISCOUNT_PERCENTAGE' THEN
        -- Extrair porcentagem (ex: { "percentage": 10 })
        -- Valor = Ticket * (Porcentagem / 100)
        v_discount_value := v_avg_ticket * (COALESCE((v_config->>'percentage')::DECIMAL, 0) / 100.0);
        
    ELSIF v_type = 'BOGO' THEN
        -- Buy One Get One: Economia é o preço de 1 item (Ticket Médio)
        v_discount_value := v_avg_ticket;
        
    ELSE
        -- Default Fallback se tipo for Standard ou desconhecido
        v_discount_value := 5.00; 
    END IF;

    RETURN ROUND(v_discount_value, 2);
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para Preencher Automaticamente (Antes de Inserir)
CREATE OR REPLACE FUNCTION public.set_token_economy()
RETURNS TRIGGER AS $$
BEGIN
    NEW.estimated_economy := public.fn_calculate_benefit_economy(NEW.benefit_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_set_token_economy ON public.student_access_tokens;
CREATE TRIGGER tr_set_token_economy
BEFORE INSERT ON public.student_access_tokens
FOR EACH ROW
EXECUTE FUNCTION public.set_token_economy();

-- 5. Atualizar Trigger de Analytics (STORY-14A-01) para somar o valor ECONOMIZADO
CREATE OR REPLACE FUNCTION public.increment_analytics_vouchers()
RETURNS TRIGGER AS $$
DECLARE
    v_academy_id UUID;
    v_partner_id UUID;
    v_date DATE := CURRENT_DATE;
    v_month DATE := DATE_TRUNC('month', CURRENT_DATE);
    v_economy DECIMAL := COALESCE(NEW.estimated_economy, 0); -- Novo campo
BEGIN
    SELECT academy_id INTO v_academy_id FROM public.students WHERE id = NEW.student_id;
    SELECT partner_id INTO v_partner_id FROM public.benefits WHERE id = NEW.benefit_id;

    -- A. Atualizar Daily Academy Metrics
    INSERT INTO public.analytics_daily_academy_metrics (date, academy_id, vouchers_generated, estimated_economy)
    VALUES (v_date, v_academy_id, 1, v_economy)
    ON CONFLICT (date, academy_id)
    DO UPDATE SET 
        vouchers_generated = analytics_daily_academy_metrics.vouchers_generated + 1,
        estimated_economy = analytics_daily_academy_metrics.estimated_economy + EXCLUDED.estimated_economy,
        updated_at = NOW();

    -- B. Atualizar Partner Performance (Mantém igual por enquanto, ou adiciona economia lá tb se quiser)
    INSERT INTO public.analytics_partner_performance (month, partner_id, academy_id, vouchers_generated)
    VALUES (v_month, v_partner_id, v_academy_id, 1)
    ON CONFLICT (month, partner_id, academy_id)
    DO UPDATE SET vouchers_generated = analytics_partner_performance.vouchers_generated + 1,
                  updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


COMMIT;

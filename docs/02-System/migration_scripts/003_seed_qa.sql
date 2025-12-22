-- MIGRATION: 003_seed_qa.sql
-- DESCRIPTION: Populates the database with test data linked to the first found academy.
--              Creates: 3 Partners, Links, Benefits, and 1 Test Student.
-- AUTHOR: AI Agent
-- DATE: 2025-12-19

BEGIN;

DO $$
DECLARE
    v_academy_id uuid;
    v_partner_a_id uuid;
    v_partner_b_id uuid;
    v_partner_c_id uuid;
    v_user_id uuid;
BEGIN
    -- 1. Identificar uma Academia existente (Pega a primeira)
    SELECT id INTO v_academy_id FROM public.academies LIMIT 1;

    IF v_academy_id IS NULL THEN
        RAISE EXCEPTION '❌ Nenhuma academia encontrada. Por favor, crie uma academia manualmente antes de rodar este script.';
    else
        RAISE NOTICE '✅ Vinculando dados à Academia ID: %', v_academy_id;
    END IF;

    -- Pega o ID do usuário atual para definir como dono (opcional, evita constraints de FK se houver)
    -- Se estiver rodando via Editor SQL do Supabase, auth.uid() pode ser nulo. Vamos usar um genérico se precisar.
    -- v_user_id := auth.uid(); 
    
    -- 2. Limpeza (Opcional - para evitar duplicatas nos testes)
    -- DELETE FROM public.partners WHERE cnpj IN ('00000000000199', '00000000000299', '00000000000399');

    -- 3. Criar 3 Parceiros Globais
    
    -- Parceiro A (Já vinculado)
    INSERT INTO public.partners (name, cnpj, description, address, city, state, zip_code)
    VALUES ('Pizzaria QA', '00000000000199', 'A melhor pizza do ambiente de teste', 'Rua dos Bugs, 100', 'São Paulo', 'SP', '01000-000')
    ON CONFLICT (cnpj) DO UPDATE SET name = EXCLUDED.name -- Upsert para evitar erro
    RETURNING id INTO v_partner_a_id;

    -- Parceiro B (Já vinculado)
    INSERT INTO public.partners (name, cnpj, description, address, city, state, zip_code)
    VALUES ('Academia Crossfit QA', '00000000000299', 'Parceiro de treino cruzado', 'Av. dos Testes, 200', 'São Paulo', 'SP', '01000-000')
    ON CONFLICT (cnpj) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_partner_b_id;

    -- Parceiro C (NÃO VINCULADO - Para testar busca e vínculo manual)
    INSERT INTO public.partners (name, cnpj, description, address, city, state, zip_code)
    VALUES ('Suplementos Externos', '00000000000399', 'Loja de fora da cidade', 'Rua Remote, 999', 'Rio de Janeiro', 'RJ', '20000-000')
    ON CONFLICT (cnpj) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_partner_c_id;


    -- 4. Criar Vínculos (Academy Partners)
    
    -- Vincula A e B como ATIVOS
    INSERT INTO public.academy_partners (academy_id, partner_id, status)
    VALUES (v_academy_id, v_partner_a_id, 'ACTIVE')
    ON CONFLICT (academy_id, partner_id) DO UPDATE SET status = 'ACTIVE';

    INSERT INTO public.academy_partners (academy_id, partner_id, status)
    VALUES (v_academy_id, v_partner_b_id, 'ACTIVE')
    ON CONFLICT (academy_id, partner_id) DO UPDATE SET status = 'ACTIVE';

    -- Garante que C não está vinculado (ou está INACTIVE) para teste de "Novo Parceiro"
    INSERT INTO public.academy_partners (academy_id, partner_id, status)
    VALUES (v_academy_id, v_partner_c_id, 'INACTIVE')
    ON CONFLICT (academy_id, partner_id) DO UPDATE SET status = 'INACTIVE';


    -- 5. Criar Benefícios para os Parceiros Ativos
    
    INSERT INTO public.benefits (academy_id, partner_id, title, rules, status, validity_end)
    VALUES 
        (v_academy_id, v_partner_a_id, '20% de Desconto na Pizza G', 'Válido seg-qui', 'ACTIVE', NOW() + interval '30 days'),
        (v_academy_id, v_partner_b_id, 'Free Pass 7 Dias', 'Para alunos novos', 'ACTIVE', NOW() + interval '60 days');


    -- 6. Criar Aluno de Teste
    -- CPF: 999.999.999-99
    INSERT INTO public.students (academy_id, full_name, cpf, status)
    VALUES (v_academy_id, 'Aluno QA Automatizado', '99999999999', 'ACTIVE')
    ON CONFLICT (cpf) DO NOTHING;

    RAISE NOTICE '✅ Seed concluído com sucesso!';

END $$;

COMMIT;

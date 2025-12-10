-- INSTRUÇÕES DE USO:
-- 1. Crie os usuários ADMIN e PARCEIRO manualmente no painel Authentication do Supabase (para definir a senha que você quiser).
--    - Sugestão Admin: admin@smartfit.com.br
--    - Sugestão Parceiro: loja@suplementos.com
-- 2. Copie os UUIDs gerados lá e substitua abaixo onde diz 'SUBSTITUA_PELO_UUID_DA_AUTH'.

BEGIN;

-- 1. Criar Academia de Teste (Smart Fit Mock)
WITH new_academy AS (
    INSERT INTO public.academies (name, slug, primary_color, logo_url)
    VALUES (
        'Smart Fit Mock', 
        'smart-fit-test', 
        '#FFD700', -- Dourado/Amarelo Smart
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Logo_Smart_Fit.svg'
    )
    RETURNING id
)

-- 2. Vincular Usuário Admin à Academia
-- (Este passo assume que você já criou o usuário no Auth e pegou o UUID)
INSERT INTO public.users (id, academy_id, name, role)
SELECT 
    'SUBSTITUA_PELO_UUID_DO_ADMIN', -- <--- COLE O UUID DO ADMIN AQUI
    id, 
    'Admin Smart Fit', 
    'ACADEMY_ADMIN'
FROM new_academy;

-- 3. Criar Parceiro (Loja de Suplementos)
-- (Este passo assume que você já criou o usuário no Auth e pegou o UUID)
WITH academy_ref AS (SELECT id FROM public.academies WHERE slug = 'smart-fit-test')
INSERT INTO public.partners (academy_id, owner_id, name, description, address)
SELECT 
    academy_ref.id,
    'SUBSTITUA_PELO_UUID_DO_PARCEIRO', -- <--- COLE O UUID DO PARCEIRO AQUI (opcional, pode deixar NULL se não for testar login de parceiro agora)
    'Monster Suplementos',
    'Desconto em Whey Protein',
    'Rua dos Marombas, 100'
FROM academy_ref;

-- 4. Criar Aluno de Teste (Para login com CPF)
-- O CPF 123.456.789-00 vai gerar um login automático
INSERT INTO public.students (academy_id, full_name, cpf, status)
SELECT 
    id, 
    'João Frango', 
    '12345678900', 
    'ACTIVE'
FROM public.academies WHERE slug = 'smart-fit-test';

COMMIT;

DO $$ 
BEGIN 
    -- 1. Criar Tabela Associativa se não existir
    CREATE TABLE IF NOT EXISTS public.academy_partners (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
        partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
        status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
        created_at timestamptz DEFAULT now(),
        UNIQUE(academy_id, partner_id)
    );

    -- 2. Migração de Dados (Dinâmica e Segura)
    -- Usamos Dynamic SQL para evitar erro de compilação caso a coluna já tenha sido removida
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'academy_id') THEN
        
        RAISE NOTICE 'Migrando dados de academy_id...';
        EXECUTE '
            INSERT INTO public.academy_partners (academy_id, partner_id, status)
            SELECT p.academy_id, p.id, ''ACTIVE''
            FROM public.partners p
            WHERE p.academy_id IS NOT NULL
            ON CONFLICT (academy_id, partner_id) DO NOTHING;
        ';
        
    ELSE
        RAISE NOTICE 'Coluna academy_id não encontrada na tabela partners. Assumindo migração já realizada.';
    END IF;

    -- 3. Atualizar Tabela Partners (Colunas Novas)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'cnpj') THEN
        ALTER TABLE public.partners ADD COLUMN cnpj text UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'search_vector') THEN
        ALTER TABLE public.partners ADD COLUMN search_vector tsvector;
    END IF;

    -- Criar Índices
    CREATE INDEX IF NOT EXISTS idx_partners_search ON public.partners USING GIN(search_vector);
    CREATE INDEX IF NOT EXISTS idx_partners_cnpj ON public.partners(cnpj);

    -- Popular vector inicial
    -- Verificar se a coluna name existe (segurança extra)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'name') THEN
         UPDATE public.partners 
         SET search_vector = to_tsvector('portuguese', name) 
         WHERE search_vector IS NULL;
    END IF;

    -- 4. Remover Acoplamento (Breaking Change)
    -- Só dropamos se a tabela nova tiver dados (segurança) OU se force dropar
    IF EXISTS (SELECT 1 FROM public.academy_partners) THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'academy_id') THEN
             RAISE NOTICE 'Removendo coluna legada academy_id...';
             ALTER TABLE public.partners DROP COLUMN academy_id CASCADE;
        END IF;
    ELSE
        RAISE NOTICE 'ALERTA: Tabela academy_partners está vazia. Não removemos academy_id por segurança.';
    END IF;

END $$;

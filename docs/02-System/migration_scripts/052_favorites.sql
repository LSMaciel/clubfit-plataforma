BEGIN;

-- 1. Tabela de Favoritos
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_type text NOT NULL CHECK (item_type IN ('PARTNER', 'OFFER')),
    item_id uuid NOT NULL, -- Generic ID, application enforced relationship
    created_at timestamptz DEFAULT now(),
    
    -- Constraint para evitar duplicação (Um usuário só favoritem um item uma vez)
    UNIQUE(user_id, item_type, item_id)
);

-- 2. Index para performance
CREATE INDEX idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_item ON public.user_favorites(item_id);

-- 3. RLS (Row Level Security)
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Usuário só vê e edita seus próprios favoritos
CREATE POLICY "Users can manage own favorites" 
ON public.user_favorites
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

COMMIT;

-- 053_Fix_Favorites_RLS.sql
-- Run this in Supabase SQL Editor to fix permissions

BEGIN;

-- 1. Ensure Table Exists (It should, but safe check)
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_type text NOT NULL CHECK (item_type IN ('PARTNER', 'OFFER')),
    item_id uuid NOT NULL, 
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, item_type, item_id)
);

-- 2. Ensure RLS is enabled
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policy (to avoid duplication error or conflicts)
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.user_favorites;

-- 4. Re-create Policy (Select + Insert + Update + Delete)
CREATE POLICY "Users can manage own favorites" 
ON public.user_favorites
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Grant Permissions
GRANT ALL ON public.user_favorites TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_favorites_id_seq TO authenticated; 

COMMIT;

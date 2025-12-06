# Setup de Storage (Buckets)

Este script SQL cria os buckets necessários para o funcionamento do sistema e configura as políticas de segurança (RLS).
Execute este script no **SQL Editor** do Supabase.

```sql
BEGIN;

-- 1. Criar o Bucket 'academy-logos' (se não existir)
insert into storage.buckets (id, name, public)
values ('academy-logos', 'academy-logos', true)
on conflict (id) do nothing;

-- 2. Configurar Políticas de Segurança (RLS) para o Bucket 'academy-logos'

-- 2.1. Leitura Pública (Qualquer pessoa pode ver a logo)
create policy "Public Access to Academy Logos"
on storage.objects for select
using ( bucket_id = 'academy-logos' );

-- 2.2. Upload Autenticado (Apenas usuários logados podem fazer upload)
-- Nota: O backend usa a Service Role para criar a academia, o que bypassa o RLS,
-- mas essa política é útil se decidirmos fazer upload direto do frontend no futuro.
create policy "Authenticated Users can Upload Logos"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'academy-logos' );

-- 2.3. Update Autenticado (Para alterar a logo)
create policy "Authenticated Users can Update Logos"
on storage.objects for update
to authenticated
using ( bucket_id = 'academy-logos' );

-- 2.4. Delete Autenticado
create policy "Authenticated Users can Delete Logos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'academy-logos' );

COMMIT;
```

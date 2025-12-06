# Setup Inicial do Banco de Dados (Supabase)

Este documento contém os scripts SQL oficiais para configurar o ambiente do ClubFit. Use o **SQL Editor** do Supabase para executar estes comandos.

---

## ⚠️ 0. Script de Limpeza (Wipe)
**Objetivo:** Remover todas as tabelas e tipos existentes no schema `public` para iniciar do zero (incluindo tabelas legadas e novas).
**Atenção:** ISSO APAGARÁ TODOS OS DADOS. Use com cuidado.

```sql
BEGIN;

-- 1. Remover Tabelas Legadas (Projeto Anterior)
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- 2. Remover Tabelas do ClubFit (Caso precise resetar o projeto atual)
DROP TABLE IF EXISTS public.benefit_usages CASCADE;
DROP TABLE IF EXISTS public.student_access_tokens CASCADE;
DROP TABLE IF EXISTS public.benefits CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.academies CASCADE;

-- 3. Remover Tipos Customizados (ENUMs)
DROP TYPE IF EXISTS public.usage_status;
DROP TYPE IF EXISTS public.benefit_status;
DROP TYPE IF EXISTS public.user_role;

-- 4. Remover Extensões (Opcional, geralmente mantemos)
-- DROP EXTENSION IF EXISTS "moddatetime";
-- DROP EXTENSION IF EXISTS "uuid-ossp";

COMMIT;
```

---

## 🚀 1. Script de Criação (Schema v1 - MVP)
**Objetivo:** Criar a estrutura física do banco de dados conforme **STORY-001**.
**Status:** Aprovado em EPIC-01.

```sql
BEGIN;

-- 1. Configurações Iniciais e Extensões
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime"; -- Para atualizar 'updated_at' automaticamente

-- 2. Definição de Tipos (ENUMs)
create type user_role as enum ('SUPER_ADMIN', 'ACADEMY_ADMIN', 'PARTNER', 'STUDENT');
create type benefit_status as enum ('ACTIVE', 'INACTIVE', 'DRAFT');
create type usage_status as enum ('PENDING', 'VALIDATED', 'EXPIRED');

-- 3. Tabela: Academias (Tenant Root)
create table public.academies (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique, -- URL friendly, ex: 'ironberg'
    logo_url text,
    primary_color text default '#000000',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Tabela: Usuários do Sistema (Perfil vinculado ao Auth do Supabase)
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade, -- Link 1:1 com Auth
    academy_id uuid references public.academies(id) on delete cascade, -- Nullable (Super Admin não tem)
    name text not null,
    role user_role not null default 'ACADEMY_ADMIN',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 5. Tabela: Parceiros (Lojas)
create table public.partners (
    id uuid primary key default uuid_generate_v4(),
    academy_id uuid not null references public.academies(id) on delete cascade,
    owner_id uuid references public.users(id), -- Dono da loja (usuário)
    name text not null,
    description text,
    address text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 6. Tabela: Alunos (Usuário Final)
create table public.students (
    id uuid primary key default uuid_generate_v4(),
    academy_id uuid not null references public.academies(id) on delete cascade,
    user_id uuid references auth.users(id), -- Nullable inicialmente
    full_name text not null,
    cpf text not null, -- CPF único no ecossistema
    email text,
    phone text,
    status text default 'ACTIVE',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint unique_cpf unique (cpf) -- Regra R02 (Unicidade Global)
);

-- 7. Tabela: Benefícios (Promoções)
create table public.benefits (
    id uuid primary key default uuid_generate_v4(),
    partner_id uuid not null references public.partners(id) on delete cascade,
    academy_id uuid not null references public.academies(id) on delete cascade, -- Desnormalização para facilitar RLS
    title text not null,
    description text,
    rules text, -- Regras de uso em texto
    validity_start timestamptz,
    validity_end timestamptz,
    status benefit_status default 'ACTIVE',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 8. Tabela: Tokens de Acesso (QR Codes)
create table public.student_access_tokens (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid not null references public.students(id) on delete cascade,
    benefit_id uuid not null references public.benefits(id) on delete cascade,
    token text not null unique, -- O código string do QR
    expires_at timestamptz not null,
    status usage_status default 'PENDING',
    created_at timestamptz default now()
);

-- 9. Tabela: Uso de Benefícios (Histórico Transacional)
create table public.benefit_usages (
    id uuid primary key default uuid_generate_v4(),
    academy_id uuid not null references public.academies(id),
    partner_id uuid not null references public.partners(id),
    student_id uuid not null references public.students(id),
    benefit_id uuid not null references public.benefits(id),
    validated_at timestamptz default now(),
    validated_by uuid references public.users(id) -- Quem validou
);

-- 10. Triggers para updated_at (Automação)
create trigger handle_updated_at_academies before update on public.academies for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_users before update on public.users for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_partners before update on public.partners for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_students before update on public.students for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at_benefits before update on public.benefits for each row execute procedure moddatetime (updated_at);

COMMIT;

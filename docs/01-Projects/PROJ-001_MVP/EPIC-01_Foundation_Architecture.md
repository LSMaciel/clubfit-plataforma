# EPIC-01: Fundação e Arquitetura

**Projeto Pai:** PROJ-001 (MVP)
**Descrição:** Estabelecer a infraestrutura base, modelagem de dados segura e os fluxos de autenticação. Este épico é o alicerce do sistema.

---

## 📜 STORY-001: Definição do Schema do Banco de Dados
**Descrição:** Criação física das tabelas no PostgreSQL (Supabase) sem aplicação de regras de segurança ainda. Apenas estrutura.

**Cenários:**
1.  Desenvolvedor roda script SQL inicial e tabelas aparecem no dashboard do Supabase.
2.  Verificação de relacionamentos (Foreign Keys) impedindo deleção de registros pais (ex: deletar academia com alunos).

**Regras de Negócio:**
1.  Todos os IDs devem ser UUIDv4.
2.  Campos de data devem ter `created_at` e `updated_at` automáticos.

**Critérios de Aceite:**
- [ ] Tabelas criadas: `academies`, `users` (profiles), `partners`, `benefits`, `students`, `benefit_usages`, `student_access_tokens`.
- [ ] Relacionamentos (FKs) configurados corretamente.

**Detalhamento Técnico:**
-   Arquivo `schema.sql`.
-   Usar tipos ENUM para `role` ('SUPER_ADMIN', 'ACADEMY_ADMIN', 'PARTNER', 'STUDENT').

**Detalhamento de UX:** N/A (Backend only).

**Detalhamento do Banco de Dados:**
-   `academies`: id, name, slug, logo_url, primary_color.
-   `users`: id (FK auth.users), academy_id, role.

**Riscos:**
-   Modelagem incorreta exigir refatoração pesada depois.
**Mitigação:** Revisão dupla do diagrama ER antes do script.

**Cenários de Testes:**
-   Tentar criar tabela sem FK obrigatória (deve falhar).

---

## 📜 STORY-002: Implementação de RLS (Row Level Security)
**Descrição:** Configuração da camada de segurança que impede vazamento de dados entre academias (Multi-tenancy).

**Cenários:**
1.  Usuário da Academia A faz `SELECT * FROM students`. Retorno: Apenas alunos da Academia A.
2.  Super Admin faz `SELECT * FROM students`. Retorno: Todos os alunos.

**Regras de Negócio:**
1.  **R01 - Isolamento Multi-tenant:** Dados segregados por `academy_id`.
2.  Super Admin ignora regras de segregação.

**Critérios de Aceite:**
- [ ] Policies criadas para SELECT, INSERT, UPDATE, DELETE em todas as tabelas.

**Detalhamento Técnico:**
-   Criar função PostgreSQL `get_user_role()` e `get_user_academy_id()` para auxiliar nas policies.
-   `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.

**Detalhamento de UX:** N/A.

**Detalhamento do Banco de Dados:**
-   Policy ex: `academy_id = (select academy_id from public.users where id = auth.uid())`.

**Riscos:**
-   Performance degradada em queries complexas.
**Mitigação:** Índices adequados em `academy_id`.

**Cenários de Testes:**
-   Teste de intrusão: Tentar ler dados de ID conhecido de outra academia via API.

---

## 📜 STORY-003: Login Corporativo (Admin/Parceiro)
**Descrição:** Interface e lógica de login para gestores (não alunos).

**Cenários:**
1.  Admin acessa `/admin/login`, insere credenciais corretas -> Redirect para Dashboard.
2.  Aluno tenta logar nesta tela -> Erro "Acesso não autorizado para alunos".

**Regras de Negócio:**
1.  Apenas roles SUPER_ADMIN, ACADEMY_ADMIN e PARTNER podem logar aqui.

**Critérios de Aceite:**
- [ ] Login com Email/Senha funcional via Supabase Auth.
- [ ] Bloqueio de usuários inativos.

**Detalhamento Técnico:**
-   Next.js Auth Helpers.
-   Middleware para proteção de rotas `/admin/*`.

**Detalhamento de UX:**
-   Tela centralizada, fundo cinza claro.
-   Card branco, Logo "ClubFit".
-   Inputs: Email, Senha. Botão "Entrar".

**Detalhamento do Banco de Dados:**
-   Leitura na tabela `auth.users` e `public.users`.

**Riscos:**
-   Phishing ou Brute-force.
**Mitigação:** Rate limiting do Supabase (nativo).

**Cenários de Testes:**
-   Logar com senha errada 5 vezes.
-   Logar com usuário "Student" (deve falhar).
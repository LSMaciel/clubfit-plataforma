# EPIC-01: Fluxo de Criação de Academia Completo

## 1. Descrição
Atualmente, criar uma academia apenas insere o registro da empresa no banco de dados, sem criar o usuário responsável (dono). Isso deixa a academia "órfã" e impede o login. Este épico visa unificar a criação da Academia com a criação do seu primeiro Administrador (`ACADEMY_ADMIN`).

## 2. Histórias de Usuário

### STORY-006: Inserção de Dados de Acesso no Formulário de Academia
**Como:** Super Admin
**Quero:** Informar nome, email e senha do dono ao criar uma academia
**Para:** Que o cliente já saia com acesso garantido ao sistema.

**Cenários de Teste:**
1.  **Sucesso:** Preencher todos os campos (Academia + Dono) -> Redireciona para lista -> Novo usuário existe no Auth e na tabela `users` com role `ACADEMY_ADMIN`.
2.  **Validação:** Tentar criar com email já existente -> Exibe erro "Email já cadastrado".
3.  **Rollback:** Se a criação da academia falhar, o usuário não deve ser criado (e vice-versa).

**Regras de Negócio:**
*   A senha deve ter no mínimo 6 caracteres.
*   O usuário criado deve ter `role = 'ACADEMY_ADMIN'`.
*   O usuário criado deve ter `academy_id` vinculado à nova academia.

**Detalhamento Técnico:**
*   Atualizar `app/admin/academies/new/page.tsx` para incluir campos de input.
*   Atualizar `app/admin/academies/actions.ts`:
    1.  `supabaseAdmin.auth.admin.createUser()`
    2.  `insert into academies`
    3.  `insert into users` (com o ID da academia recém criada).
    *   *Nota:* Usar transação ou lógica de compensação manual (se falhar o passo 2, deletar o user do passo 1).

**Detalhamento de UX:**
*   Adicionar seção "Acesso do Administrador" no formulário existente.

**Riscos:**
*   Falha parcial (criar user sem academia). Mitigação: Tratamento de erro robusto no Try/Catch do Server Action.

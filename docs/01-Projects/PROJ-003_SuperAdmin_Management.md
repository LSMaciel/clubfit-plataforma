# PROJ-003: Academia do SuperAdmin (Context Switcher)

## 1. Descrição
O objetivo deste projeto é permitir que o Super Admin (SaaS Owner) opere de forma dual: como gestor global da plataforma e como operador de academias específicas. Atualmente, o Super Admin não consegue cadastrar academias com login inicial (falha de fluxo) nem cadastrar parceiros para si mesmo (falha de "vínculo obrigatório").

Implementaremos um "Seletor de Contexto" (Context Switcher) e corrigiremos o fluxo de cadastro de Academias para que o sistema seja funcional tanto para o suporte global quanto para a operação própria do dono.

## 2. Regras de Negócio
1.  **Dualidade de Papel:** O Super Admin pode existir "sem vínculo" (Global) ou "vinculado temporariamente" (Impersonation/Local Owner).
2.  **Fluxo de Criação de Academia:** Ao criar uma academia, é obrigatório criar simultaneamente o usuário administrador inicial dela.
3.  **Sessão Híbrida:** O cookie de sessão do Super Admin deve ser capaz de armazenar o `academy_id` que ele está "visitando", sem alterar permanentemente seu registro no banco de dados (ideal) ou alterando de forma explicita e reversível.
    *   *Decisão de MVP:* Faremos a troca via Server Action que atualiza um Cookie `admin-context-academy-id`. O `createClient` do Supabase lerá esse cookie para montar a sessão.

## 3. Critérios de Aceite
1.  Super Admin consegue criar uma Academia e definir email/senha do dono imediatamente.
2.  Super Admin vê um dropdown no topo do Dashboard com: "Visão Global" + Lista de Academias.
3.  Ao selecionar uma Academia, o Dashboard recarrega exibindo os dados APENAS daquela academia (Parceiros, Alunos).
4.  Neste modo "Local", o Super Admin consegue cadastrar Parceiros normalmente (o erro "Usuário não vinculado" desaparece).

## 4. Detalhamento Técnico
*   **Context Switcher:** Componente Client-Side no Header que chama uma Server Action `switchAdminContext(academyId)`.
*   **Persistência de Contexto:** Cookie `clubfit-admin-context`.
*   **Middleware/Server Utils:** Atualizar `createClient` para priorizar o `academy_id` do cookie (se existir e user for Super Admin) sobre o do banco (se fosse null).
    *   *Nota:* Como as Actions atuais leem `adminProfile.academy_id` do banco, talvez seja mais seguro para o MVP realmente atualizar o campo `academy_id` no banco de dados do usuário Super Admin, ou alterar a query `getAdminProfile` para ler do cookie.
    *   *Decisão Segura e Simples:* Super Admin "Global" tem `academy_id = null`. Quando ele "entra" numa academia, setamos um cookie. Nas actions `createPartner`, lemos o cookie. Se o user é SUPER_ADMIN, usamos o ID do cookie.

## 5. Detalhamento de UX
*   **Header:** Adicionar seletor "Você está vendo: [Visão Global | v]".
*   **Formulário de Academia:** Adicionar seção "Acesso do Administrador" (Nome, Email, Senha).

## 6. Detalhamento do Banco de Dados
*   Nenhuma tabela nova.
*   Apenas inserção de dados na tabela `auth.users` e `public.users` durante a criação da academia.

## 7. Riscos e Mitigação
*   **Risco:** Super Admin esquecer que está "logado" numa academia e achar que sumiram dados de outras.
    *   *Mitigação:* O Header deve ter uma cor diferente ou um banner evidente "MODO DE VISÃO: [Nome da Academia]".
*   **Risco:** Quebrar a segurança RLS se a lógica do cookie falhar.
    *   *Mitigação:* O RLS continua olhando para `users.academy_id`. Para o Super Admin funcionar via Cookie sem alterar o banco, precisaremos garantir que as queries passem o ID explicitamente ou que o Super Admin tenha bypass de RLS (o que ele já tem pela role). O filtro nas queries (ex: `where academy_id = X`) deverá vir da variável de contexto.

## 8. Épicos
1.  **EPIC-01:** Fluxo de Criação de Academia Completo.
2.  **EPIC-02:** Context Switcher (Navegação entre Academias).

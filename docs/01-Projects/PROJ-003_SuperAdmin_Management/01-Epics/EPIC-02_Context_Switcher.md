# EPIC-02: Seletor de Contexto (Context Switcher)

## 1. Descrição
Permitir que o Super Admin navegue entre a visão global da plataforma e a visão específica de uma academia, permitindo que ele opere (crie parceiros, veja relatórios) como se fosse o dono daquela unidade.

## 2. Histórias de Usuário

### STORY-007: Componente de Troca de Contexto
**Como:** Super Admin
**Quero:** Um dropdown no topo do dashboard para selecionar uma academia
**Para:** Alternar minha visão e gerenciar dados específicos daquela unidade.

**Cenários de Teste:**
1.  **Troca para Academia:** Selecionar "Ironberg" -> Recarrega página -> Título muda para "Ironberg (Modo Admin)" -> Lista de parceiros mostra apenas parceiros da Ironberg.
2.  **Troca para Global:** Selecionar "Visão Global" -> Recarrega -> Mostra dados gerais (ou lista de todas as academias).
3.  **Persistência:** Dar F5 na página -> Mantém a academia selecionada.

**Regras de Negócio:**
*   Apenas Super Admins podem ver este componente.
*   A seleção deve ser persistida (Cookie ou Banco). Para MVP, Cookie `admin-context`.
*   As Server Actions sensíveis (`createPartner`) devem checar esse contexto.

**Detalhamento Técnico:**
*   Criar Componente Client Side `AdminContextSwitcher`.
*   Criar Server Action `switchContext(academyId: string | null)`.
    *   Setar Cookie: `cookies().set('admin-context-academy-id', id)`.
*   Atualizar `utils/supabase/server.ts` ou Middlewares para considerar esse cookie?
    *   *Estratégia Simplificada:* As páginas (`page.tsx`) e Actions (`actions.ts`) lerão o cookie explicitamente quando o usuário for Super Admin.
    *   Ex: `const targetAcademyId = isSuperAdmin ? cookieStore.get('context') : user.academy_id`

**Detalhamento de UX:**
*   Dropdown no Header (NavBar), preferencialmente com cor de destaque (amarelo/laranja) para indicar "Modo de Interpretação".

**Riscos:**
*   Confusão do usuário. (Visual deve ser claro).
*   Segurança: Garantir que apenas Super Admin pode setar esse cookie (validar na Server Action de switch).

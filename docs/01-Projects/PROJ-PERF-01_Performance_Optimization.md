# PROJ-PERF-01: Otimização de Performance e Carregamento

**Status:** Planejamento
**Prioridade:** Crítica
**Motivação:** O tempo de carregamento de páginas administrativas (ex: `admin/partners`) está excedendo 11 segundos, causando péssima experiência de uso.

## 1. Descrição e Objetivos
Otimizar o tempo de resposta (TTFB) e a percepção de carregamento (LCP) das principais páginas do painel administrativo e do portal do aluno.

*   **Objetivo:** Reduzir o tempo de carregamento da página de Parceiros de ~11s para < 1.5s.
*   **Valor:** Fluidez na navegação e profissionalismo da ferramenta.

## 2. Diagnóstico Inicial
A análise do código `app/admin/(authenticated)/partners/page.tsx` revela:
1.  **Waterfall de Auth:** `await getCachedAdminProfile()` bloqueia o início da renderização.
2.  **Query Complexa:** O join de `academy_partners` com `partners` pode estar sofrendo com RLS ineficiente.
3.  **Falta de Streaming:** A página inteira espera o servidor antes de mostrar qualquer byte.

## 3. Estratégia de Solução (Épicos)

### EPIC-PERF-00: Auditoria Sistêmica Global
*   **Ação:** Analisar impacto do `middleware.ts` (latência por request).
*   **Ação:** Verificar tamanho dos bundles (Client Side) em `layout.tsx` e dependências globais.
*   **Ação:** Mapear waterfalls em Layouts aninhados (`(authenticated)/layout.tsx`).

### EPIC-PERF-01: Diagnóstico e Profiling
*   Implementar logs de tempo (`console.time`) no servidor para identificar se a demora é no Auth ou no Banco.
*   Analisar custos das queries no Supabase Studio (`explain analyze`).

### EPIC-PERF-02: UI Otimista (Suspense & Streaming)
*   **Ação:** Envolver a lista de parceiros em um `<Suspense fallback={<PartnersListSkeleton />}>`.
*   **Resultado:** O shell da página (Menu, Título) carrega instantaneamente, e a lista "spinna" localmente.
*   **Benefício:** O usuário vê resposta imediata (0.2s) em vez de tela branca (11s).

### EPIC-PERF-02: UI Otimista em Login (Portal do Aluno)
*   **Problema:** A tela de login `/academia` fica branca enquanto valida a sessão do usuário.
*   **Ação:** Mover a verificação de sessão para dentro de um componente assíncrono envelopado em Suspense.
*   **Resultado:** A marca e o formulário carregam instantaneamente. O redirecionamento (se logado) acontece em segundo plano.

### EPIC-PERF-03: Otimização de Queries (Backend)
*   Revisar índices das tabelas `academy_partners` e `partners`.
*   Cachear o `AdminProfile` com mais agressividade (se possível) ou paralelizar a busca.

## 4. Critérios de Aceite
- [ ] Página `admin/partners` carregar o shell em < 500ms.
- [ ] Conteúdo da tabela aparecer em < 2s (ou mostrar Skeleton).
- [ ] TTFB (Time to First Byte) no Network Tab menor que 600ms.

## 5. Riscos e Mitigações
*   **Risco:** Cache stale (mostrar dados velhos).
    *   **Mitigação:** Usar revalidateTag inteligente nas Server Actions.
*   **Risco:** Flash of Unstyled Content (FOUC).
    *   **Mitigação:** Usar Loading.tsx nativo do Next.js.

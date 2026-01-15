# STORY-PERF-00-01: Auditoria de Gargalos Globais

**Vinculado ao Projeto:** PROJ-PERF-01

## 1. Descrição e Objetivos
*   **Ator:** Arquiteto de Sistemas.
*   **Objetivo:** Identificar e documentar componentes estruturais que afetam a performance de **todas** as páginas do sistema.
*   **Valor:** Resolver um gargalo aqui melhora o sistema inteiro de uma vez.

## 2. Pontos de Análise (Checklist)

### A. Middleware (Auth Overhead)
*   **Análise:** O arquivo `utils/supabase/middleware.ts` executa `await supabase.auth.getUser()` a cada requisição?
*   **Impacto:** Se sim, adiciona ~300ms de latência em CADA clique, mesmo navegando entre páginas públicas.
*   **Solução Potencial:** Configurar `matcher` no middleware para rodar apenas em rotas protegidas (`/admin/*`, `/student/*`) e ignorar estáticos (`/_next/*`, `/images/*`).

### B. Fontes e Scripts Globais (`app/layout.tsx`)
*   **Análise:** Estamos carregando scripts pesados (Google Maps, Analytics) no layout raiz?
*   **Solução:** Mover para componentes específicos ou usar `next/script` com estratégia `lazyOnload`.

### C. Bundle Size (Cliente)
*   **Ferramenta:** Usar `@next/bundle-analyzer`.
*   **Alvo:** Identificar se bibliotecas pesadas (ex: `recharts`, `framer-motion`, `lottie`) estão indo para o bundle inicial de todas as páginas.

### D. Banco de Dados (RLS Global)
*   **Análise:** As Policies RLS da tabela `users` ou `partners` usam joins complexos?
*   **Impacto:** Toda query simples vira uma query complexa se a policy for ruim.

## 3. Entregável
*   Relatório técnico com a lista de "Ofensores Globais" e plano de correção para cada um.

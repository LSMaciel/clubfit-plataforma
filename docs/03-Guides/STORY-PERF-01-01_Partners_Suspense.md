# STORY-PERF-01-01: UI Otimista em Parceiros (Suspense)

**Vinculado ao Projeto:** PROJ-PERF-01

## 1. Descrição e Objetivos
*   **Ator:** Administrador da Academia.
*   **Objetivo:** Visualizar a estrutura da página (título, menu, filtros) imediatamente, mesmo que a lista de dados demore para carregar.
*   **Valor:** Eliminar a sensação de "site travado" e reduzir o risco de bounce.

## 2. Regras de Negócio & Critérios de Aceite
1.  [ ] A navegação para `/admin/partners` deve renderizar o Header e Títlo (< 500ms).
2.  [ ] Enquanto os dados carregam, deve exibir um Skeleton (lista cinza pulsante) na área da tabela.
3.  [ ] O Skeleton deve ter a mesma estrutura de colunas da tabela real (Empresa, Localização, Status).

## 3. Detalhamento Técnico
*   **Arquivos Afetados:**
    *   `[MOD] app/admin/(authenticated)/partners/page.tsx` (Mover lógica de fetch para sub-componente).
    *   `[NEW] components/admin/partners/partners-list.tsx` (Componente Async que faz o fetch).
    *   `[NEW] components/admin/partners/partners-list-skeleton.tsx` (Loading State).
*   **Arquitetura:**
    *   `page.tsx`: Renderiza `PageShell` e `<Suspense fallback={<Skeleton />}> <PartnersList /> </Suspense>`.
    *   `partners-list.tsx`: Faz o `await supabase...` e renderiza a tabela.

## 4. Detalhamento de UX/UI
*   **Skeleton:** Usar `compoments/ui/skeleton` para simular 5 linhas de parceiros.
*   **Transição:** Quando os dados chegarem, trocar o Skeleton pela tabela suavemente (React faz isso nativo).

## 5. Riscos e Mitigações
*   **Risco:** O fetch ainda demorar 11s no servidor.
    *   **Mitigação:** Isso resolve a *percepção*, mas o dado ainda demora. O backend será tratado na STORY-02.

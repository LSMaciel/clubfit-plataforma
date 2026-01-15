# STORY-PERF-01: Implementação de Loading States (Skeletons)

**Status:** Rascunho
**Data:** 13/01/2026
**Responsável:** AI Agent

---

## 1. Contexto e Objetivo
Atualmente, a aplicação não fornece feedback visual imediato durante a navegação entre rotas (`/[slug]` e `/[slug]/benefits`), causando a impressão de lentidão ou travamento.

**Objetivo:** Implementar arquivos `loading.tsx` do Next.js 14 (App Router) para exibir "esqueletos" de carregamento (Skeletons) instantâneos enquanto os dados são buscados no servidor.

---

## 2. Escopo Técnico

### 2.1. Novos Componentes
*   Criar o componente base `Skeleton` em `components/ui/skeleton.tsx` (padrão shadcn/ui).

### 2.2. Login da Academia (`app/[slug]/loading.tsx`)
*   Deve imitar o layout da página de login (`app/[slug]/page.tsx`).
*   **Elementos:**
    *   Círculo (Logo)
    *   Bloco de Título
    *   Input de CPF (retângulo)
    *   Input de Senha (retângulo)
    *   Botão Grande

### 2.3. Lista de Benefícios (`app/[slug]/benefits/loading.tsx`)
*   Deve imitar o layout da lista de benefícios (`app/[slug]/benefits/page.tsx`).
*   **Elementos:**
    *   Header (Título e Subtítulo)
    *   Grid de Cards (3 a 6 cards repetidos)
    *   Cada Card Skeleton deve ter: Espaço da imagem, Título, Texto e Botão/Footer.

---

## 3. Critérios de Aceite
1.  Ao acessar `/[slug]`, deve aparecer o skeleton do login imediatamente antes do conteúdo real.
2.  Ao navegar para `/[slug]/benefits`, deve aparecer o grid de skeletons imediatamente.
3.  O layout do Skeleton não deve causar CLS (Cumulative Layout Shift) significativo - ou seja, deve ter tamanho similar ao conteúdo real.

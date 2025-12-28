# PROJ-015: Tech Debt Cleanup (TypeScript & Build)

## 1. Visão Geral
*   **Nome:** Correção de Dívida Técnica e Estabilidade de Build
*   **Status:** Planejamento
*   **Owner:** Tech Lead / IA

### Descrição
Este projeto visa eliminar a dívida técnica acumulada relacionada a erros de TypeScript e avisos de build no repositório `clubfit-plataforma`. O objetivo principal é garantir um pipeline de deploy robusto (Vercel) e uma base de código limpa, permitindo que a configuração `ignoreBuildErrors` seja removida.

### Regras de Negócio
*   **Zero Build Errors:** O comando `npm run build` deve executar com sucesso sem flags de supressão de erros.
*   **Strict Type Safety:** O código deve respeitar a tipagem estrita sempre que possível, recorrendo a `any` apenas em **último caso** para desbloqueio crítico (nuclear option).
*   **Integridade do Deploy:** Nenhuma mudança deve quebrar funcionalidades existentes em produção.

### Critérios de Aceite
1.  O comando `npx tsc --noEmit` deve retornar "Found 0 errors".
2.  A configuração `ignoreBuildErrors: true` deve ser removida do `next.config.mjs`.
3.  O deploy na Vercel deve ocorrer com sucesso.
4.  Todas as funcionalidades afetadas (Lista de Benefícios, Modal Magic Link, Busca de Parceiros, Wizard de Promoção) devem continuar funciando.

## 2. Detalhamento Técnico
*   **Frontend:** Next.js 16 (App Router), TypeScript 5.
*   **Principais Arquivos Afetados:**
    *   `app/admin/benefits/page.tsx`
    *   `components/admin/promotions/step-configuration.tsx`
    *   `components/admin/super/magic-link-modal.tsx`
    *   `components/admin/partners/partner-search.tsx`

## 3. Detalhamento de UX
*   **Impacto:** Invisível para o usuário final (melhoria interna).
*   **Benefício:** Maior estabilidade e menor chance de bugs silenciosos em produção.

## 4. Detalhamento do Banco de Dados
*   *N/A - Este projeto é puramente de frontend/código.*

## 5. Riscos e Mitigação
*   **Risco:** Quebrar funcionalidades ao alterar tipos (ex: formulários pararem de validar).
    *   *Mitigação:* Teste manual de cada componente alterado.
*   **Risco:** "Nuclear Option" (`as any`) mascarar bugs reais.
    *   *Mitigação:* Usar apenas pontualmente onde o erro é confirmado como falso positivo ou limitação de biblioteca.

---

# Épicos e Histórias

## EPIC-15A: Estabilidade do Build

### STORY-15A-01: Correção de Imports e Estado
**Descrição:** Corrigir erros triviais que impedem o build, como importações erradas e inicialização de estado nula.
**Cenários:**
1.  Acessar `/admin/benefits` e verificar se a lista carrega (Import fix).
2.  Abrir modal de "Magic Link" e verificar se não quebra ao abrir (State fix).
**Regras:**
*   Não alterar a lógica de negócio, apenas a "cola" do código.
**Critérios de Aceite:**
*   `app/admin/benefits/page.tsx` compila sem erro.
*   `magic-link-modal.tsx` compila sem erro.

### STORY-15A-02: Tipagem de Formulários Complexos
**Descrição:** Resolver os 28 erros de tipagem no `step-configuration.tsx` relacionados ao React Hook Form com Zod Discriminated Unions.
**Cenários:**
1.  Criar uma promoção do tipo "Desconto Percentual".
2.  Criar uma promoção do tipo "Brinde".
3.  Verificar se os erros de validação aparecem corretamente na UI.
**Regras:**
*   Manter a validação Zod funcionando.
**Critérios de Aceite:**
*   `step-configuration.tsx` compila sem erro.
*   Formulário continua validando campos obrigatórios.

### STORY-15A-03: Limpeza Final e Configuração
**Descrição:** Remover a flag `ignoreBuildErrors` e garantir build "verde".
**Cenários:**
1.  Rodar `npm run build` localmente.
**Critérios de Aceite:**
*   `next.config.mjs` limpo.
*   Build passa com sucesso.

# STORY-10B-01: Layout da Página de Perfil

**Épico:** EPIC-10B
**Status:** Planejado

## 1. Descrição
Construir a estrutura visual da página de perfil do parceiro. Isso inclui a navegação (rota), o fetch de dados no Server Component e a renderização estática/visual dos elementos (Galeria, Título, Descrição, Ofertas).

## 2. Detalhamento de UX
*   **Header:** Deve ocupar 40% da altura da tela com a Galeria (Imagem de capa).
*   **Logo:** Sobreposto à imagem de capa (estilo avatar).
*   **Tipografia:** Título H1 grande e legível.

## 3. Critérios de Aceite
1.  **Navegação:** Clicar num card na Home leva para a nova página.
2.  **Dados:** A página exibe o Nome, Descrição e Endereço vindos do banco atualizado.
3.  **Responsividade:** Funciona bem em Mobile e Desktop.

## 4. Detalhamento Técnico
*   **Rota:** `app/student/(app)/[academySlug]/partner/[partnerId]/page.tsx`
*   **Componentes:** `PartnerHeader.tsx`, `BenefitsList.tsx`.

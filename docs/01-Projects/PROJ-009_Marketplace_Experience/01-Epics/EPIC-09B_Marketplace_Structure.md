# EPIC-09B: Marketplace Structure

## Descrição
Reestruturação completa da experiência do aluno para um formato de Marketplace (Vitrine), com categorização hierárquica e busca avançada.

## Histórias

### STORY-09B-01: Schema de Categorias e Tags
*   **Descrição:** Criar tabelas para suportar a hierarquia de categorias e tags de parceiros.
*   **Regras de Negócio:**
    1.  Categorias podem ter hierarquia (Pai/Filho).
    2.  Tags são atributos N:N (Um parceiro tem várias tags).
*   **Critérios de Aceite:**
    1.  Tabelas `categories`, `partner_categories`, `partner_tags` criadas.
    2.  Chaves estrangeiras configuradas corretamente.
*   **Detalhamento DB:**
    *   `categories` (id, name, icon, parent_id).
    *   `partner_tags` (id, name, icon).

### STORY-09B-02: Seed Inicial de Dados
*   **Descrição:** Popular o banco com as categorias padrão do mercado (Alimentação, Saúde, etc).
*   **Cenários:**
    1.  **Deploy:** Ao rodar script, categorias aparecem.
*   **Regras de Negócio:**
    1.  Categorias devem ser globais (sistema), não por academia. (Academia só vincula parceiros a elas).
*   **Critérios de Aceite:**
    1.  Pelo menos 5 categorias Macro e 10 sub-categorias inseridas.

### STORY-09B-03: Nova Home (Vitrine)
*   **Descrição:** Implementar a nova tela inicial do aluno substituindo a Dashboard.
*   **UX:**
    1.  **Header:** Busca e Localização.
    2.  **Carrossel:** Ícones de categorias.
    3.  **Feed:** Lista de cards de parceiros.
*   **Regras de Negócio:**
    1.  Mostrar apenas parceiros vinculados à academia do aluno.
*   **Critérios de Aceite:**
    1.  Dashboard antiga removida/arquivada.
    2.  Nova Home renderiza lista de parceiros usando o novo componente `PartnerCard` (já adaptado).
    3.  Carrossel de categorias funcional (filtra ao clicar).

### STORY-09B-04: Busca e Filtros Avançados
*   **Descrição:** Permitir filtrar a vitrine por múltiplos critérios.
*   **Cenários:**
    1.  **Busca:** Usuário digita "Sushi", sistema busca em nomes de parceiros E tags.
    2.  **Filtro:** Usuário clica em "Delivery" (Tag), lista filtra.
*   **Regras de Negócio:**
    1.  Busca deve ser case-insensitive.
*   **Critérios de Aceite:**
    1.  Input de busca funcional.
    2.  Filtros de tags (Pills) funcionais.

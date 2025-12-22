# PROJ-009: Marketplace Experience & Full Customization

## 1. Visão do Produto
Oferecer uma experiência de **Super App (Marketplace)** para os alunos, onde a academia tem **CONTROLE TOTAL** sobre a identidade visual.
O objetivo é que o App pareça 100% proprietário da academia ("White Label Real").

---

## 2. Personalização Completa (Theming Manual)

A academia terá um painel onde definirá EXPLICITAMENTE as cores de cada elemento chave.
Não haverá cálculo mágico; o que eles definirem, será usado.

### 2.1. Variáveis de Cor (Database: `academies`)
Adicionaremos as seguintes colunas para controle granular:

#### Cores de Marca
1.  **`primary_color`**: Botões principais, ícones ativos, links, barras de progresso.
2.  **`secondary_color`**: Botões secundários, badges de destaque, detalhes.
3.  **`tertiary_color`** (Opcional): Elementos de menor destaque ou bordas.

#### Cores de Estrutura (Fundo e Texto)
4.  **`background_color`**: Cor de fundo geral da tela (Ex: Branco ou Preto profundo).
5.  **`surface_color`**: Cor dos Cards, Header e Menu Inferior (Ex: Cinza claro ou Cinza chumbo).
6.  **`text_primary_color`**: Cor de Títulos e textos principais (contraste com o fundo).
7.  **`text_secondary_color`**: Cor de subtítulos e legendas.

#### Cores de Feedback (Opcional, mas recomendado ter padrão)
8.  **`success_color`**: Mensagens de sucesso (Padrão Verde, mas editável).
9.  **`error_color`**: Mensagens de erro (Padrão Vermelho, mas editável).

### 2.2. Onde essas cores aparecem?

| Variável | Aplicação no App |
| :--- | :--- |
| `primary_color` | Botão "Gerar Voucher", Ícone Ativo no Menu, Títulos de Destaque. |
| `secondary_color` | Tag "Novo", Borda de Card selecionado, Botão "Voltar". |
| `background_color` | Fundo de todas as páginas (`body`). |
| `surface_color` | Fundo do Card de Parceiro, Fundo do Header, Fundo da Tab Bar. |
| `text_primary` | Nome do Parceiro, Título do Benefício. |
| `text_secondary` | Endereço, Regras do voucher, Legendas. |

---

## 3. Arquitetura "Marketplace First"

### 3.1. Home (Vitrine)
*   Busca Global no topo.
*   Carrossel de Categorias (ícones coloridos com `primary_color`).
*   Listagem de Parceiros em Cards (com `surface_color`).

### 3.2. Categorização (3 Níveis)
*   **Macro:** Alimentação, Saúde, etc.
*   **Segmento:** Pizzaria, Sushi, etc.
*   **Tags:** Delivery, Presencial.

---

## 4. Plano de Implementação

### Fase 1: DB & Admin de Customização
1.  **DB:** Adicionar colunas de cor na tabela `academies`.
2.  **Admin:** Criar formulário de "Personalização do App" com *Color Pickers* para cada variável.
3.  **Front:** Criar `ThemeProvider` que injeta essas cores no CSS `:root`.

### Fase 2: Refatoração Visual (Marketplace)
1.  Aplicar as variáveis CSS em todos os componentes (`Card`, `Button`, `Layout`).
2.  Construir a nova Home.

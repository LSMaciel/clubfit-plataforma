# PROJ-009: Marketplace Experience & Full Customization

## 1. Descrição do Projeto
Este projeto visa transformar o atual "Portal do Aluno" (focado em gestão) em um **Super App de Benefícios (Marketplace)**, similar a plataformas de delivery e serviços. Simultaneamente, implementaremos um motor de **Personalização Completa (White Label)**, permitindo que cada academia defina explicitamente sua identidade visual (cores de fundo, botões, textos, superfície), garantindo que o aplicativo reflita 100% da marca do cliente.

## 2. Regras de Negócio
1.  **Soberania da Marca:** A academia deve ter controle manual sobre as variáveis de cor. O sistema NÃO deve tentar "adivinhar" ou calcular cores automaticamente, exceto como sugestão inicial.
2.  **Home Marketplace:** A tela inicial do aluno deve ser, obrigatoriamente, a vitrine de parceiros e benefícios, eliminando a dashboard administrativa antiga.
3.  **Categorização Hierárquica:** Os parceiros devem ser organizados em **Categorias** (Macro), **Sub-categorias** (Segmento) e **Tags** (Atributos de Serviço).
4.  **Consistência:** As alterações de cor no Admin devem refletir em todas as plataformas do aluno (Mobile e Desktop) de forma consistente.

## 3. Critérios de Aceite
1.  **Admin de Estilo:**
    *   O Administrador da Academia consegue acessar um painel "Personalizar App".
    *   Consegue definir cores hexadecimais para: Primária, Secundária, Fundo, Superfície, Textos (Títulos/Legendas).
    *   Consegue visualizar uma prévia (mockup) das alterações.
2.  **Experiência do Aluno:**
    *   Ao logar, o aluno visualiza o App com as cores definidas pela sua academia.
    *   A Home exibe carrossel de categorias e parceiros.
    *   É possível filtrar parceiros por Categoria, Sub-categoria e Tags.
3.  **Performance:**
    *   A injeção de temas não deve causar "flicker" (piscar de tela) no carregamento.

## 4. Detalhamento Técnico
*   **Frontend (Architectura):**
    *   Uso de **CSS Variables** (`:root`) injetadas dinamicamente via um `ThemeProvider` no React.
    *   As variáveis serão mapeadas direto das colunas do banco de dados.
*   **Backend:**
    *   Novas colunas na tabela `academies` para armazenar o tema.
    *   Novas tabelas para estrutura de categorias (`categories`, `partner_categories`).

## 5. Detalhamento de UX
*   **Filosofia:** "Seu Clube, Suas Regras". O App é um canvas em branco que a academia pinta.
*   **Navegação:** Bottom Tab Bar simplificada (Início, Carteira, Perfil).
*   **Discovery:** Uso intenso de ícones e imagens. Cards com info clara de benefícios.

## 6. Detalhamento do Banco de Dados
### Tabela `academies` (Alteração)
*   `color_primary` (HEX)
*   `color_secondary` (HEX)
*   `color_background` (HEX)
*   `color_surface` (HEX)
*   `color_text_primary` (HEX)
*   `color_text_secondary` (HEX)

### Tabela `categories` (Nova)
*   `id` (PK)
*   `name` (text)
*   `slug` (text)
*   `icon_url` (text)
*   `parent_id` (FK auto-referência para sub-categorias)

### Tabela `partner_tags` (Nova)
*   `id` (PK)
*   `name` (text)
*   `icon_name` (text) - Referência a ícones (ex: Lucide)

### Junções
*   `partner_categories_link` (partner_id, category_id)
*   `partner_tags_link` (partner_id, tag_id)

## 7. Riscos e Mitigação
| Risco | Impacto | Mitigação |
| :--- | :--- | :--- |
| **Contraste Baixo:** Academia escolhe fonte branca em fundo branco. | App ilegível. | **Mitigação:** Adicionar avisos de acessibilidade (WCAG) no painel do Admin ao detectar baixo contraste. |
| **Complexidade de Configuração:** Admin se perde com tantas cores. | Frustração/Feiura. | **Mitigação:** Oferecer "Presets" (Temas prontos) que preenchem tudo com um clique, mas permitem edição manual. |
| **Categorização Bagunçada:** Parceiros em categorias erradas. | Dificuldade de busca. | **Mitigação:** Curadoria inicial das categorias pela Dotty Co (Super Admin). |

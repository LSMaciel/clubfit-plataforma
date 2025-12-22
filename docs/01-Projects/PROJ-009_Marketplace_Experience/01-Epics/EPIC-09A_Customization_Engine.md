# EPIC-09A: Full Customization Engine

## Descrição
Implementação do motor de personalização que permite à academia definir manualmente todas as cores do aplicativo do aluno, garantindo que o App reflita fielmente a identidade visual da marca ("White Label Real").

## Histórias

### STORY-09A-01: Migração de Banco de Dados (Temas)
*   **Descrição:** Alterar a tabela `academies` para suportar as 6 novas colunas de cor.
*   **Regras de Negócio:**
    1.  Os campos devem ser opcionais no banco, mas obrigatórios na aplicação (validados com um default se nulos).
    2.  Formato deve ser HEX string (7 caracteres).
*   **Critérios de Aceite:**
    1.  Tabela `academies` possui as colunas `color_primary`, `color_secondary`, `color_background`, `color_surface`, `color_text_primary`, `color_text_secondary`.
    2.  Script de migração executado com sucesso em QA.
*   **Detalhamento Técnico:** Migração SQL simples (`ALTER TABLE`).
*   **Riscos:** N/A.
*   **Mitigação:** N/A.
*   **Cenários de Teste:** Verificar schema no Supabase.

### STORY-09A-02: Interface Admin de Personalização
*   **Descrição:** Página no painel administrativo onde o dono da academia escolhe as cores.
*   **Cenários:**
    1.  **Edição:** Admin edita a "Cor Primária", vê prévia e salva.
*   **Regras de Negócio:**
    1.  Admin só edita sua própria academia.
    2.  Validação de formato HEX.
    3.  Alerta de contraste (opcional MVP).
*   **Critérios de Aceite:**
    1.  Inputs do tipo "Color Picker" para todas as 6 variáveis.
    2.  Preview em tempo real de um "Card de Exemplo".
    3.  Botão salvar persiste no banco.
*   **UX:** Painel lateral com Color Pickers e área central com "Mockup do App" que muda as cores.
*   **Riscos:** Admin escolher cores ilegíveis.
*   **Mitigação:** Adicionar textos de ajuda e presets.

### STORY-09A-03: Integração Frontend (Student Theme)
*   **Descrição:** Fazer o App do aluno ler as cores do banco e aplicar via CSS Variables.
*   **Cenários:**
    1.  **Login:** Aluno loga, App carrega tema da academia.
*   **Regras de Negócio:**
    1.  Fallbacks: Se o banco estiver null, usar tema padrão da Dotty/Clubfit.
*   **Critérios de Aceite:**
    1.  `ThemeProvider` no React injeta `--color-primary`, etc no `:root`.
    2.  Componentes (Botões, Cards, Textos) consomem essas variáveis.
*   **Detalhamento Técnico:** React Context API + Style Dictionary.
*   **Riscos:** Flicker no loading.
*   **Mitigação:** Server Component pré-carrega cores ou Skeleton Screen neutro.

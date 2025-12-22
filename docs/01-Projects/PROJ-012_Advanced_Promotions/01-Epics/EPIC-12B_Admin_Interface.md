# EPIC-12B: Interface de Gestão (Admin)

## Visão Geral
Criação do Wizard (Passo a Passo) no painel administrativo para permitir que os donos de academia/parceiros criem promoções complexas de forma intuitiva, sem precisar entender JSON.

---

## Histórias de Usuário

### STORY-12B-01: Wizard de Seleção de Tipo (Step 1)

*   **Nome:** Seleção Visual de Estratégia
*   **Descrição:** Primeira tela do criador de promoções, onde o usuário escolhe o "Card" da estratégia desejada.
*   **Cenários:**
    *   **Cenário 1:** Usuário clica em "Nova Promoção" -> Vê grade com 5 opções grandes.
    *   **Cenário 2:** Usuário clica em "Frete Grátis" -> Card fica selecionado e botão "Próximo" habilita.
*   **Regras de Negócio:**
    *   Obrigatório escolher 1 tipo para avançar.
*   **Critérios de Aceite:**
    *   Grid responsivo (Mobile/Desktop).
    *   Ícones visuais para cada tipo.
    *   State management salva a escolha (`selectedType`).
*   **Detalhamento Técnico:**
    *   Componente `PromotionTypeSelector.tsx`.
    *   Uso de Radio Group estilizado como Cards.
*   **Detalhamento de UX:**
    *   Cards com hover effect.
    *   Descrição curta ("Aumente seu ticket médio") abaixo do título de cada card.
*   **Detalhamento do Banco de Dados:** N/A (Estado local).
*   **Riscos:**
    *   Usuário não entender o que significa "BOGO".
*   **Mitigação dos Riscos:**
    *   Usar subtítulos explicativos ("Leve Mais, Pague Menos").
*   **Cenários de Testes:**
    *   Clique no Card -> State atualiza?

---

### STORY-12B-02: Configuração e Regras (Step 2 & 3)

*   **Nome:** Formulário Dinâmico de Regras
*   **Descrição:** Renderizar inputs diferentes baseado no tipo escolhido e permitir adicionar restrições (constraints).
*   **Cenários:**
    *   **Cenário 1 (Desconto):** Mostra Toggle (% ou R$) e Input numérico.
    *   **Cenário 2 (Brinde):** Mostra Input Texto "Nome do Item".
    *   **Cenário 3 (Adicionar Regra):** Clica "+ Regra" -> Abre Modal "Horário" -> Seleciona Terça -> Adiciona chip de regra.
*   **Regras de Negócio:**
    *   Desconto % não pode ser > 100.
    *   Regra de horário deve ter inicio < fim.
*   **Critérios de Aceite:**
    *   Inputs corretos aparecem para cada tipo.
    *   JSON final gerado (`configuration` e `constraints`) bate com a spec do Backend.
*   **Detalhamento Técnico:**
    *   Formulário com `react-hook-form`.
    *   Validadores Zod condicionais (`type === 'BOGO' ? bogoSchema : discountSchema`).
*   **Detalhamento de UX:**
    *   Inputs com máscaras (R$, %).
    *   Regras aparecem como "Tags" removíveis (ex: `[Somente Delivery (x)]`).
*   **Detalhamento do Banco de Dados:** N/A.
*   **Riscos:**
    *   Complexidade de validação (ex: conflito de horários).
*   **Mitigação dos Riscos:**
    *   Validar apenas sintaxe básica no front, deixar lógica complexa de colisão para backend (futuro) ou simplificar MVP.
*   **Cenários de Testes:**
    *   Preencher form e verificar JSON no console.

---

### STORY-12B-03: Preview e Publicação

*   **Nome:** Pré-visualização Realista
*   **Descrição:** Antes de salvar, mostrar um card idêntico ao do app do aluno para o admin ter certeza do que criou.
*   **Cenários:**
    *   **Cenário 1:** Usuário preenche "15% OFF" -> Preview atualiza em tempo real mostrando o badge "15%".
    *   **Cenário 2:** Clica em "Publicar" -> Envia POST para API e redireciona.
*   **Regras de Negócio:**
    *   Não permitir publicar se houver erros de validação.
*   **Critérios de Aceite:**
    *   O componente de Preview deve ser compartilhado (ou idêntico) ao do Student App.
*   **Detalhamento Técnico:**
    *   Server Action `createPromotion(data)`.
    *   Reuso do componente `PromotionCard` do projeto Student (Shared Component).
*   **Detalhamento de UX:**
    *   Botão "Publicar" com estado de Loading.
    *   Feedback de Sucesso (Toast/Confetti).
*   **Detalhamento do Banco de Dados:**
    *   INSERT na tabela `benefits`.
*   **Riscos:**
    *   JSON malformado quebrar o app do aluno.
*   **Mitigação dos Riscos:**
    *   Validação estrita com Zod no Server Action antes do Insert.
*   **Cenários de Testes:**
    *   Criar promoção e verificar se apareceu na lista.

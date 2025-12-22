# PROJ-012: Motor de Promoções Avançadas

## 1. Descrição
Implementação de um motor robusto de promoções para o ClubFit, permitindo que parceiros criem ofertas diversificadas (Descontos, Leve+Pague-, Frete Grátis) com regras de negócio granulares (Validade, Canal, Limite por CPF). O objetivo é aumentar o engajamento dos alunos e o ticket médio dos parceiros através de ofertas inteligentes.

## 2. Regras de Negócio (RN)

### RN01 - Tipos de Promoção
O sistema deve suportar nativamente os seguintes comportamentos:
1.  **Discount (Percent/Fixed):** Redução no valor final (ex: 10% ou R$ 15,00).
2.  **BOGO (Buy X Get Y):** Gratuidade condicionada a quantidade (ex: Leve 3 Pague 2).
3.  **Gift:** Brinde físico na compra (ex: Garrafinha).
4.  **Free Shipping:** Isenção de taxa de entrega (Delivery).

### RN02 - Restrições de Validade (Constraints)
Toda promoção pode ter N restrições que devem ser todas verdadeiras para a aplicação:
1.  **Canal:** Válido apenas para `STORE` (Loja), `DELIVERY` ou `ALL`.
2.  **Frequência:** Controle de uso por usuário (`ONCE_PER_USER`, `DAILY`, `UNLIMITED`).
3.  **Temporal:** Janelas de horário específicas (Happy Hour: Terça 18h-20h).
4.  **Financeiro:** Valor mínimo de pedido (`min_spend`).

### RN03 - Conflito de Promoções
Por padrão, promoções **não são cumulativas**. Se houver duas aplicáveis, o sistema (ou o parceiro) deve definir a prioridade ou o aluno escolhe a mais vantajosa. *Nota: MVP assume não cumulativo.*

## 3. Critérios de Aceite
1.  **Admin:** Parceiro consegue criar uma promoção "Happy Hour" (Terça 18h, 50% OFF) em menos de 1 minuto.
2.  **Aluno:** Ao abrir o perfil do parceiro na Terça às 18h, vê a promoção destacada. Na Quarta, ela some ou aparece inativa.
3.  **Segurança:** Um usuário não consegue resgatar a mesma promoção de "Uso Único" duas vezes.

## 4. Detalhamento Técnico

### Banco de Dados (Schema Update)
Alteração na tabela `public.benefits`:
*   Adicionar `type` (ENUM/TEXT): Define a estratégia de cálculo.
*   Adicionar `config` (JSONB): Parâmetros do tipo (ex: `{ "percent": 15 }` ou `{ "buy": 3, "pay": 2 }`).
*   Adicionar `rules` (JSONB): Restrições de validação (ex: `{ "min_spend": 50, "days": [2], "hours": ["18:00-20:00"] }`).

### Backend (Validation Logic)
Criar serviço `PromotionEngine` que recebe `(User, Cart, Promotion)` e retorna `(isValid, discountAmount, refusalReason)`.

## 5. Detalhamento de UX

### A. Criação (Admin)
Wizard progressivo para não assustar o usuário:
1.  **Escolha o Tipo:** Cards visuais grandes (Ícone + Nome).
2.  **Configure:** Inputs específicos para o tipo escolhido (ex: Só pede "Quantidade" se for BOGO).
3.  **Regras:** "Adicionar condição" (Botão que abre modal para escolher Horário, Valor Mínimo, etc).
4.  **Preview:** Card simulando a visão do aluno.

### B. Consumo (Aluno)
*   **Tags:** Badge "SÓ HOJE" ou "DELIVERY" no card da promoção.
*   **Feedback:** Se tentar usar fora do horário, mensagem clara: "Promoção válida apenas às terças".

## 6. Riscos e Mitigação
*   **Risco:** Complexidade de queries JSONB deixarem o app lento.
    *   *Mitigação:* Indexar chaves principais do JSONB ou desnormalizar colunas críticas se necessário (ex: `valid_until`).
*   **Risco:** Usuário criar promoção "prejuízo" (ex: 100% OFF).
    *   *Mitigação:* Trava de segurança no Frontend (aviso se desconto > 80%) e validação no Backend.

## 7. Estrutura de Entregáveis (Épicos)
*   **EPIC-12A:** Estrutura de Dados e API (Backend)
*   **EPIC-12B:** Interface de Gestão (Admin)
*   **EPIC-12C:** Experiência de Consumo (App Aluno)

# PROJ-007: Controle Financeiro (Super Admin)

**Status:** 🟡 Planejamento
**Responsável:** Tech Lead System
**Data de Criação:** 2025-12-19

## 1. Descrição do Projeto
Implementação do módulo de gestão financeira e operacional do Super Admin. Atualmente, a plataforma não possui controle sistêmico sobre pagamentos, vencimentos ou status de contratos das academias clientes.
Este projeto visa criar uma estrutura de dados de **Assinaturas (`subscriptions`)** e um painel de controle para que o Super Admin possa acompanhar a receita (MRR), identificar inadimplentes e bloquear/desbloquear o acesso de academias manualmente ou baseado em regras.

## 2. Regras de Negócio

### 2.1. Ciclo de Vida da Assinatura
*   **RN01 - Status da Academia:** O acesso de todos os usuários (Admins e Alunos) de uma academia depende do status financeiro/operacional dela:
    *   `ACTIVE`: Acesso normal.
    *   `SUSPENDED`: Bloqueio total de login para Admins e geração de voucher para Alunos. Mensagem: "Academia suspensa. Contate o suporte."
    *   `CANCELED`: Bloqueio total e marcação para churn.
*   **RN02 - Inadimplência:** O sistema deve sinalizar academias com `payment_status = OVERDUE` após X dias do vencimento (configurável, default 1 dia).

### 2.2. Fluxo de Pagamento (Manual v1)
*   **RN03 - Registro Manual:** Neste MVP, não haverá integração com gateway (Stripe/Asaas). O Super Admin registra o pagamento manualmente clicando em "Confirmar Pagamento".
*   **RN04 - Renovação:** Ao registrar um pagamento, o sistema deve sugerir a atualização da `next_payment_date` baseado na periodicidade do plano (Mensal/Anual).

### 2.3. Contratos
*   **RN05 - Vencimento de Contrato:** Academias possuem uma data de fim de contrato. O sistema deve alertar com 30 dias de antecedência para renovação comercial.

## 3. Critérios de Aceite (DoD)
1.  **Schema Financeiro:** Tabela `subscriptions` criada e populada (1:1 com `academies`).
2.  **Dashboard Financeiro:** Widget no painel do Super Admin exibindo: Total MRR, Qtd Inadimplentes, Qtd Renovações Próximas.
3.  **Gestão de Status:** Super Admin consegue alterar o status de uma academia de ACTIVE para SUSPENDED com efeito imediato no acesso.
4.  **Bloqueio Efetivo:** Admin de academia suspensa tenta logar -> Recebe erro amigável. Aluno de academia suspensa tenta gerar voucher -> Recebe erro amigável.
5.  **Relatório:** Listagem filtrável de academias por Status de Pagamento (Em dia / Atrasado).

## 4. Detalhamento Técnico

### 4.1. Banco de Dados
Nova tabela `subscriptions`:
*   `academy_id` (PK/FK) -> Relação 1:1 estrita.
*   `plan_name` (Text) -> Ex: "Plano Gold".
*   `plan_value` (Decimal) -> Valor cobrado.
*   `currency` (Text) -> Default 'BRL'.
*   `recurrence` (Enum: MONTHLY, YEARLY).
*   `status` (Enum: ACTIVE, SUSPENDED, CANCELED).
*   `payment_status` (Enum: PAID, OVERDUE, PENDING).
*   `next_payment_date` (Date).
*   `contract_end_date` (Date).
*   `last_payment_date` (Date, Nullable).
*   `created_at`, `updated_at`.

### 4.2. Middleware & Segurança
*   **Middleware (`middleware.ts`):** Ao detectar login de `ACADEMY_ADMIN`, verificar se academia está `ACTIVE`. Se não, redirecionar para `/suspended`.
*   **Server Actions:** Em `generateToken` (Alunos), adicionar verificação:
    ```typescript
    const subscription = await db.query.subscriptions.findFirst({ where: eq(academy_id, student.academy_id)});
    if (subscription.status !== 'ACTIVE') throw new Error("Serviço suspenso.");
    ```

## 5. Detalhamento de UX

### 5.1. Dashboard Super Admin
*   **Cards de Topo:**
    *   💰 Recorrência Mensal (Soma de `plan_value` onde `recurrence=MONTHLY` + `status=ACTIVE`).
    *   ⚠️ Inadimplentes (Contagem `payment_status=OVERDUE`).
    *   📅 Renovações (Contagem `contract_end_date` <= Hoje + 30 dias).
*   **Tabela de Academias:** Adicionar colunas: "Status Fin.", "Próx. Vencimento", "Valor".
*   **Ações na Tabela:** Menu de contexto (...) -> "Registrar Pagamento", "Suspender Academia".

### 5.2. Experiência da Academia Suspensa
*   **Login:** Tela limpa apenas com logo e texto: "O acesso desta academia está temporariamente suspenso. Entre em contato com o administrador."

## 6. Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Bloqueio Indevido:** Super Admin suspender a academia errada por engano. | Baixa | Alto | Adicionar modal de confirmação "Tem certeza que deseja suspender a academia X?" com input de confirmação. |
| **Esquecimento de Baixa:** Super Admin esquecer de registrar pagamento e academia ficar como inadimplente. | Alta | Baixo | O sistema apenas *sinaliza* inadimplência (flag OVERDUE), o bloqueio (SUSPENDED) deve ser uma ação explicita ou, se automática, ter carência (ex: 5 dias após vencimento). MVP: Bloqueio manual apenas. |
| **Performance:** Verificar status financeiro em toda requisição. | Média | Médio | Cachear o status da academia no cookie de sessão ou usar dados da `academies` (desnormalizar status operacional para a tabela `academies` se o join ficar pesado). MVP: Query direta é aceitável pelo volume baixo. |

---

## 7. Estrutura de Épicos

1.  **EPIC-07A: Estrutura de Dados e Lógica Core**
    *   Criação da tabela `subscriptions` e triggers/actions de verificação de bloqueio.
2.  **EPIC-07B: Dashboard Financeiro (Frontend)**
    *   Implementação dos Widgets e da Listagem Financeira no Admin.
3.  **EPIC-07C: Gestão de Cobrança Manual**
    *   Implementação das ações de "Registrar Pagamento" e fluxo de mudança de status manual.

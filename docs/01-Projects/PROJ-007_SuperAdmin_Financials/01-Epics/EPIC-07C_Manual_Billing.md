# EPIC-07C: Gestão de Cobrança Manual

**Projeto:** PROJ-007 (Controle Financeiro)
**Status:** 🟡 Planejamento

## 1. Descrição
Ferramentas para o Super Admin operar o dia a dia financeiro: dar baixa em pagamentos e alterar status manualmente.

## 2. Histórias de Usuário

### STORY-005: Ação de Baixa de Pagamento
**Como:** Super Admin
**Quero:** Registrar que uma academia pagou a mensalidade
**Para:** Manter o controle em dia e evitar bloqueios indevidos.

#### UX
*   Botão na linha da academia (tabela): "Registrar Pagamento".
*   Modal de Confirmação: "Confirmar pagamento de R$ XXX referente a [Mês]?"
*   Check "Atualizar próximo vencimento para [Data + 1 Mês]?".

#### Detalhamento Técnico
*   Server Action `registerPayment(academyId)`.
*   Updates:
    *   `payment_status` -> 'PAID'
    *   `last_payment_date` -> NOW()
    *   `next_payment_date` -> +1 mês (se checkbox marcado).
    *   Se estava `SUSPENDED`, mudar para `ACTIVE`.

---

### STORY-006: Suspensão Manual
**Como:** Super Admin
**Quero:** Suspender manualmente uma academia
**Para:** Forçar contato em casos de quebra de contrato ou falta de pagamento não detectada automaticamente.

#### UX
*   Botão "Suspender Academia".
*   Modal de perigo (Vermelho): "Isso bloqueará o acesso de todos os alunos e admins."

#### Regras de Negócio
*   Ao suspender, `status` na tabela `subscriptions` vira `SUSPENDED`.
*   O `payment_status` permanece inalterado (ou pode ir para `OVERDUE`, mas melhor manter separado o status operacional do financeiro).

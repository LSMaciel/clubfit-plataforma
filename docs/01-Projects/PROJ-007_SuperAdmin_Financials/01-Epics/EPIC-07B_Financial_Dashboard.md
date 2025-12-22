# EPIC-07B: Dashboard Financeiro (Frontend)

**Projeto:** PROJ-007 (Controle Financeiro)
**Status:** 🟡 Planejamento

## 1. Descrição
Implementação da interface visual para o Super Admin acompanhar a saúde financeira do SaaS.

## 2. Histórias de Usuário

### STORY-003: Widgets de Resumo Financeiro
**Como:** Super Admin
**Quero:** Ver cards com totais financeiros no topo do meu dashboard
**Para:** Ter uma visão rápida do faturamento e problemas.

#### Elementos de UI
*   Card 1: "Total MRR" (Soma de todos os contratos ativos).
*   Card 2: "Inadimplentes" (Número de academias com pagamento atrasado).
*   Card 3: "A Vencer (30d)" (Renovações próximas).

#### Detalhamento Técnico
*   Criar Server Action `getFinancialMetrics()` que faz as queries agregadas no banco.
*   Cachear resultado por alguns minutos se query for pesada (opcional para MVP).

---

### STORY-004: Listagem de Academias com Status Financeiro
**Como:** Super Admin
**Quero:** Ver colunas de status financeiro na lista geral de academias
**Para:** Identificar qual academia específica está devendo.

#### UX
*   Tabela existente de Academias.
*   Novas colunas: `Status` (Badge Colorido: Verde/Vermelho), `Valor Plano`, `Próx. Vencimento`.
*   Filtro: "Apenas Inadimplentes".

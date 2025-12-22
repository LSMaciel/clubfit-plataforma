# EPIC-08B: Dashboards e Business Intelligence

**Projeto:** PROJ-008 (Relatórios Operacionais)
**Status:** 🟡 Planejamento

## 1. Descrição
Criação de visualizações de dados para tomada de decisão, tanto para a Academia (nível tático) quanto para o Super Admin (nível estratégico).

## 2. Histórias de Usuário

### STORY-003: Dashboard Analítico da Academia
**Como:** Admin da Academia
**Quero:** Ver gráficos de uso dos vouchers
**Para:** Entender se o benefício está sendo usado pelos alunos.

#### UX / UI
*   Gráfico de Barras: "Vouchers por Mês".
    *   Eixo X: Meses (Jan, Fev...)
    *   Eixo Y: Quantidade (inteiro).
*   Ranking: Lista "Top Parceiros".
    *   Ex: "1. Pizzaria do João (15 usos)", "2. Farmácia X (8 usos)".

#### Detalhamento Técnico
*   Criar rotas de API ou Server Actions que fazem queries agregadas (`GROUP BY partner_id`, `GROUP BY date_trunc('month', validated_at)`).

---

### STORY-004: BI do Super Admin
**Como:** Super Admin
**Quero:** Ver os números totais da plataforma
**Para:** Acompanhar o crescimento do produto.

#### KPIs Necessários
*   **Total de Vouchers Validados:** Soma simples de `benefit_usages`.
*   **Academias:** Total de linhas em `academies` (filtrar ativas se possível).
*   **Alunos:** Total de linhas em `students`.
*   **Parceiros:** Total de linhas em `partners`.

#### Detalhamento Técnico
*   Adicionar estes cards no topo do `/admin` (Dashboard Global) quando o usuário for SUPER_ADMIN.

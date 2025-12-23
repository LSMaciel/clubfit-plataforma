# PROJ-014: BI & Analytics (ClubFit Intelligence)

## 1. Visão Geral

O projeto **ClubFit Intelligence** visa transformar a massa de dados transacionais gerada pela plataforma (acessos, vouchers, uso de benefícios) em informações estratégicas (KPIs, Dashboards e Relatórios). 

O foco central é o **"Economizômetro"**, uma métrica proprietária que tangibiliza o valor do produto demonstrando quanto o aluno economizou ao utilizar o sistema, servindo como uma poderosa ferramenta de retenção para as academias.

---

## 2. Regras de Negócio

*   **RN01 - Cálculo de Economia (Estimada):**
    *   Para benefícios do tipo `DISCOUNT_PERCENTAGE`: Economia = (Ticket Médio da Categoria * Percentual de Desconto).
        *   *Default Ticket:* R$ 100,00 se não especificado na categoria.
    *   Para benefícios do tipo `DISCOUNT_FIXED`: Economia = Valor do Desconto.
    *   Para benefícios do tipo `BOGO` (Buy One Get One): Economia = Ticket Médio da Categoria (Preço do item gratuito).
*   **RN02 - Gatilho de Contabilização:**
    *   A economia é contabilizada no momento em que o Voucher é gerado (`student_access_tokens` criado com status `PENDING`).
    *   *Nota:* Embora não garanta a compra, estatisticamente a intenção (geração do voucher) é o melhor proxy disponível sem integração com PDV.
*   **RN03 - Janela de Atividade (Engajamento):**
    *   Um aluno é considerado "Engajado" no mês se tiver gerado ao menos 1 voucher OU acessado o app em 3 dias distintos.
*   **RN04 - Privacidade nos Relatórios:**
    *   Relatórios agregados para Academias não podem identificar alunos individualmente se o grupo for menor que 5 pessoas (Prevenção de inferência), exceto se o dado for público (ex: Ganhadores de ranking com opt-in). *Para este MVP, mostraremos dados agregados.*

---

## 3. Critérios de Aceite

1.  **Infraestrutura de Dados:**
    *   Criação de tabelas analíticas (`analytics_*`) separadas das transacionais.
    *   Triggers ou Jobs que populam essas tabelas com latência máxima de 1 hora (ou Real-time via Trigger).
2.  **Visão do Aluno (App):**
    *   Widget na Home ou Perfil mostrando "Economia Total Acumulada".
3.  **Visão da Academia (Admin):**
    *   Dashboard exibindo "Total Economizado pelos Alunos" no mês atual.
    *   Ranking dos 5 Parceiros mais populares.
4.  **Performance:**
    *   As consultas de dashboard não devem impactar a performance do app do aluno (leitura em tabelas separadas ou materialviews).

---

## 4. Detalhamento Técnico

### 4.1. Arquitetura de Dados (Analytics)
Utilizaremos uma abordagem de **Tabelas Agregadas** populadas via Triggers do PostgreSQL para garantir dados "near real-time" sem custo de processamento pesado na leitura.

**Justificativa:** Calcular `SUM()` em milhões de linhas de vouchers a cada load de dashboard é inviável. Tabelas de contadores incrementais resolvem isso.

### 4.2. Schema Proposto (Simplificado)

*   `analytics_daily_academy_metrics`:
    *   `date` (PK), `academy_id` (PK)
    *   `vouchers_generated` (INT)
    *   `unique_students_active` (INT)
    *   `estimated_economy` (DECIMAL)
*   `analytics_partner_performance`:
    *   `partner_id` (PK), `month` (PK, YYYY-MM)
    *   `views` (INT)
    *   `vouchers` (INT)

### 4.3. API / Backend
*   Novas RPCs (Remote Procedure Calls) no Supabase para leitura rápida dos dashboards.
    *   `get_academy_dashboard_metrics(academy_id, start_date, end_date)`
    *   `get_student_economy_summary(student_id)`

---

## 5. Detalhamento de UX (User Experience)

### 5.1. Aluno (Mobile)
*   **Cartão de Conquista:** Na tela de Perfil, um card dourado ou verde destacando o valor monetário.
*   **Microcopy:** "Sua mensalidade valeu a pena! Você já economizou R$ X."

### 5.2. Academia (Desktop)
*   **Dashboard Inicial:** Substituir ou complementar a tela inicial atual com:
    *   Gráfico de Linha: Economia Gerada x Tempo.
    *   Lista: Top Parceiros (Nome, Categoria, Qtd Vouchers).

---

## 6. Riscos e Mitigação

*   **Risco:** O "Ticket Médio" estimado estar muito fora da realidade, gerando valores de economia absurdos.
    *   *Mitigação:* Permitir que o Super Admin configure o "Ticket Médio" por Categoria no banco de dados (`categories.average_ticket`), começando com valores conservadores.
*   **Risco:** Performance do banco com triggers em tabelas de alta escrita (`student_access_tokens`).
    *   *Mitigação:* As triggers devem ser extremamente leves (apenas `UPDATE counter = counter + 1`). Se escalar demais, migrar para processamento em lote (cron job noturno).

---

## 7. Divisão em Épicos e Histórias

### EPIC-14A: Infraestrutura de Dados (Analytics Schema)
Fundação do módulo, criando as tabelas e rotinas de cálculo.

*   **STORY-14A-01: Tabelas Analíticas & Triggers**
    *   Criar tabelas `analytics_daily_academy_metrics` e `analytics_partner_performance`.
    *   Criar triggers em `student_access_tokens` para incrementar contadores.
*   **STORY-14A-02: Lógica de Cálculo de Economia**
    *   Implementar a função PL/PGSQL que calcula o valor da economia baseado nas regras do benefício e categoria.

### EPIC-14B: Visão do Aluno (Mobile)
Mostrar o valor para o usuário final.

*   **STORY-14B-01: Widget de Economia no Perfil**
    *   Criar componente visual no App.
    *   Integrar com RPC de leitura de economia.
*   **STORY-14B-02: Histórico de Uso (Extrato)**
    *   Lista simples dos últimos vouchers gerados e quanto "economizou" em cada.

### EPIC-14C: Visão da Academia (Admin Dashboard)
Painel de gestão para o dono da academia.

*   **STORY-14C-01: KPIs Principais (Economia Agregada)**
    *   Exibir cards de "Total Economizado", "Vouchers Gerados".
*   **STORY-14C-02: Ranking de Parceiros**
    *   Tabela ou lista ordenada dos parceiros com mais saída.

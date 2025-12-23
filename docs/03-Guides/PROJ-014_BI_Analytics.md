# PROJ-014: BI & Analytics (ClubFit Intelligence)

## 1. Visão Geral
O objetivo deste módulo é transformar os dados transacionais (cliques, vouchers, acessos) em **informação de valor** para demonstrar o ROI (Retorno sobre Investimento) da plataforma.

A premissa central é o **"Economizômetro"**: Tangibilizar quanto o aluno economiza, justificando a mensalidade da academia e o valor do ClubFit.

---

## 2. Públicos e Painéis

Teremos três visões distintas, cada uma respondendo a uma pergunta chave.

### 2.1. Visão do Aluno (Mobile App)
**Pergunta:** *"Por que devo continuar pagando esta academia?"*

*   **Economizômetro Pessoal:**
    *   *"Você economizou **R$ 150,00** este mês."*
    *   Comparativo: *"Sua economia pagou 1.5x sua mensalidade."*
*   **Histórico de Conquistas:**
    *   Vouchers gerados: 12
    *   Academias visitadas (se houver passaporte): 1
*   **Ranking (Gamification - Futuro):**
    *   *"Você está no Top 10% que mais economiza."*

### 2.2. Visão da Academia (Admin Panel)
**Pergunta:** *"O ClubFit está me ajudando a reter alunos?"*

*   **Economia Gerada para Alunos:**
    *   Total economizado pelos alunos da academia no mês.
    *   Média de economia por aluno ativo.
*   **Engajamento de Parceiros (Top Fighters):**
    *   Quais parceiros estão sendo mais acessados pelos MEUS alunos?
    *   Categorias mais buscadas (ex: Suplementos > Estética).
*   **Monitor de Retenção:**
    *   Alunos que usam benefícios vs. Alunos que não usam (comparar taxa de churn).
*   **Mapa de Calor Local:**
    *   Bairros onde os alunos mais consomem (ajuda a buscar novos parceiros locais).

### 2.3. Visão Super Admin (Gestão Global)
**Pergunta:** *"A plataforma está saudável e crescendo?"*

*   **Big Numbers (Global):**
    *   GMV de Economia (Total economizado em toda a rede).
    *   Total de Vouchers Gerados.
    *   Total de Acessos Únicos.
*   **Ranking de Academias:**
    *   Top 10 Academias com maior engajamento (Benchmark).
*   **Performance da Rede de Parceiros:**
    *   Parceiros Globais vs. Locais: Quem performa melhor?
    *   Conversão Geral (Visualização -> Voucher).

---

## 3. Definição das Métricas (Glossário)

### 3.1. Cálculo do "Economizômetro"
Como não temos integração com o PDV do parceiro (não sabemos se a compra foi efetivada), usaremos uma **Estimativa Baseada em Intenção**:
1.  **Voucher Percentual (%):** Estimamos um ticket médio da categoria (ex: Pizza = R$ 80). Se desconto é 10%, economia = R$ 8,00.
2.  **Voucher Valor Fixo (R$):** Economia = Valor do Desconto facial.
3.  **Validação:** Podemos implementar um botão "Eu usei" no app ou confiar na geração do voucher como proxy.

### 3.2. Engajamento
*   **Ativo no Mês:** Gerou pelo menos 1 voucher ou abriu o app > 3 vezes.

---

## 4. Estratégia Técnica

Para garantir performance e não pesar o banco transacional:

### 4.1. Tabelas de Fatos (Data Warehouse leve)
Criaremos tabelas analíticas que são populadas via gatilhos (triggers) ou rotinas agendadas (cron jobs) diariamente.

*   `analytics_daily_academy_stats`: Resumo diário por academia.
*   `analytics_partner_performance`: Contagem de cliques/vouchers por parceiro.
*   `analytics_student_economy`: Acumulado de economia por aluno.

### 4.2. Fluxo de Dados
1.  **Evento:** Aluno gera voucher.
2.  **Processamento:**
    *   Grava em `student_access_tokens` (Transacional).
    *   Trigger ou RPC incrementa contador em `analytics_partner_performance`.
    *   Calcula economia estimada e soma em `analytics_student_economy`.

### 4.3. Interface
*   **Gráficos:** Usar biblioteca leve (ex: Recharts ou Chart.js).
*   **Cards:** Componentes visuais simples com números grandes (KPIs).

---

## 5. Roadmap de Implementação (Sugestão)

*   **Fase 1 (MVP - Foco no Aluno):** Exibir "Economia Estimada" no perfil do aluno.
*   **Fase 2 (Relatório Academia):** Dashboard simples para o dono da academia ver quais parceiros estão performando.
*   **Fase 3 (Global e Inteligência):** Painel Super Admin e Mapa de Calor.

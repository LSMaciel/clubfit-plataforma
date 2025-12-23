# STORY-14C-01: Admin KPIs (Dashboard)

## 1. Descrição
Implementação dos cartões de métricas principais (KPIs) no Dashboard do Administrador da Academia, focado na "Economia Gerada" para provar o valor da plataforma.

## 2. Cenários
*   **Cenário 1 (Dashboard Diário):** Ao logar, o admin vê quanto seus alunos economizaram este mês em comparação com o mês passado.
*   **Cenário 2 (Relatório):** Admin filtra por data personalizada.

## 3. Regras de Negócio
*   **RN01 - Visibilidade:** O admin só vê dados da SUA academia (`academy_id`).
*   **RN02 - Comparativo:** Exibir delta percentual vs mês anterior (Ex: "+15% vs mês passado").

## 4. Critérios de Aceite
1.  Cards no topo do dashboard: "Economia Total", "Vouchers Gerados", "Alunos Ativos".
2.  Gráfico de linha simples mostrando evolução diária da economia.

## 5. Detalhamento Técnico
*   **Backend:** RPC `get_academy_kpis(academy_id, period)` lendo de `analytics_daily_academy_metrics`.
*   **Frontend:** Recharts para o gráfico e Cards padrão do Shadcn/UI.

## 6. Detalhamento de UX
*   **Hierarquia:** Os números devem ser grandes e legíveis.
*   **Cores:** Verde para dinheiro economizado, Azul para engajamento.

## 7. Detalhamento do Banco de Dados
*   *Leitura apenas*.

## 8. Riscos
*   **Dados Zero:** Academias novas terão gráfico vazio.
*   **Mitigação:** Empty State amigável ("Seus dados aparecerão aqui assim que o primeiro aluno economizar").

## 9. Testes
*   **T01:** Comparar soma do dashboard com soma manual da tabela de vouchers (deve bater ou estar muito próximo devido ao delay do near real-time).

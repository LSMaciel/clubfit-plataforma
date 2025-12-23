# STORY-14A-01: Tabelas Analíticas & Triggers

## 1. Descrição
Implementação da infraestrutura de banco de dados para suportar o módulo de BI. Criação de tabelas agregadoras e gatilhos (triggers) que atualizam estatísticas em "quase tempo real" (near real-time) sem onerar consultas de leitura.

## 2. Cenários
*   **Cenário 1 (Geração de Voucher):** Quando um aluno gera um voucher novo, o sistema deve incrementar automaticamente o contador de vouchers da academia e do parceiro naquele dia/mês.
*   **Cenário 2 (Novo Aluno):** Quando um aluno é criado, o contador de alunos ativos da academia deve ser incrementado.

## 3. Regras de Negócio
*   **RN01 - Atomicidade:** A atualização das estatísticas deve ocorrer na mesma transação da geração do voucher. Se o voucher falhar, a estatística não deve mudar.
*   **RN02 - Imutabilidade Histórica:** Dados de dias anteriores não devem ser alterados por triggers atuais (exceto correções manuais).

## 4. Critérios de Aceite
1.  Existência das tabelas `analytics_daily_academy_metrics` e `analytics_partner_performance` no schema público.
2.  Trigger `tr_increment_voucher_count` ativa na tabela `student_access_tokens`.
3.  Simulação de geração de 10 vouchers resultando exatamente em +10 no contador da tabela analítica.

## 5. Detalhamento Técnico
*   **Tabelas:**
    *   `analytics_daily_academy_metrics (date, academy_id, vouchers_generated, ...)`
    *   `analytics_partner_performance (month, partner_id, vouchers_generated, views)`
*   **Triggers:**
    *   `AFTER INSERT ON student_access_tokens`: Executa função `increment_analytics_vouchers()`.
    *   `increment_analytics_vouchers()`: Faz `UPSERT` (Insert on conflict update) nas tabelas analíticas incrementando `+1`.

## 6. Detalhamento de UX
*   *N/A (Backend Only)*

## 7. Detalhamento do Banco de Dados
```sql
CREATE TABLE public.analytics_daily_academy_metrics (
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    academy_id UUID REFERENCES public.academies(id),
    vouchers_generated INT DEFAULT 0,
    active_students INT DEFAULT 0,
    estimated_economy DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (date, academy_id)
);
-- Indices e RLS omitidos para brevidade
```

## 8. Riscos
*   **Concorrência (Locking):** Em alto volume, muitas escritas na mesma linha da tabela analítica podem causar *row locking*.
*   **Mitigação:** Como o volume atual é baixo, UPDATE direto é aceitável. Se escalar, usar tabela de log ("event sourcing") e processar em batch.

## 9. Testes
*   **T01:** Inserir token via SQL -> Verificar se linha foi criada/atualizada em `analytics_daily_academy_metrics`.
*   **T02:** Inserir token em data futura (teste de borda) -> Verificar comportamento do trigger.

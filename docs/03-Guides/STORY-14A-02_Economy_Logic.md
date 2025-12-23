# STORY-14A-02: Lógica de Cálculo de Economia

## 1. Descrição
Implementação da função de banco de dados (RPC/Function) responsável por calcular o valor monetário estimado de uma economia, baseada nas regras do benefício e categoria.

## 2. Cenários
*   **Cenário 1 (Desconto %):** Benefício de 10% em Pizzaria (Ticket Médio R$ 80). Economia calculada = R$ 8,00.
*   **Cenário 2 (Desconto Fixo):** Benefício de R$ 15,00 OFF. Economia calculada = R$ 15,00.
*   **Cenário 3 (Sem Ticket Médio):** Benefício de 10% em categoria sem ticket definido. Usar Default (R$ 100). Economia = R$ 10,00.

## 3. Regras de Negócio
*   **RN01 - Precedência:** Valor Fixo > Percentual sobre Ticket Categoria > Percentual sobre Ticket Default.
*   **RN02 - Persistência:** O valor calculado deve ser salvo no momento da geração do voucher (`student_access_tokens` deve ganhar coluna `economy_value`) para não mudar se o ticket médio mudar no futuro.

## 4. Critérios de Aceite
1.  Função `calculate_economy(benefit_id)` retornando valor DECIMAL correto.
2.  Tabela `student_access_tokens` com nova coluna `economy_value`.
3.  Trigger de geração de voucher atualizada para chamar esta função e salvar o valor.

## 5. Detalhamento Técnico
*   **Schema Update:**
    *   Alter table `student_access_tokens` add column `estimated_economy DECIMAL(10,2)`.
    *   Alter table `categories` add column `average_ticket DECIMAL(10,2) DEFAULT 100.00`.
*   **Function:**
    *   `fn_calculate_benefit_economy(benefit_id UUID) RETURNS DECIMAL`.
    *   Lê `benefits.type`, `benefits.configuration`, `partners.categories.average_ticket`.
    *   Aplica matemática simples.

## 6. Detalhamento de UX
*   *N/A (Backend Only)*

## 7. Detalhamento do Banco de Dados
```sql
ALTER TABLE public.categories ADD COLUMN average_ticket DECIMAL(10,2) DEFAULT 100.00;
ALTER TABLE public.student_access_tokens ADD COLUMN estimated_economy DECIMAL(10,2);
```

## 8. Riscos
*   **Complexidade de Regras:** Regras `BOGO` podem ser difíceis de estimar.
*   **Mitigação:** Para MVP, BOGO assume valor do Ticket Médio (1 item grátis = 1 ticket).

## 9. Testes
*   **T01:** Criar Benefício 20%. Categoria Ticket 50. Gerar Voucher. Verificar se `estimated_economy` = 10.00.

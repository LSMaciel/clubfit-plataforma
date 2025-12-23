# STORY-14C-02: Ranking de Parceiros

## 1. Descrição
Tabela de "Top Performers" para mostrar à academia quais parceiros estão atraindo mais atenção dos alunos.

## 2. Cenários
*   **Cenário 1 (Insight):** Admin percebe que "Loja de Suplementos X" é Top 1 há 3 meses. Ele decide fazer uma ação conjunta com essa loja.
*   **Cenário 2 (Baixa Performance):** Admin vê que "Pizzaria Y" tem 0 vouchers. Decide remover ou renegociar.

## 3. Regras de Negócio
*   **RN01 - Ordenação:** Default por Vouchers Gerados. Opção de ordenar por "Visualizações" (se implementarmos tracking de views depois).

## 4. Critérios de Aceite
1.  Tabela listando: Nome do Parceiro, Categoria, Qtd Vouchers, Valor Economizado Total.
2.  Limite: Top 10 ou 20.

## 5. Detalhamento Técnico
*   **Query:** `SELECT partner_id, SUM(vouchers) as total FROM analytics_partner_performance ... GROUP BY partner_id ORDER BY total DESC`.
*   (Join com tabela `partners` para pegar o nome).

## 6. Detalhamento de UX
*   **Tabela:** Simples, com foto do parceiro (Avatar).
*   **Ouro/Prata/Bronze:** Ícones para os top 3.

## 7. Detalhamento do Banco de Dados
*   *Leitura apenas*.

## 8. Riscos
*   **Parceiros Excluídos:** Se um parceiro for deletado, manter histórico.
*   **Mitigação:** Soft delete na tabela `partners`. O ID continua existindo nas tabelas analíticas.

## 9. Testes
*   **T01:** Gerar muitos vouchers para Parceiro A. Verificar se ele sobe para o Top 1.

# STORY-14B-02: Histórico de Uso (Extrato)

## 1. Descrição
Tela ou modal onde o aluno pode ver a lista cronológica de vouchers gerados e a economia atribuída a cada um.

## 2. Cenários
*   **Cenário 1 (Listagem):** Aluno acessa "Minhas Economias" e vê lista infinita (scroll) de vouchers.
*   **Cenário 2 (Detalhe):** Clicar no item leva ao parceiro novamente (Recompra).

## 3. Regras de Negócio
*   **RN01 - Ordenação:** Mais recentes primeiro.
*   **RN02 - Status:** Mostrar se o voucher foi Validado (pela academia/parceiro) ou se expirou (embora contemos a economia na geração, visualmente é bom distinguir).

## 4. Critérios de Aceite
1.  Nova rota `/student/wallet/history` ou modal no perfil.
2.  Listagem paginada de `student_access_tokens`.
3.  Exibição do logo do parceiro, data e valor economizado em cada item.

## 5. Detalhamento Técnico
*   **Query:** `supabase.from('student_access_tokens').select('*, benefit:benefits(*, partner:partners(*))').eq('student_id', user.id)`.

## 6. Detalhamento de UX
*   **Lista:** Similar a um extrato bancário (Nubank style), limpo, com ícone da loja à esquerda e valor verde à direita.

## 7. Detalhamento do Banco de Dados
*   *Leitura apenas*.

## 8. Riscos
*   **Performance:** Lista muito grande para alunos antigos.
*   **Mitigação:** Paginação obrigatória (20 itens por vez).

## 9. Testes
*   **T01:** Scroll infinito carregando mais itens.

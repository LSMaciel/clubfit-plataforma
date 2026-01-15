# STORY-011-02: Server Action de Importação e Feedback

**Vinculado ao Projeto:** PROJ-011

## 1. Descrição e Objetivos
*   **Ator:** Sistema.
*   **Objetivo:** Receber a lista limpa do frontend e persistir no banco de dados com segurança.
*   **Valor:** Inserir dados em massa com performance e integridade.

## 2. Regras de Negócio & Critérios de Aceite
1.  [ ] Deve receber `academy_id` do contexto (cookie ou auth user).
2.  [ ] Deve limpar CPF (remover `.`, `-`) antes de tentar inserir.
3.  [ ] Deve retornar um relatório JSON: `{ total: number, success: number, errors: Array<{ row: number, msg: string }> }`.
4.  [ ] Não deve parar na primeira falha (tentar inserir todos, reportar falhas).

## 3. Detalhamento Técnico
*   **Arquivos Afetados:**
    *   `[MOD] app/admin/(authenticated)/students/actions.ts` (Adicionar `importStudents`).
*   **Lógica:**
    *   `Promise.allSettled` ou loop sequencial (melhor batch insert do Supabase com `ignoreDuplicates` se quisermos performance, mas para relatório detalhado de erros, inserção um a um ou em pequenos batches é melhor para saber QUEM falhou).
    *   *Decisão:* Para 500 linhas, `insert` em lote é rápido. O problema é saber qual falhou se for Constraint Violation. Melhor: Fazer check prévio de CPFs existentes?
    *   *Estratégia:* Enviar lista -> Backend busca CPFs existentes na academia -> Filtra -> Insere novos -> Retorna relatório "X inseridos, Y já existiam".

## 4. Riscos e Mitigações
*   **Risco:** Timeout da Vercel (10s na Free tier) se for loop lento.
*   **Mitigação:** Como o limite é 500, um batch insert único é muito rápido (<1s). Faremos validação de duplicidade (SELECT CPFs) + Batch Insert.

## 5. Cenários de Teste
1.  Enviar lista com 2 CPFs novos e 1 existente.
2.  **Resultado:** 2 inseridos, 1 erro/aviso "Já cadastrado".

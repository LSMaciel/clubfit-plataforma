# STORY-PERF-00-02: Otimização de Índices (Banco de Dados)

**Vinculado ao Projeto:** PROJ-PERF-01

## 1. Descrição e Objetivos
*   **Ator:** DBA / Backend Dev.
*   **Objetivo:** Criar índices de performance nas tabelas críticas identificadas na auditoria de RLS.
*   **Valor:** Reduzir o custo de CPU do banco de dados e acelerar queries que fazem joins com `academy_partners`.

## 2. Diagnóstico Técnico
A auditoria revelou que muitas Policies fazem subqueries na tabela `academy_partners` para verificar se o usuário tem acesso.
Como essa tabela é o elo "N:N" entre Academias e Parceiros, ela é consultada o tempo todo. A falta de índices combinados força o banco a fazer "Scan Sequencial".

## 3. Solução Proposta (Script SQL)
Criar um script de migração `008_perf_indexes.sql` que adiciona:

1.  **Índice Composto em Academy Partners:**
    *   `idx_academy_partners_link`: `(academy_id, partner_id)`
    *   *Motivo:* Acelera verificação de existência (`WHERE academy_id = X AND partner_id = Y`).

2.  **Índice em Users:**
    *   `idx_users_academy_role`: `(academy_id, role)`
    *   *Motivo:* Acelera as policies que checam `users.academy_id = X AND users.role = 'ADMIN'`.

3.  **Índice em Benefits:**
    *   `idx_benefits_partner`: `(partner_id, status)`
    *   *Motivo:* Acelera listagem de benefícios ativos.

## 4. Detalhamento Implementação
*   **Arquivo:** `docs/02-System/migration_scripts/008_perf_indexes.sql`
*   **Conteúdo:** Comandos `CREATE INDEX IF NOT EXISTS CONCURRENTLY` (se suportado) ou padrão.

## 5. Critérios de Aceite
1.  [ ] O script deve rodar sem erros no Supabase.
2.  [ ] O `EXPLAIN ANALYZE` da query de parceiros deve mostrar uso de "Index Scan" em vez de "Seq Scan".
3.  [ ] Tempo de execução de queries complexas deve cair pelo menos 40%.

## 6. Riscos
*   **Bloqueio de Tabela:** Criar índice em tabela grande pode travar escritas.
    *   **Mitigação:** Como o volume atual é baixo/médio, o risco é baixo. Em produção massiva, usaríamos `CONCURRENTLY`.

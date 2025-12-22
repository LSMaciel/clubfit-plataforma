# EPIC-06A: Migração Estrutural (Banco de Dados)

**Projeto:** PROJ-006 (Global Partners)
**Status:** 🟡 Planejamento

## 1. Descrição
Execução das alterações profundas no banco de dados para suportar o modelo N:N entre Academias e Parceiros. Este épico é a fundação para todo o projeto e deve ser executado com extremo cuidado para não corromper dados existentes.

## 2. Histórias de Usuário

### STORY-001: Refatoração de Schema (Partners N:N)
**Como:** DBA / Tech Lead
**Quero:** Alterar a tabela `partners` e criar `academy_partners`
**Para:** Permitir que um parceiro seja vinculado a múltiplas academias.

#### Critérios de Aceite
1.  Tabela `academy_partners` criada conforme especificação.
2.  Script de migração preserva todos os vínculos existentes (para cada linha em `partners` antiga, criar uma linha em `academy_partners` com a `academy_id` original).
3.  Coluna `academy_id` removida da tabela `partners` (APÓS garantir a migração dos dados).
4.  Campo `cnpj` adicionado a `partners`.

#### Detalhamento Técnico (SQL Plan)
1.  `CREATE TABLE academy_partners (...)`
2.  `INSERT INTO academy_partners (academy_id, partner_id, status) SELECT academy_id, id, 'ACTIVE' FROM partners;`
3.  `ALTER TABLE partners DROP COLUMN academy_id;` (CUIDADO: Isso quebra RLS e Views, fazer em transação junto com STORY-002).

---

### STORY-002: Atualização de RLS Policies
**Como:** Tech Lead
**Quero:** Atualizar as políticas de segurança do Supabase
**Para:** Garantir que a Academia só veja parceiros que estão na tabela de vínculo e que Alunos só vejam parceiros vinculados à sua academia.

#### Regras de Negócio
1.  **Select Partners (Academy Admin):** `auth.uid()` -> `users.academy_id` -> `academy_partners.academy_id` -> `partners.id`.
2.  **Select Benefits (Student):** `students.academy_id` -> `academy_partners.academy_id` -> `partners.id` -> `benefits.partner_id`.

#### Cenários de Teste (SQL)
1.  *Setup:* Academia A vinculada ao Parceiro P1. Academia B sem vínculo.
2.  *Teste 1:* Admin da Academia A faz `SELECT * FROM partners`. Deve retornar P1.
3.  *Teste 2:* Admin da Academia B faz `SELECT * FROM partners`. Deve retornar vazio.
4.  *Teste 3:* Aluno da Academia A busca benefícios. Deve ver benefícios de P1.

#### Detalhamento de Banco de Dados
*   Revisar policies em `partners`, `benefits`, `benefit_usages`.

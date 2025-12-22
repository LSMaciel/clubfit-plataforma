# EPIC-07A: Estrutura de Dados e Lógica Core (Financeiro)

**Projeto:** PROJ-007 (Controle Financeiro)
**Status:** 🟡 Planejamento

## 1. Descrição
Implementação dos alicerces do controle financeiro: a tabela de banco de dados `subscriptions` e as regras de negócio de bloqueio e status.

## 2. Histórias de Usuário

### STORY-001: Modelagem de Assinaturas (Tabela)
**Como:** DBA
**Quero:** Criar a tabela `subscriptions`
**Para:** Armazenar os contratos e status de pagamento das academias.

#### Critérios de Aceite
1.  Tabela `subscriptions` criada com campos: `academy_id` (PK, FK), `status`, `payment_status`, `plan_value`, `next_payment_date`.
2.  Trigger (opcional) ou lógica de inserção que garanta que toda nova Academia criada JÁ nasça com um registro em `subscriptions` (mesmo que status DRAFT).

#### Detalhamento Técnico (SQL)
*   `CREATE TYPE subscription_status ...`
*   `CREATE TYPE payment_status ...`
*   `CREATE TABLE subscriptions ...`
*   RLS: Apenas Super Admin pode ler/escrever nesta tabela. Admin da Academia pode apenas LER seu próprio registro.

---

### STORY-002: Lógica de Bloqueio (Middleware/Core)
**Como:** Tech Lead
**Quero:** Que o sistema bloqueie o acesso de academias suspensas
**Para:** Impedir uso da plataforma por inadimplentes.

#### Regras de Negócio
1.  **Bloqueio de Admin:** Ao tentar logar (`auth.signIn`), verificar status. Se `SUSPENDED`, retornar erro "Acesso Suspenso".
2.  **Bloqueio de Aluno:** Na server action `generateVoucher`, verificar `subscription.status`.

#### Detalhamento Técnico
*   Criar função utilitária `checkAcademyStatus(academyId)`.
*   Inserir chamada dessa função nos pontos críticos.
*   *Nota:* Não bloquear leitura de dados históricos se possível, apenas ações de escrita/novas transações (Decisão de Produto: Neste MVP, bloqueio total de login é mais simples e efetivo).

#### Cenários de Teste
1.  Setar academia como `SUSPENDED` no banco.
2.  Tentar logar como Admin -> Falha esperada.
3.  Tentar gerar voucher como Aluno -> Falha esperada.

# PROJ-006: Base Unificada de Parceiros (Global Partners)

**Status:** 🟡 Planejamento
**Responsável:** Tech Lead System
**Data de Criação:** 2025-12-19

## 1. Descrição do Projeto
Atualmente, a arquitetura do ClubFit trata os parceiros (estabelecimentos) como entidades exclusivas de uma academia (`partners.academy_id`). Isso gera duplicidade de dados quando múltiplas academias possuem convênio com o mesmo estabelecimento e impede que o parceiro tenha uma visão consolidada de seu desempenho.

Este projeto visa refatorar o núcleo da plataforma para desacoplar `partners` de `academies`, transformando a relação em **Muitos-para-Muitos (N:N)**. O parceiro passará a ser uma entidade global no ecossistema, podendo ser "importado" ou "vinculado" por múltiplas academias.

## 2. Regras de Negócio

### 2.1. Entidade e Unicidade
*   **RN01 - Unicidade do Parceiro:** Um estabelecimento deve ser único na plataforma. A identificação primária será pelo **CNPJ**. Para parceiros informais, usaremos uma chave composta (Normalização do Nome + Cidade).
*   **RN02 - Propriedade do Registro:** O registro do parceiro pertence ao sistema (Global), mas pode ter sido originado por uma academia específica. O usuário "Dono do Parceiro" (`owner_id`) administra os dados cadastrais e as promoções.

### 2.2. Relacionamento e Vínculo
*   **RN03 - Vínculo Explicito:** Uma academia só exibe parceiros que estejam explicitamente vinculados a ela na tabela associativa.
*   **RN04 - Bloqueio Unilateral:** Uma academia pode `BLOQUEAR` (Status: `INACTIVE`) a exibição de um parceiro para seus alunos a qualquer momento, sem afetar o status do parceiro nas outras academias.
*   **RN05 - Benefícios Compartilhados:** As promoções (`benefits`) criadas pelo parceiro são visíveis para *todas* as academias vinculadas ativas, salvo se implementarmos filtros de visibilidade futuros (fora do escopo deste projeto).

### 2.3. Migração
*   **RN06 - Deduplicação Segura:** Durante a migração, parceiros com mesmo CNPJ devem ser fundidos. Se houver conflito de dados (ex: nomes diferentes), prevalece o registro mais recente ou com mais uso.

## 3. Critérios de Aceite (DoD)
1.  **Database Refatorado:** Tabela `partners` sem coluna `academy_id`. Nova tabela `academy_partners` criada e populada.
2.  **RLS Atualizado:** Políticas de segurança garantem que a Academia só vê parceiros vinculados e o Parceiro vê dados agregados.
3.  **Fluxo de Vínculo:** Admin da Academia consegue buscar um parceiro global (por Nome/CNPJ) e criar o vínculo.
4.  **Fluxo de Cadastro:** Ao tentar cadastrar um novo parceiro, o sistema verifica existência prévia antes de criar.
5.  **Área do Aluno Preservada:** O aluno continua vendo a lista de parceiros da sua academia sem alterações visuais ou funcionais.

## 4. Detalhamento Técnico

### 4.1. Alterações de Banco de Dados
A tabela `partners` sofre *breaking changes*.
*   **Remover:** `academy_id` (FK).
*   **Adicionar:** `cnpj` (Unique, Nullable para legados), `search_vector` (para busca performática).

**Nova Tabela: `academy_partners`**
*   `id` (PK)
*   `academy_id` (FK) -> Quem vinculou.
*   `partner_id` (FK) -> Quem foi vinculado.
*   `status` (Enum: `ACTIVE`, `INACTIVE`) -> Controle da academia.
*   `created_at` -> Data do vínculo.

### 4.2. Fluxo da Aplicação
*   **Busca de Parceiros:** A query de listagem passa a fazer JOIN em `academy_partners` filtrando por `academy_id` do contexto e `status = ACTIVE`.
*   **Cadastro:** O formulário de cadastro de parceiro primeiro faz uma busca RPC (`check_partner_exists`). Se encontrar, sugere vínculo. Se não, insert em `partners` + insert em `academy_partners`.

## 5. Detalhamento de UX

### 5.1. Admin da Academia
*   **Tela "Meus Parceiros":**
    *   Botão principal muda de "Novo Parceiro" para **"Adicionar Parceiro"**.
    *   Modal/Tela de Adição: Input de busca "Busque por Nome ou CNPJ".
    *   Resultados da busca mostram cards:
        *   Se já vinculado: Botão "Desvincular" ou label "Já vinculado".
        *   Se existe mas não vinculado: Botão "Vincular".
        *   Se não existe: Botão "Cadastrar Novo Parceiro" (leva ao form clássico).

### 5.2. Admin do Parceiro
*   **Dashboard:** Pode exibir métricas como "Total de Academias Vinculadas: 3".

## 6. Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Quebra de RLS (Segurança):** Dados de parceiros vazarem para academias não vinculadas. | Alta | Crítico | Testes exaustivos nas policies PostgreSQL (testar acesso negativo). |
| **Duplicidade de Cadastro Legado:** Migração falhar em identificar duplicatas por variação de nome (ex: "Pizzaria X" vs "Pizzaria X Ltda"). | Média | Médio | Script de migração usar `fuzzy matching` ou fazer migração em etapas (primeiro exatos, depois manual). Para este projeto, faremos apenas CNPJ exato. Sem CNPJ, mantém duplicado. |
| **Conflito de Dono:** Dois usuários diferentes gerenciavam as "duas versões" da mesma pizzaria. | Baixa | Alto | Na fusão, manter ambos como admins ou notificar intervenção manual do Super Admin. No MVP, manteremos o `owner_id` do registro mais antigo/principal. |

---

## 7. Estrutura de Épicos

1.  **EPIC-06A: Migração Estrutural (Banco de Dados)**
    *   Foco exclusivamente backend: Alterar tabelas, criar scripts de migração de dados e reescrever as policies RLS.
2.  **EPIC-06B: Gestão de Vínculos (Frontend Admin)**
    *   Implementar a interface de busca global e a lógica de "Vincular vs Criar".
3.  **EPIC-06C: Adaptação das Consultas (Aluno & Dashboards)**
    *   Refatorar as queries da API do Aluno e Dashboard para respeitar a nova estrutura N:N.

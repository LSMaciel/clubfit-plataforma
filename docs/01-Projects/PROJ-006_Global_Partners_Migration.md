# PROJ-006: Base Unificada de Parceiros (Global Partners)

**Status:** 🟡 Planejamento
**Responsável:** Tech Lead System
**Última Atualização:** 24/12/2025

---

## 1. Visão Geral

### Nome
Base Unificada de Parceiros (Global Partners)

### Descrição
Refatoração estrutural para transformar a entidade `partners` em um recurso global do sistema (Multi-tenant Shared), desacoplando-a da tabela `academies`. Isso permite que um único estabelecimento (ex: "Madero") seja compartilhado por múltiplas academias (ex: "Ironberg", "SmartFit") através de uma relação N:N, mantendo dados cadastrais únicos e centralizados, mas permitindo gestão de vínculo independente. Adicionalmente, habilita o Super Admin a gerenciar essa base globalmente.

---

## 2. Regras de Negócio

*   **RN01 - Unicidade Global:** O parceiro deve ser único na plataforma, identificado primariamente pelo CNPJ.
*   **RN02 - Propriedade do Registro:** Todo parceiro possui um `owner_id` (usuário responsável), que pode ser um Super Admin ou um Academy Admin que originou o cadastro.
*   **RN03 - Vínculo Explícito:** Uma academia só pode exibir aos seus alunos os parceiros que estejam explicitamente vinculados na tabela `academy_partners` com status `ACTIVE`.
*   **RN04 - Gestão de Vínculo:** Uma academia pode bloquear (`INACTIVE`) ou desbloquear (`ACTIVE`) um parceiro a qualquer momento, sem afetar o cadastro original ou vínculos com outras academias.
*   **RN05 - Visibilidade de Benefícios:** As promoções (`benefits`) são criadas pelo parceiro e herdadas automaticamente por todas as academias vinculadas.
*   **RN06 - Autonomia do Super Admin:** O Super Admin pode criar parceiros "órfãos" (sem vínculo inicial) e posteriormente vinculá-los a qualquer academia.

---

## 3. Critérios de Aceite (DoD)

1.  A tabela `partners` não deve possuir a coluna `academy_id`.
2.  Existe uma tabela intermediária `academy_partners` controlando o relacionamento N:N.
3.  As políticas de segurança (RLS) impedem que uma academia veja dados de parceiros não vinculados (exceto na busca global).
4.  O Super Admin consegue cadastrar, editar e excluir parceiros globais via `/admin/super`.
5.  O Admin da Academia consegue buscar parceiros na base global (por Nome/CNPJ) e criar o vínculo.
6.  O Aluno continua visualizando a lista de parceiros corretamente, sem duplicatas.

---

## 4. Detalhamento Técnico

### Banco de Dados
*   **Tabela `partners` (Refactor):**
    *   Remover FK `academy_id`.
    *   Adicionar `cnpj` (Unique).
    *   Adicionar Índices GIN em `name` e `search_vector` para busca full-text.
*   **Tabela `academy_partners` (Nova):**
    *   `id` (PK UUID)
    *   `academy_id` (FK UUID)
    *   `partner_id` (FK UUID)
    *   `status` (Enum: 'ACTIVE', 'INACTIVE')
    *   `created_at` (Timestamp)

### API / Backend
*   **Server Actions:**
    *   `searchGlobalPartners(query)`: Retorna parceiros globais (público para admins).
    *   `linkPartnerToAcademy(partnerId, academyId)`: Cria registro na associativa.
    *   `createGlobalPartner(data)`: Cria parceiro (com verificação de duplicidade).

---

## 5. Detalhamento de UX

### Super Admin (`/admin/super`)
*   **Catálogo Global:** Listagem com filtro avançado.
*   **Detalhe do Parceiro:** Abas "Dados Cadastrais", "Promoções", "Academias Vinculadas".
*   **Ação de Vínculo:** Modal para selecionar Academia e realizar o vínculo manual.

### Academy Admin (`/admin/partners`)
*   **Meus Parceiros:** Apenas lista os vinculados.
*   **Adicionar Parceiro:**
    *   Input de busca global (Autocomplete).
    *   Se encontrar: Card com botão "Vincular".
    *   Se não encontrar: Botão "Cadastrar Novo" (Cria Global + Vincula Auto).

---

## 6. Riscos e Mitigação

| Risco | Impacto | Mitigação |
| :--- | :--- | :--- |
| **Vazamento de Dados (RLS)** | Crítico | Implementar testes automatizados de RLS (Negative Tests) para garantir isolamento. |
| **Duplicidade de CNPJ** | Alto | Unique Constraint no banco e validação prévia no formulário (Debounce Search). |
| **Performance na Busca** | Médio | Criar índices adequados e limitar resultados da busca global (ex: mín 3 chars). |

---

## 7. Estrutura de Épicos e Histórias

### EPIC-06A: Migração Estrutural (Banco de Dados)
Refatoração da camada de dados para suportar o modelo N:N.

#### 1. STORY-001: Schema Refactoring
*   **Descrição:** Alterar a estrutura física das tabelas `partners` e criar `academy_partners`.
*   **Regras de Negócio:** RN01, RN02.
*   **Critérios de Aceite:**
    *   Tabela `partners` limpa de `academy_id`.
    *   Tabela `academy_partners` criada.
    *   Script de migração preserva dados existentes (migrando vínculos para a nova tabela).
*   **Detalhamento Técnico:** SQL Migration Transactional.
*   **Riscos:** Perda de vínculo de parceiros existentes. (Mitigação: Backup + Rodar em Staging).
*   **Cenários de Teste:** Verificar se parceiro X da academia Y continua acessível via join após migração.

#### 2. STORY-002: RLS Policies Update
*   **Descrição:** Atualizar as regras de Row Level Security para o novo modelo.
*   **Regras de Negócio:** RN03.
*   **Critérios de Aceite:**
    *   Academy Admin só vê parceiros na `partners` se houver match na `academy_partners`.
*   **Detalhamento Técnico:** `CREATE POLICY` usando `EXISTS`.
*   **Riscos:** Bloqueio total de acesso.
*   **Cenários de Teste:** Tentar selecionar parceiros de outra academia (deve retornar vazio).

---

### EPIC-06B: Gestão de Vínculos (Frontend Admin)
Interface para o administrador da academia gerenciar sua rede.

#### 3. STORY-003: Global Partner Search
*   **Descrição:** Componente de busca para encontrar parceiros na base global.
*   **Regras de Negócio:** RN01.
*   **Critérios de Aceite:**
    *   Input busca por Nome e CNPJ.
    *   Retorna indicativo se já é vinculado ou não.
*   **UX:** Autocomplete responsivo.

#### 4. STORY-004: Academy-Partner Link Logic
*   **Descrição:** Ação de vincular um parceiro existente à academia logada.
*   **Regras de Negócio:** RN03, RN04.
*   **Critérios de Aceite:**
    *   Ao clicar em vincular, insere em `academy_partners`.
    *   Atualiza a lista local instantaneamente.
*   **Detalhamento Técnico:** Server Action `linkPartner`.

---

### EPIC-06C: Query Adaptation
Garantir que o app do aluno continue funcionando.

#### 5. STORY-006: Student API Update
*   **Descrição:** Atualizar queries do App do Aluno para usar a tabela associativa.
*   **Critérios de Aceite:** Lista de benefícios no app carrega sem erros.

---

### EPIC-06D: Super Admin Management
Gestão centralizada da plataforma.

#### 6. STORY-007: Super Admin Global CRUD
*   **Status:** [/] In Progress
*   **Regras de Negócio:** RN06.
*   **Critérios de Aceite:**
    *   Criar parceiro sem vincular a ninguém.
    *   Editar dados cadastrais (CNPJ/Nome) de qualquer parceiro.
*   **UX:** Formulário idêntico ao da academia, mas sem o contexto de `academy_id`.

#### 7. STORY-008: Super Admin Link Management
*   **Descrição:** Interface para o Super Admin gerenciar quais academias estão vinculadas a um parceiro.
*   **Regras de Negócio:** RN04, RN06.
*   **Critérios de Aceite:**
    *   Visualizar lista de academias vinculadas a um parceiro.
    *   Adicionar/Remover vínculo manualmente pelo painel Super.
*   **UX:** Modal com Select de Academias dentro do Detalhe do Parceiro.

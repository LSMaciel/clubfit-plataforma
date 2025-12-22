# PROJ-008: Relatórios Operacionais e Gestão (Academia)

**Status:** 🟡 Planejamento
**Responsável:** Tech Lead System
**Data de Criação:** 2025-12-19

## 1. Descrição do Projeto
Este projeto foca em empoderar o Administrador da Academia com ferramentas de controle e inteligência. Atualmente, a academia não consegue bloquear alunos inadimplentes (o acesso é eterno) e não tem visibilidade sobre quais parceiros estão gerando mais valor.
Além disso, fornece ao Super Admin indicadores agregados de saúde da plataforma para complementar a visão financeira do PROJ-007.

## 2. Regras de Negócio

### 2.1. Gestão de Alunos
*   **RN01 - Bloqueio de Acesso:** A academia pode alterar o status de um aluno para `INACTIVE` a qualquer momento.
*   **RN02 - Efeito do Bloqueio:** Alunos inativos **não conseguem gerar novos vouchers**. O login pode continuar permitido para consulta de histórico, mas a ação principal (gerar desconto) deve ser barrada. Mensagem: "Seu cadastro está inativo nesta academia. Procure a recepção."
*   **RN03 - Reativação:** A reativação é manual e imediata.

### 2.2. Relatórios e Dashboards
*   **RN04 - Visibilidade de Dados:** A academia vê apenas os dados de uso (`benefit_usages`) gerados pelos **seus** alunos.
*   **RN05 - Métricas Chave (Academia):**
    *   *Economia Estimada:* (Opcional futuro) Se o benefício tiver valor monetário.
    *   *Engajamento:* Número de vouchers validados (uso real) vs gerados.

## 3. Critérios de Aceite (DoD)
1.  **Listagem de Alunos:** Tabela com busca por Nome/CPF e coluna de Status (Badge) + Switch/Botão de Ação.
2.  **Dashboard da Academia:**
    *   Gráfico de Barras: "Vouchers Validados por Mês" (Últimos 6 meses).
    *   Ranking: "Top 5 Parceiros" (Onde meus alunos mais vão).
3.  **Dashboard do Super Admin:**
    *   KPI: Total de Vouchers Validados (Mês Atual) em toda a plataforma.
    *   KPI: Total de Academias Ativas.
    *   KPI: Total de Alunos Cadastrados.

## 4. Detalhamento Técnico

### 4.1. Banco de Dados
*   **Tabela `students`:** Garantir existência da coluna `status` (Texto ou Enum: 'ACTIVE', 'INACTIVE'). (Já existe no schema v1, verificar se está sendo usada).
*   **Tabela `feature_flags` (Opcional):** Se precisarmos de controles mais granulares no futuro. Por enquanto, usar colunas diretas nas tabelas.

### 4.2. Frontend (Gráficos)
*   **Biblioteca:** Utilizar `Recharts` ou `Chart.js` (Shadcn/ui recomenda Recharts).
*   **Componentes:**
    *   `BarChart` para volume de uso temporal.
    *   `List/Table` compacta para ranking.

### 4.3. Performance
*   **Consultas Analíticas:** As queries de dashboard devem usar `count` e `group by`.
*   **Indexação:** Verificar se `benefit_usages` tem índice em `validated_obj` e `academy_id` para não deixar o dashboard lento conforme o histórico cresce.

## 5. Detalhamento de UX

### 5.1. Tela de Alunos
*   **Filtros:** "Todos", "Ativos", "Inativos".
*   **Busca:** Input de texto simples.
*   **Ação Rápida:** Um `Switch` (Toggle) na própria linha da tabela para ativar/desativar agiliza o processo da recepção.

### 5.2. Dashboard (Home da Academia)
*   Mover a mensagem de boas-vindas para um header menor.
*   Dar destaque aos números: "X Vouchers usados este mês".

## 6. Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Lentidão no Dashboard:** Queries de agregação pesadas com muitos dados. | Baixa (inicial) | Médio | Criar Views materializadas ou cachear resultados por 1h se o volume escalar. Para MVP, query direta resolve. |
| **Erro de Operação:** Recepcionista inativar aluno errado. | Média | Baixo | Adicionar "Toast" de confirmação com botão de "Desfazer" imediato ou confirmação simples. |

---

## 7. Estrutura de Épicos

1.  **EPIC-08A: Gestão de Alunos (Controle de Acesso)**
    *   Implementação da listagem com ações de bloqueio/desbloqueio e a trava na geração do voucher.
2.  **EPIC-08B: Dashboards e Business Intelligence**
    *   Implementação dos gráficos e KPIs tanto para Academia quanto para Super Admin.

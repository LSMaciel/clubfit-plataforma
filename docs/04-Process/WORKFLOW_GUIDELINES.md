# Diretrizes de Fluxo de Trabalho e Governança

> "Documentar primeiro, codar depois. Cirúrgico sempre."

Este arquivo contém as **Regras de Ouro** que regem o desenvolvimento do projeto ClubFit. O não cumprimento destas regras resultará em rejeição imediata da tarefa.

---

## 1. Regras de Engajamento (Princípios Fundamentais)

1.  **Primeiro a Especificação, Depois o Código:** Nunca escrever uma linha de código funcional sem um plano documentado (`PROJ-XXX` ou `STORY-XXX`) aprovado.
2.  **Desenvolvimento Apenas com Aprovação:** Só gerar código final após um "De acordo" explícito sobre o plano.
3.  **Alterações Cirúrgicas (Diffs):** Sempre propor a mudança exata (linhas a adicionar/remover). Evitar reescrever arquivos inteiros se apenas uma função mudou.
4.  **Documentação é Responsabilidade da IA:** Ao final de cada tarefa, a IA deve sugerir atualizações para o `CHANGELOG` e `00-INDEX.md`.
5.  **Pesquisa Obrigatória:** Sempre verificar a estrutura existente e o banco de dados antes de propor soluções.
6.  **Análise Prévia:** Antes de desenvolver, analisar o impacto da mudança no sistema como um todo.
7.  **Micro-Contexto:** Nunca misturar contextos. Mantenha o código modular e isolado.

---

## 2. Ciclo de Vida do Desenvolvimento

### Etapa 1: Definição (O quê)
O PO (Product Owner) ou Tech Lead define a necessidade macro.

### Etapa 2: Projeto Detalhado (Como Macro)
Criação de um documento `docs/01-Projects/PROJ-XXX_Nome.md`.
*   Deve conter: Regras de Negócio específicas, UX/UI, Critérios de Aceite.
*   **Gate de Aprovação:** O código só começa após este doc estar pronto.

### Etapa 3: Quebra em Histórias (Granularidade)
Detalhamento em `docs/03-Guides/STORY-XXX.md` (opcional para tarefas pequenas, obrigatório para complexas).

### Etapa 4: Desenvolvimento Cirúrgico
Execução do código seguindo estritamente o aprovado.

---

## 3. Nomenclatura Padrão

*   **Projetos:** `PROJ-001_NomeDoProjeto` (ex: `PROJ-001_MVP`)
*   **Épicos:** `EPIC-001_NomeDoEpico`
*   **Histórias:** `STORY-001_NomeDaHistoria`

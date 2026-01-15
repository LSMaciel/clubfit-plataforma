# Prompt de Preparação de História (SaaS ClubFit)

Use este prompt para iniciar o planejamento detalhado de uma História (STORY-XXX) específica.

**Objetivo:** Planejar a implementação da `STORY-[NUMERO]: [NOME]` dentro do projeto `PROJ-[NOME]`.
**Meta:** Integrar esta funcionalidade ao ecossistema SaaS ClubFit minimizando regressões e mantendo a integridade do Multi-tenant.

**REGRAS DE OURO:**
1.  **Não desenvolva código ainda.**
2.  **Siga o fluxo de governança estrito.**
3.  **Responsabilidade Única (SRP):** Planeje arquivos com no máximo 250 linhas.

---

## 1. Aquisição de Contexto (Leitura Obrigatória)
Analise os arquivos do projeto na seguinte ordem para garantir que a implementação não cause regressões:

1.  **Governança:** `docs/04-Process/WORKFLOW_GUIDELINES.md`
    *   *Foco:* Regras de 250 linhas, padrão de commits e hierarquia de decisão.
2.  **Arquitetura e Fluxo:** `PROJECT_SPEC.md`
    *   *Foco:* Entender se a feature pertence ao Painel Admin (`/admin`) ou Portal do Aluno (`/[slug]`).
3.  **Regras de Negócio:** `docs/02-System/BUSINESS_RULES.md`
    *   *Foco:* Permissões (RBAC), Multi-tenancy e validações de input.
4.  **Contrato de Dados:** `docs/02-System/DATABASE_ARCHITECTURE.md`
    *   *Foco:* Estrutura de tabelas e RLS existente.
5.  **Mapa do Módulo (Elemento):** `[CAMINHO_DA_PASTA]/README.md`
    *   *Exemplo:* Se a história for sobre Alunos, leia `app/admin/students/README.md`. Se não existir, seu primeiro passo no plano será criá-lo.

---

## 2. Elaboração do Plano de Implementação (Blueprint Técnico)
Apresente um plano detalhado contendo:

### A. Análise de Impacto
*   **Arquivos Afetados:** Listar paths absolutos dos arquivos a criar ou modificar.
*   **Estado Global:** Alterações necessárias em Contexts, Hooks globais ou Server Actions.
*   **Componentização:** Liste os novos componentes que serão criados para respeitar o SRP (max 250 linhas).

### B. Plano de Dados & Persistência
*   **Schema SQL:** O código SQL exato para criar tabelas, colunas ou funções (RPC) necessárias.
*   **Segurança (RLS):** Policies necessárias para garantir que uma academia não veja dados da outra.
*   *Nota:* Eu (Usuário) rodarei os scripts no Supabase e te trarei o feedback. Não rode migrations sem aprovação.

### C. Detalhamento de UX/UI (Estética ClubFit Premium)
*   **Componentes Shadcn/UI:** Quais componentes da biblioteca serão reutilizados (ex: `Button`, `Card`, `Dialog`).
*   **Ícones:** Quais ícones do Lucide serão usados.
*   **Estados de Interface (Feedback):**
    *   *Loading:* Onde entrarão os Skeletons?
    *   *Error:* Como erros de validação serão mostrados (Toasts ou Inline)?
    *   *Empty:* O que mostrar se não houver dados?

---

## 3. Cenários de Teste (Validação)
Crie um passo a passo para validarmos a entrega:

*   **Teste de Integridade:** Como verificar se o dado foi salvo corretamente no banco (via UI ou SQL).
*   **Teste de Regressão:** O que *não* deve ter quebrado com essa mudança?
*   **Teste de UI:** Verificação visual em Mobile vs Desktop.

---

## 4. Atualização de Documentação Viva
Liste quais arquivos em `docs/` serão atualizados para refletir essa nova capacidade do sistema.
*   *Exemplo:* Atualizar o `task.md` marcando a história como `[/]`.
*   *Exemplo:* Atualizar o `README.md` da pasta do módulo.

**IMPORTANTE:** Você não tem acesso direto ao banco de dados de produção. Se precisar de informações atuais das tabelas, gere o SQL de consulta. **Não escreva código de aplicação (React/Next.js) até que eu aprove este plano.**

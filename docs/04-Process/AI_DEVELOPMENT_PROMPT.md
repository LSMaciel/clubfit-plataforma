# Prompt de Execução de Desenvolvimento (SaaS ClubFit)

**Gatilho:** Use este prompt APÓS a aprovação do plano gerado pelo `AI_STORY_PREP_PROMPT.md`.
**Objetivo:** Executar o desenvolvimento técnico da `STORY-[NUMERO]` com precisão cirúrgica.

---

## 1. Sincronização de Contexto Final
Antes de gerar o código, revise os contratos definidos em:
*   `types.ts` ou arquivos de tipos locais do módulo (Para garantir integridade de dados).
*   `PROJECT_SPEC.md` (Para manter o fluxo de dados correto entre Client/Server).
*   `[CAMINHO_DO_MODULO]/README.md` (Para respeitar as regras locais da pasta).

## 2. Entrega de Documentação (Documentação Viva)
**CRÍTICO:** Atualize os arquivos de documentação para refletir as mudanças desta história.
1.  **Atualizar `task.md`:** Marque os itens concluídos com `[x]`.
2.  **Atualizar `[CAMINHO_DO_MODULO]/README.md`:** Se criou arquivos novos ou mudou a lógica, atualize este mapa.
3.  **Atualizar `docs/02-System/DATABASE_ARCHITECTURE.md`:** Se houve alteração de banco.

## 3. Plano de Banco de Dados e Persistência
Gere o Script SQL completo para ser executado no Supabase. O script deve:
*   Ser idempotente (usar `CREATE TABLE IF NOT EXISTS`, `DO $$ BEGIN...`).
*   Incluir as políticas de RLS (`CREATE POLICY`) obrigatórias para Multi-tenancy.
*   Incluir comentários nas colunas (`COMMENT ON COLUMN...`) explicando o propósito.

## 4. Produção de Código (Obrigatório no Chat)
Forneça o código atualizado seguindo o padrão **Next.js 14 App Router + TypeScript**.
*   **SRP Extremo:** NENHUM arquivo pode passar de **250 linhas**.
*   **Server Actions:** Isole a lógica de banco em `actions.ts`.
*   **Componentes:** Use Shadcn/UI para interface.
*   **Cirúrgico:** Ao alterar arquivos existentes, mostre apenas o diff ou o arquivo completo se for pequeno. Não quebre rotas existentes.

## 5. Protocolo de Teste Final
Liste o passo a passo dos cenários de teste que devo realizar para validar:
1.  **Funcionalidade:** O fluxo principal funciona?
2.  **Persistência:** O dado sobrevive ao refresh (F5)?
3.  **Responsividade:** O layout quebra no mobile?

---

**ESTOU AGUARDANDO:**
1.  A lista de documentos atualizados (`task.md`, `READMEs`).
2.  O Código SQL para o banco (se houver).
3.  O Código TypeScript/React das alterações.
4.  Os cenários de teste manuais.

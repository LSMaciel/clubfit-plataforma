# EPIC-01: Saneamento e Estabilização

**Projeto:** FIX-001 (Resgate do Estagiário)
**Status:** Planejamento

## 1. Descrição
Foco na eliminação de erros de build, warnings de console, tipos incorretos e padronização "clean code".

## 2. Histórias de Usuário (Técnicas)

### STORY-006: Correção de Build e Types
**Como:** Tech Lead
**Quero:** Que o projeto compile sem erros ou warnings no terminal
**Para:** Garantir que o CI/CD não falhe e o código esteja saudável.

#### Cenários de Teste
1.  Rodar `npm run build` -> Sucesso sem erros.
2.  Rodar `npm run lint` -> Sucesso sem warnings críticos.

#### Regras de Negócio
*   Não suprimir erros com `@ts-ignore` a menos que estritamente documentado o motivo.

#### Detalhamento Técnico
*   Investigar erros de `Turbopack` (se persistirem).
*   Verificar importações circulares.
*   Corrigir tipagem de Server Actions.

---

### STORY-007: Padronização de Imports e Estrutura
**Como:** Tech Lead
**Quero:** Que todos os componentes usem imports absolutos (`@/`) e estejam nas pastas corretas
**Para:** Facilitar a manutenção e leitura do código.

#### Cenários de Teste
1.  Verificar arquivos amostrais -> Imports limpos.

#### Detalhamento Técnico
*   Revisar `tsconfig.json`.
*   Refatorar imports relativos longos (`../../../../utils`).

# FIX-001: Projeto de Correção - Resgate do Estagiário

**Status:** 🟡 Planejamento
**Data de Criação:** 05/12/2025
**Responsável:** Tech Lead System
**Tipo:** Manutenção Corretiva & Saneamento

---

## 1. Descrição do Projeto
Projeto focado na estabilização, correção e refatoração do código existente para elevar os padrões de qualidade, corrigir débitos técnicos introduzidos durante desenvolvimentos rápidos (modo "Estagiário") e garantir a robustez da aplicação. O objetivo é "limpar a casa" antes de prosseguir com novas funcionalidades complexas.

## 2. Regras de Negócio
1.  **Imutabilidade Funcional:** As correções não devem alterar o comportamento esperado das funcionalidades já aprovadas (Login, Dashboard, QR Code), apenas sua implementação interna e robustez.
2.  **Padrão Senior:** Todo código tocado deve ser tipado estritamente (TypeScript), documentado e seguir as diretrizes de Clean Code.

## 3. Critérios de Aceite
1.  Zero erros de Lint/Build no console (`npm run lint` e `npm run build` limpos).
2.  Eliminação de tipos `any` explícitos em arquivos críticos.
3.  Padronização da estrutura de pastas conforme arquitetura definida.
4.  Correção de bugs reportados ou identificados durante a revisão.

## 4. Detalhamento Técnico
*   **Análise Estática:** Uso extensivo de ESLint e TypeScript Compiler.
*   **Refatoração:** Simplificação de Server Actions complexas.
*   **Performance:** Remoção de imports não utilizados e otimização de imagens.

## 5. Detalhamento de UX
*   **N/A:** O foco é backend/estrutural. Melhorias de UX são secundárias, a menos que sejam bugs visuais (ex: layout quebrado).

## 6. Riscos e Mitigação
| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Regressão:** Quebrar algo que funcionava. | Média | Alto | Testes manuais rigorosos em cada História de refatoração. |
| **Scope Creep:** Querer reescrever tudo. | Alta | Médio | Focar estritamente em "Correção" e não em "Melhoria de Feature". |

---

## 7. Estrutura de Épicos
1.  [EPIC-01: Saneamento e Estabilização](./01-Epics/EPIC-01_Sanitization.md)

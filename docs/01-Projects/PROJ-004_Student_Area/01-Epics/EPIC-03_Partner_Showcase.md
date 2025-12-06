# EPIC-03: Vitrine de Parceiros

**Projeto:** PROJ-004 (Área do Aluno)
**Status:** Planejamento
3.  **Vazio:** Academia sem parceiros -> Exibir "Novidades em breve".

#### Regras de Negócio
*   Exibir apenas parceiros com `academy_id` igual ao do aluno.
*   Exibir apenas parceiros/benefícios com status `ACTIVE`.

#### Detalhamento Técnico
*   **Query:** `select * from partners join benefits on ... where academy_id = $1`.
*   **Performance:** Cachear essa lista (ISR ou Cache de 1 hora) pois muda pouco.

#### UX
*   Cards simples com: Logo (se tiver) ou Ícone de categoria, Nome, "Até X% OFF".
*   Botão "Como chegar" (Link para Google Maps com latitude/longitude).

#### Detalhamento do Banco de Dados
*   Leitura das tabelas `partners` e `benefits`.

#### Riscos
*   Lista muito grande (futuro).
*   Mitigação: Implementar barra de busca ou filtro por categoria no futuro (Pós-MVP).

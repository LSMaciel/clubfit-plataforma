# EPIC-06C: Adaptação das Consultas (Aluno & Dashboards)

**Projeto:** PROJ-006 (Global Partners)
**Status:** 🟡 Planejamento

## 1. Descrição
Garantir que a visualização do usuário final (Aluno) e os relatórios de uso continuem funcionando corretamente após a mudança estrutural do banco de dados.

## 2. Histórias de Usuário

### STORY-006: Atualização da API do Aluno (Vitrine)
**Como:** Aluno
**Quero:** Ver apenas os parceiros que minha academia selecionou
**Para:** Não ver ofertas irrelevantes ou de outras cidades/academias.

#### Detalhamento Técnico
*   Revisar código em `app/student/(app)/partners/page.tsx` (ou similar).
*   A query Supabase deve mudar de `.from('partners').select('*').eq('academy_id', myAcademyId)` para um join ou subquery usando `academy_partners`.

#### Critérios de Aceite
1.  Aluno logado vê lista correta.
2.  Performance da query se mantém aceitável (< 200ms).

### STORY-007: Validação de Voucher
**Como:** Sistema
**Quero:** Garantir que o voucher gerado pertence a um parceiro validamente vinculado
**Para:** Evitar fraudes onde alunos geram vouchers para parceiros desvinculados.

#### Regras de Negócio
*   Ao gerar voucher (`wallet/actions.ts`), verificar se existe registro `ACTIVE` em `academy_partners` entre a academia do aluno e o parceiro do benefício.

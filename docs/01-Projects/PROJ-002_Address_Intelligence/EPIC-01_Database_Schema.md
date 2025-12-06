# EPIC-01: Fundação de Dados e Schema Geográfico

**Status:** Planejado
**Sprint:** N/A (Planning Phase)

## Descrição
Este épico foca em preparar o terreno no Supabase para receber dados geográficos e estruturados.

## Histórias de Usuário

### USER_STORY-001: Migração de Estrutura de Tabelas (Partners & Academies)
**Descrição:** Atualizar as tabelas `partners` e `academies` para suportar endereçamento detalhado.
**Cenários:**
1.  **Cenário A:** Tabela vazia (Simples `ALTER TABLE`).
2.  **Cenário B:** Tabela com dados (Migrar dado antigo do campo `address` para `street` ou manter `address` como legado).
**Regras de Negócio:**
*   `zip_code` é obrigatório para novos registros.
*   `latitude` e `longitude` devem ser `float` ou `numeric`.
**Detalhamento Técnico:**
*   SQL Migration para adicionar colunas: `zip_code`, `street`, `number`, `neighborhood`, `city`, `state`, `complement`, `latitude`, `longitude`.
*   Atualizar Types do TypeScript (`types/database.types.ts` ou inferência).
**Critérios de Aceite:**
- [ ] Schema do Supabase atualizado.
- [ ] Backend consegue ler/escrever nesses novos campos.

### USER_STORY-002: Atualização de Server Actions (Mutations)
**Descrição:** Atualizar as funções `createPartner` e `createAcademy` para receber o payload expandido do formulário.
**Detalhamento Técnico:**
*   Atualizar `app/admin/partners/actions.ts`.
*   Atualizar `app/admin/academies/actions.ts`.
*   Sanitização do CEP (remover traços e pontos antes de salvar).
**Critérios de Aceite:**
- [ ] Action recebe Lat/Long e salva corretamente.
- [ ] Action valida se campos obrigatórios (Rua, Número, Bairro) estão presentes.

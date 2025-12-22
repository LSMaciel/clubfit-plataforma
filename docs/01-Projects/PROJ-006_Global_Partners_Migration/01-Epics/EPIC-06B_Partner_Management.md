# EPIC-06B: Gestão de Vínculos (Frontend Admin)

**Projeto:** PROJ-006 (Global Partners)
**Status:** 🟡 Planejamento

## 1. Descrição
Atualização da interface administrativa da Academia para lidar com o novo fluxo de parceiros globais. O foco sai de "Cadastro CRUD simples" para "Busca e Vínculo".

## 2. Histórias de Usuário

### STORY-003: Interface de Vínculos de Parceiro
**Como:** Admin da Academia
**Quero:** Buscar parceiros na base global e vinculá-los à minha academia
**Para:** Oferecer benefícios aos meus alunos sem precisar cadastrar tudo do zero.

#### UX / UI
*   Nova página ou aba "Adicionar Parceiro".
*   Campo de Busca (Debounced) que pesquisa por Nome ou CNPJ na tabela `partners`.
*   Lista de resultados exibe: Nome, Cidade, e Status (Já vinculado / Não vinculado).

#### Critérios de Aceite
1.  Busca retorna resultados globais.
2.  Botão "Vincular" cria registro em `academy_partners` com `status='ACTIVE'`.
3.  Se já vinculado, botão exibe "Desvincular" (muda status para `INACTIVE` ou remove registro - decidir por Inactive para manter histórico).

---

### STORY-004: Cadastro de Novo Parceiro (Fluxo Híbrido)
**Como:** Admin da Academia
**Quero:** Cadastrar um parceiro novo se ele não existir na base
**Para:** Expandir a rede de parceiros.

#### Fluxo
1.  Usuário busca.
2.  Resultado: "Nenhum parceiro encontrado".
3.  Botão: "Cadastrar Novo Parceiro".
4.  Abre formulário tradicional.
5.  Ao salvar -> Cria `partner` (sem academy_id direto) -> Cria `academy_partner` vinculado a mim imediatamente.

#### Regras de Negócio
*   Antes de salvar, o backend deve fazer check duplo de CNPJ para evitar "Race Condition" de duplicação.

---

### STORY-005: Gestão de Meus Parceiros (Listagem)
**Como:** Admin da Academia
**Quero:** Ver e gerenciar apenas os parceiros vinculados a mim
**Para:** Controlar o que meus alunos veem.

#### Detalhamento Técnico
*   Atualizar a query da página de listagem `/admin/partners` para filtrar por `academy_partners`.
*   Ação de "Excluir" deve ser renomeada para "Remover Vínculo" (Soft Delete no vínculo apenas).

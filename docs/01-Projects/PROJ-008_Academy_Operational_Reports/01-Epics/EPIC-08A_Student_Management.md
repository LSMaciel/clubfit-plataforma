# EPIC-08A: Gestão de Alunos (Controle de Acesso)

**Projeto:** PROJ-008 (Relatórios Operacionais)
**Status:** 🟡 Planejamento

## 1. Descrição
Implementação da funcionalidade que permite à Academia bloquear o acesso de alunos específicos. Isso é crucial para casos de inadimplência na recepção ou cancelamento de matrícula.

## 2. Histórias de Usuário

### STORY-001: Listagem Gerenciável de Alunos
**Como:** Admin da Academia
**Quero:** Ver uma lista dos meus alunos com opção rápida de ativar/desativar
**Para:** Gerenciar quem tem direito aos benefícios.

#### UX / UI
*   Página `/admin/students` (já deve existir ou ser criada).
*   Tabela com colunas: Nome, CPF, Status (Badge Verde/Vermelho).
*   Ação: Switch "Ativo?" (Toggle).
*   Busca: Input no topo da tabela.

#### Detalhamento Técnico
*   **Frontend:** Componente `StudentTable` com Server Action `toggleStudentStatus(id, newStatus)`.
*   **Backend:** Update na tabela `students` setando `status`.

---

### STORY-002: Bloqueio na Geração de Voucher
**Como:** Sistema
**Quero:** Impedir que alunos com status `INACTIVE` gerem vouchers
**Para:** Garantir que o benefício seja exclusivo para alunos ativos.

#### Regras de Negócio
*   Na action `generateVoucher` (Wallet), verificar:
    `if (student.status !== 'ACTIVE') throw new Error("Acesso inativo nesta academia.");`
*   Verificar se a query atual de Login já barra inativos. Se sim, esta história é apenas um reforço de segurança (Defense in Depth).

#### Cenários de Teste
1.  Inativar aluno X pelo painel Admin.
2.  Logar como aluno X (se login for permitido).
3.  Tentar gerar voucher -> Deve falhar com mensagem clara.

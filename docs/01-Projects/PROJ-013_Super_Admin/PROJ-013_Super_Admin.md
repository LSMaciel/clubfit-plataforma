# PROJ-013: Painel de Controle (Super Admin)

## 1. Visão Geral
Criação de um painel administrativo centralizado para o Super Admin (Dono da Plataforma). O objetivo é garantir a saúde operacional, financeira e estratégica do ecossistema ClubFit, permitindo gestão de status (ativar/desativar), manutenção de emergência, suporte avançado (impersonation, magic link) e distribuição de conteúdo global (parceiros estratégicos).

## 2. Regras de Negócio Globais

*   **RN01 - Soberania do Status:** O status da Academia definido pelo Super Admin (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `MAINTENANCE`) tem precedência sobre qualquer outro status interno.
*   **RN02 - Visibilidade de Bloqueio:**
    *   **Admin da Academia:** Deve ser notificado do motivo do bloqueio ao tentar login.
    *   **Aluno:** Não deve visualizar parceiros nem gerar vouchers se a academia estiver bloqueada.
*   **RN03 - Gestão Financeira Passiva:** O sistema não bloqueia automaticamente por falta de pagamento (decisão manual), mas alerta o Super Admin sobre datas de vencimento.
*   **RN04 - Conteúdo Global:** Parceiros marcados como "Globais" são visíveis para todas as academias e não podem ser editados pelos Admins locais.

## 3. Critérios de Aceite do Projeto
*   Super Admin consegue alterar o status de qualquer academia em tempo real.
*   Super Admin consegue acessar o painel de qualquer academia (Impersonation) sem saber a senha.
*   Dashboards mostram claramente quem está vencendo/vencido.
*   Parceiros Globais aparecem corretamente no app dos alunos de todas as academias.

## 4. Detalhamento Técnico Geral
*   **Frontend:** Novas rotas em `/admin/super/...` protegidas por RLS e Middleware (Role: `SUPER_ADMIN`).
*   **Database:** Alterações na tabela `academies` e criação de `audit_logs`.
*   **Segurança:** RLS policies estritas.

## 5. Riscos e Mitigação
*   **Risco:** Bloquear academia errada por acidente.
    *   *Mitigação:* Modal de confirmação com "Digitar o nome da academia" para deletar/suspender.
*   **Risco:** Super Admin alterar dados sensíveis do aluno via Impersonation.
    *   *Mitigação:* Logar todas as ações feitas durante uma sessão de Impersonation.

---

# Estrutura de Épicos e Histórias

## EPIC-13A: Gestão de Status & Ciclo de Vida
**Descrição:** Implementação do controle fundamental de ligar/desligar academias.

### STORY-13A-01: Schema e Status no Banco (Migration)
*   **Nome:** Atualização da Estrutura de Dados para Ciclo de Vida
*   **Descrição:** Alteração do banco de dados para suportar os status de ciclo de vida das academias e ajuste das políticas de segurança para respeitar esses status.
*   **Cenários:**
    1.  Academia `ACTIVE` acessa tudo normal.
    2.  Academia `INACTIVE` tem acesso bloqueado via API/RLS.
*   **Regras de Negócio:** RN01 (Soberania).
*   **Critérios de Aceite:**
    1.  Tabela `academies` possui coluna `status`.
    2.  Não é possível ler dados de uma academia `INACTIVE` sem ser Super Admin.
*   **Detalhamento Técnico:**
    *   Migration: `ALTER TABLE academies ADD COLUMN status status_enum DEFAULT 'ACTIVE'`.
    *   RLS: Atualizar policies de `partners`, `students` para checar `academies.status`.
*   **Detalhamento de UX:** N/A (Backend).
*   **Detalhamento do Banco de Dados:**
    *   `academies.status`: ENUM (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `MAINTENANCE`).
*   **Riscos:** Quebrar acesso de academias atuais.
*   **Mitigação dos Riscos:** Default do status ser `ACTIVE` na migração.
*   **Cenários de Testes:**
    *   Rodar SQL tentando ler parceiros de uma academia com status `INACTIVE` -> Deve retornar zero linhas.

### STORY-13A-02: Listagem e Bloqueio (Interface Admin)
*   **Nome:** Interface de Gestão de Academias
*   **Descrição:** Tela onde Super Admin visualiza a lista de todas as academias cadastradas e pode alterar seu status instantaneamente.
*   **Cenários:**
    1.  Super Admin vê tabela com colunas: Nome, Slug, Status.
    2.  Super Admin clica no Status -> Dropdown abre -> Seleciona "Suspender".
*   **Regras de Negócio:** Apenas Super Admin pode acessar essa rota.
*   **Critérios de Aceite:**
    1.  Listagem carrega em < 2s.
    2.  Alteração de status reflete imediatamente no banco.
    3.  Feedback visual de sucesso/erro.
*   **Detalhamento Técnico:**
    *   Pagina `/admin/super/academies`.
    *   Server Action `updateAcademyStatus(id, newStatus)`.
*   **Detalhamento de UX:**
    *   Tabela Zebra-striped.
    *   Status com Badges coloridas (Verde=Active, Vermelho=Suspended).
    *   Confirmação antes de mudar para Inactive/Suspended.
*   **Detalhamento do Banco de Dados:** Leitura e Update na tabela `academies`.
*   **Riscos:** Admin clicar errado.
*   **Mitigação dos Riscos:** Tooltip e Confirmação.
*   **Cenários de Testes:**
    *   Mudar status para Suspended, abrir aba anonima na academia, tentar logar -> Erro.

---

## EPIC-13B: Ferramentas Operacionais & Suporte
**Descrição:** Ferramentas para resolver problemas do dia-a-dia da operação.

### STORY-13B-01: Modo Manutenção (Botão de Pânico)
*   **Nome:** Ativação de Modo Manutenção
*   **Descrição:** Capacidade de colocar uma academia (ou o sistema) em modo de manutenção, onde o usuário vê uma mensagem amigável ao invés de erros.
*   **Cenários:**
    1.  Sistema com instabilidade. Super Admin ativa "Manutenção".
    2.  Aluno abre app -> Vê tela "Voltamos logo".
*   **Regras de Negócio:** RN01.
*   **Critérios de Aceite:** Aluno não consegue navegar, mas vê mensagem explicativa.
*   **Detalhamento Técnico:** Middleware ou Wrapper no Frontend que checa o status antes de renderizar children.
*   **Detalhamento de UX:** Tela de "Em Manutenção" com ilustração e previsão de volta (opcional).
*   **Detalhamento do Banco de Dados:** Reutiliza coluna `status` = `MAINTENANCE`.
*   **Riscos:** Esquecer a academia em manutenção.
*   **Mitigação dos Riscos:** Mensagem piscante no painel do Super Admin indicando "1 Academia em Manutenção".
*   **Cenários de Testes:**
    *   Setar status, tentar gerar voucher -> Deve falhar.

### STORY-13B-02: Magic Link (Recuperação de Acesso)
*   **Nome:** Geração de Link de Acesso Emergencial
*   **Descrição:** Permitir que o Super Admin gere um link de login para um Admin de Academia que perdeu acesso (email/senha).
*   **Cenários:**
    1.  Admin liga: "Não consigo entrar".
    2.  Super Admin clica "Gerar Magic Link".
    3.  Copia URL e manda no WhatsApp.
*   **Regras de Negócio:** Link válido por 15 minutos e uso único.
*   **Critérios de Aceite:** O link deve logar o usuário automaticamente e redirecionar para dashboard.
*   **Detalhamento Técnico:**
    *   Uso de `supabase.auth.admin.generateLink({ type: 'magiclink', email: ... })`.
*   **Detalhamento de UX:** Botão "Gerar Acesso" na linha da tabela da academia.
*   **Detalhamento do Banco de Dados:** Nenhum (feature nativa Auth) ou tabela de log.
*   **Riscos:** Super Admin gerar acesso para conta errada.
*   **Mitigação dos Riscos:** Log de Auditoria estrito.
*   **Cenários de Testes:**
    *   Gerar link, abrir em aba anônima -> Deve estar logado.

### STORY-13B-03: Log de Auditoria
*   **Nome:** Sistema de Rastreabilidade (Audit Log)
*   **Descrição:** Registrar todas as ações destrutivas ou de alteração de acesso realizadas pelo Super Admin.
*   **Cenários:**
    1.  Super Admin muda status de A para B. SISTEMA grava log.
*   **Regras de Negócio:** Logs imutáveis.
*   **Critérios de Aceite:** Ter histórico de "Quem, Quando, O Quê, Onde".
*   **Detalhamento Técnico:** Tabela `audit_logs` inserida via `Database Trigger` ou via Aplicação na Server Action. Preferência por Aplicação para ter contexto de "Quem".
*   **Detalhamento de UX:** Página `/admin/super/audit`.
*   **Detalhamento do Banco de Dados:**
    *   Table `audit_logs`: `id`, `actor_id` (Super Admin), `target_resource` (Academy ID), `action` (UPDATE_STATUS), `details` (JSON), `created_at`.
*   **Riscos:** Log crescer demais.
*   **Mitigação dos Riscos:** Particionamento futuro (fora do escopo agora).
*   **Cenários de Testes:**
    *   Mudar status -> Verificar se linha foi criada em `audit_logs`.

---

## EPIC-13C: Painel Financeiro & Retenção
**Descrição:** Visibilidade sobre pagamentos e saúde da carteira de clientes.

### STORY-13C-01: Alertas de Vencimento
*   **Nome:** Monitoramento de Vencimentos
*   **Descrição:** Dashboard para visualizar academias com pagamentos próximos.
*   **Cenários:**
    1.  Super Admin abre Dashboard. Vê widget "A Vencer (Próx 5 dias)".
*   **Regras de Negócio:** Considerar dia de vencimento cadastrado.
*   **Critérios de Aceite:** Listagem correta baseada na data atual.
*   **Detalhamento Técnico:** Query filtrando `due_day`.
*   **Detalhamento de UX:** Semáforo de cores.
*   **Detalhamento do Banco de Dados:** Coluna `due_day` (int) na tabela `academies`.
*   **Riscos:** Fuso horário afetar data.
*   **Mitigação dos Riscos:** Padronizar tudo em UTC.
*   **Cenários de Testes:**
    *   Cadastrar `due_day` = hoje. Deve aparecer na lista.

### STORY-13C-02: Renovação Manual
*   **Nome:** Baixa Manual de Pagamento
*   **Descrição:** Registrar que a academia pagou a mensalidade, renovando o acesso/flag de pagamento.
*   **Cenários:**
    1.  Recebe comprovante Pix.
    2.  Clica em "Renovar". Sistema registra "Pago até mês que vem".
*   **Regras de Negócio:** Apenas registro informativo (já que não há bloqueio automático).
*   **Critérios de Aceite:** Atualizar campo `last_payment_date`.
*   **Detalhamento Técnico:** Update simples.
*   **Detalhamento de UX:** Botão "Confirmar Pagamento".
*   **Detalhamento do Banco de Dados:** Coluna `last_payment_date` (date) em `academies`.
*   **Riscos:** Esquecer de dar baixa.
*   **Mitigação dos Riscos:** O sistema avisa "Vencido há 40 dias" (Vermelho escuro).
*   **Cenários de Testes:**
    *   Renovar -> Data do último pagamento atualiza.

### STORY-13C-03: Churn Alert
*   **Nome:** Detecção de Risco de Churn (Inatividade)
*   **Descrição:** Identificar academias que não estão usando o sistema (gerando valor), indicando risco de cancelamento.
*   **Cenários:**
    1.  Academia X não gera voucher há 30 dias.
    2.  Aparece na lista "Risco de Churn".
*   **Regras de Negócio:** Inatividade = 0 vouchers criados nos últimos 30 dias.
*   **Critérios de Aceite:** Query correta de contagem.
*   **Detalhamento Técnico:** `COUNT(student_access_tokens) WHERE created_at > NOW() - 30 days`.
*   **Detalhamento de UX:** Lista de "Alerta de Engajamento".
*   **Detalhamento do Banco de Dados:** Leitura em `student_access_tokens`.
*   **Riscos:** Performance da query em banco grande.
*   **Mitigação dos Riscos:** Criar índice em `created_at` ou rodar em Job noturno (MVP roda live).
*   **Cenários de Testes:**
    *   Criar voucher hoje -> Academia sai da lista de risco.

---

## EPIC-13D: Conteúdo Global
**Descrição:** Gestão de parceiros que aparecem em toda a rede.

### STORY-13D-01: Parceiros Globais
*   **Nome:** Gestão de Parceiros Multi-Academia
*   **Descrição:** Permitir criar parceiros que são visíveis para todas as academias automaticamente.
*   **Cenários:**
    1.  Super Admin cria parceiro "Centauro". Marca "Global".
    2.  Aluno da Academia A vê Centauro.
    3.  Aluno da Academia B vê Centauro.
*   **Regras de Negócio:** Parceiros globais não podem ser editados por admins locais.
*   **Critérios de Aceite:** Visibilidade em todas as listas de alunos.
*   **Detalhamento Técnico:**
    *   Adicionar `is_global` (boolean) em `partners`.
    *   Ajustar queries do App do Aluno: `WHERE academy_id = X OR is_global = true`.
*   **Detalhamento de UX:** Label "Global" na lista de parceiros do Super Admin. No App, talvez um destaque "Parceiro Oficial".
*   **Detalhamento do Banco de Dados:**
    *   `partners.is_global` (bool default false).
*   **Riscos:** Poluir a lista das academias com parceiros irrelevantes (ex: loja de SP aparecendo no AC).
*   **Mitigação dos Riscos:** (Futuro) Segmentar global por Região/Estado.
*   **Cenários de Testes:**
    *   Criar Global -> Verificar login de aluno aleatório -> Deve ver o parceiro.

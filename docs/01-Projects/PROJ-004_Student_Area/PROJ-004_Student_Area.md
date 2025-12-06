# PROJ-004: Área do Aluno (Mobile Web App)

**Status:** 🟡 Planejamento
**Data de Criação:** 05/12/2025
**Responsável:** Tech Lead System

---

## 1. Descrição do Projeto
Desenvolvimento da interface mobile-first (Web App/PWA) destinada aos alunos das academias clientes do ClubFit. O objetivo é permitir que o aluno, através de uma URL simples, identifique-se (via CPF) e tenha acesso à sua "Carteira Digital", onde poderá consultar os parceiros conveniados e gerar o QR Code para obter descontos.

O foco é em **baixa fricção**: não exigir download de loja de aplicativos e nem cadastro de senha complexa neste primeiro momento.

## 2. Regras de Negócio
1.  **Acesso Simplificado:** O login deve ser realizado apenas com o CPF. O sistema deve validar se o CPF existe e se está ativo em alguma academia.
2.  **Multitenancy Visual:** Após o login, a interface deve adaptar-se à identidade visual (Logo/Cor) da academia do aluno, conforme configuração do banco de dados.
3.  **Segurança do Voucher:**
    *   O aluno só pode gerar um QR Code se estiver com status `ACTIVE` na tabela `students`.
    *   O QR Code gerado tem validade de 5 a 10 minutos.
4.  **Single Session (Soft):** Não haverá rigidez de sessão concorrente no MVP, mas o token de acesso deve ser persistente (Cookie/LocalStorage) para que o aluno não precise digitar o CPF toda vez que abrir o app.

## 3. Critérios de Aceite
1.  Aluno acessa a URL pública (ex: `app.clubfit.com.br` ou rota `/app`).
2.  Digita o CPF. Se válido, entra na Home.
3.  Home exibe:
    *   Logo da Academia no topo.
    *   Saudação ("Olá, [Nome]").
    *   Botão de destaque: "Gerar Cartão Digital".
    *   Lista de Parceiros abaixo.
4.  Ao clicar em "Gerar Cartão", abre modal com QR Code dinâmico.
5.  O Web App solicita instalação (Prompt PWA) para ficar na tela inicial.

## 4. Detalhamento Técnico
### Stack Frontend
*   **Framework:** Next.js (mesmo repo, nova rota ou subdomain).
*   **Rota:** `/app` ou `student.clubfit.com` (Definir estratégia de roteamento). Para MVP, `/student`.
*   **Estilização:** Tailwind CSS (Mobile First).
*   **PWA:** `next-pwa` ou configuração de manifesto simples (`manifest.json`) para permitir "Adicionar à Tela Inicial".

### Autenticação (Fluxo Simplificado)
*   Formulário envia CPF -> Server Action valida -> Retorna Cookie de Sessão de Longa Duração (`student_token`).
*   **Nota:** Não usaremos Supabase Auth (Email/Senha) para o aluno neste MVP, pois o cadastro dele é importado/criado pelo Admin apenas com CPF. Criaremos uma sessão "lógica" baseada em assinatura JWT ou opaca.

## 5. Detalhamento de UX
*   **Foco:** Mobile (telas verticais).
*   **Cores:**
    *   Fundo neutro (branco/cinza claro).
    *   Header e Botões de Ação Principais: `primary_color` da Academia (dinâmico).
*   **Interações:** Toques grandes, evitar inputs de texto complexos.
*   **Ícone:** O ícone do PWA deve ser o do ClubFit (plataforma), mas dentro do app a marca da academia predomina.

## 6. Riscos e Mitigação
| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Impersonação (Fraude):** Alguém saber o CPF de outro e usar o desconto. | Média | Baixo | O desconto é presencial. O parceiro pode pedir documento com foto se desconfiar. O prejuízo financeiro é baixo (desconto) comparado a acesso bancário. |
| **UX Confusa (Qual Academia?):** Se o CPF existir em 2 academias (raro, mas possível no futuro). | Baixa | Médio | Regra R02 diz que CPF é único globalmente. Se acontecer, o sistema deve pegar a primeira ativa ou bloquear. |
| **Offline:** Usuário tentar gerar QR Code sem internet. | Alta | Médio | PWA pode cachear a interface, mas QR Code dinâmico precisa de servidor. Exibir mensagem amigável de "Sem conexão". |

---

## 7. Estrutura de Épicos
1.  [EPIC-01: Autenticação e Home](./01-Epics/EPIC-01_Authentication.md)
2.  [EPIC-02: Carteira Digital (QR Code)](./01-Epics/EPIC-02_Digital_Wallet.md)
3.  [EPIC-03: Vitrine de Parceiros](./01-Epics/EPIC-03_Partner_Showcase.md)

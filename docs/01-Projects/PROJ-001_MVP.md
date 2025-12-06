# PROJ-001: ClubFit MVP (Minimum Viable Product)

**Status:** 🟡 Planejamento / Aguardando Aprovação
**Data de Criação:** 2024-05-22
**Responsável:** Tech Lead System

---

## 1. Descrição do Projeto
O **ClubFit** é uma plataforma SaaS White-label projetada para academias de pequeno e médio porte. O objetivo é criar um ecossistema de fidelidade onde a academia oferece aos seus alunos descontos exclusivos em comércios locais (parceiros).
O MVP foca no fluxo essencial: A academia cadastra o aluno -> O aluno acessa o portal -> Gera um QR Code de desconto -> O parceiro valida o QR Code.

---

## 2. Regras de Negócio Globais
1.  **Multi-tenancy Estrito:** Dados de uma academia (alunos, parceiros, usos) nunca devem vazar para outra.
2.  **CPF como Chave Mestra:** Um aluno é identificado unicamente pelo CPF no ecossistema, embora seu acesso seja segregado por academia.
3.  **Autonomia do Parceiro:** O parceiro é responsável por criar e gerir suas próprias promoções (sujeito a moderação).
4.  **Validação Atômica:** Um voucher (QR Code) só pode ser validado uma única vez e possui tempo de expiração curto (5-10 min).
5.  **Identidade Visual:** O portal do aluno deve refletir as cores e logo da academia contratante.

---

## 3. Critérios de Aceite (DoD - Definition of Done do MVP)
- [ ] Banco de Dados Supabase configurado com RLS (Row Level Security) ativo para todas as tabelas.
- [ ] Fluxo de Login Corporativo (Admin/Parceiro) e Fluxo de Aluno (CPF) funcionais e distintos.
- [ ] Super Admin consegue criar uma Academia e o primeiro usuário Admin dela.
- [ ] Admin da Academia consegue cadastrar alunos (manual).
- [ ] Parceiro consegue criar uma promoção e validar um QR Code via câmera ou CPF.
- [ ] Aluno consegue visualizar promoções e gerar um QR Code válido.
- [ ] Dashboard exibe contadores básicos de uso.

---

## 4. Detalhamento Técnico
### Stack
-   **Front-end:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons, Shadcn/ui.
-   **Back-end/DB:** Supabase (PostgreSQL 15+).
-   **Infra:** Vercel (Front) + Supabase Cloud.

### Arquitetura de Dados (Resumo)
-   `academies`: Tenant root.
-   `users`: Usuários de sistema (Admins, Parceiros). Vinculados a `auth.users`.
-   `students`: Usuários finais.
-   `partners`: Empresas parceiras.
-   `benefits`: Promoções.
-   `benefit_usages`: Log de transações.

---

## 5. Detalhamento de UX (User Experience)
-   **Admin/Parceiro:** Interface Desktop-first, densa em dados, tabelas com filtros, navegação lateral. Cores neutras (Branding ClubFit).
-   **Aluno:** Interface Mobile-first (quase app nativo), botões grandes, foco em cards visuais. Cores dinâmicas (Branding da Academia).

---

## 6. Riscos e Mitigação
| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Fraude no QR Code:** Aluno tirar print e mandar para amigo. | Alta | Médio | Token expira em 5 min; App do parceiro valida timestamp e unicidade no banco. |
| **Falha na Câmera do Parceiro:** Celular antigo ou sem permissão. | Média | Alto | Implementar validação manual por CPF + Seleção de Benefício como fallback. |
| **Complexidade no Cadastro de Alunos:** Academia não ter tempo de cadastrar um a um. | Alta | Alto | (Pós-MVP) Importação CSV. No MVP, focar em cadastro simplificado (Nome/CPF). |

---

## 7. Estrutura de Épicos
O projeto foi dividido em 3 épicos sequenciais:
1.  [EPIC-01: Fundação e Arquitetura](./PROJ-001_MVP/EPIC-01_Foundation_Architecture.md)
2.  [EPIC-02: Painéis de Gestão](./PROJ-001_MVP/EPIC-02_Management_Panels.md)
3.  [EPIC-03: Experiência do Aluno e Validação](./PROJ-001_MVP/EPIC-03_Student_Experience_Validation.md)


# CLUBFIT - Documento Geral do Projeto (MVP)
**Versão:** 1.2
**Status:** Planejamento Técnico e Funcional (Roadmap Definido)

---

## 1. Visão Geral e Atores do Ecossistema
O **ClubFit** é uma plataforma SaaS White-label que conecta Academias, Parceiros Comerciais e Alunos. O sistema é gerido por um Super Admin central, mas oferece painéis independentes para cada ator.

### 1.1. Os 4 Pilares (Atores)

1.  **Super Admin (Nós/Dono do Software):**
    - **Responsabilidade:** Controle absoluto do sistema.
    - **Poder:** Acesso a todos os dados, gestão financeira das academias (SaaS), métricas globais e auditoria.

2.  **A Academia (O Cliente Contratante):**
    - **Responsabilidade:** Fidelizar seus alunos.
    - **Função:** Cadastra os alunos, define a identidade visual do app (White-label) e acompanha o engajamento (quem está usando os descontos).

3.  **O Parceiro (A Loja/Estabelecimento):**
    - **Responsabilidade:** Ofertar o benefício.
    - **Função:** **Cria suas próprias promoções** e descontos no painel e valida o uso no balcão (QR Code). Tem autonomia para gerir suas ofertas.

4.  **O Aluno (O Usuário Final):**
    - **Responsabilidade:** Consumir.
    - **Função:** Acessa o app da academia, navega pelo "Marketplace" de benefícios e gera os vouchers para desconto.

---

## 2. Stack Tecnológica
A escolha da stack foca em velocidade de desenvolvimento (Time-to-market), segurança e escalabilidade.

- **Front-end / Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Back-end (BaaS):** Supabase
  - **Database:** PostgreSQL
  - **Auth:** Supabase Auth (JWT)
  - **Storage:** Supabase Storage (Logos das academias)
  - **Security:** RLS (Row Level Security) para isolamento estrito de dados (Multi-tenant).

---

## 3. Arquitetura de Acesso e Autenticação
O sistema possui **dois fluxos de entrada distintos**.

### 3.1. Fluxo Corporativo (Gestão)
- **URL Base:** `/admin`
- **Público:** Super Admin, Donos de Academia, Parceiros Comerciais.
- **Login:** E-mail e Senha (com CNPJ vinculado para Academias/Parceiros).
- **Contexto:** Interface Desktop-first, focada em tabelas, gráficos e formulários.

### 3.2. Fluxo do Cliente (Portal do Aluno)
- **URL Base:** `/[slug-da-academia]` (ex: `clubfit.app/ironberg`)
- **Público:** Alunos.
- **Identidade Visual:** Carrega logo e cores da academia específica.
- **Login:**
  - **CPF (Chave primária de acesso)** + Senha.
  - Alternativa por E-mail.
  - Cadastro único por CPF em todo o sistema.

---

## 4. Funcionalidades Detalhadas por Painel

### 4.1. Painel Super Admin (Visão de Deus)
- **Gestão de Clientes (Academias):** CRUD completo, ativação/bloqueio de academias (ex: por falta de pagamento).
- **Métricas Globais:** Total de alunos na plataforma, total de vouchers gerados no mês, ranking de academias mais ativas.
- **Gestão de Usuários:** Poder de resetar senhas e gerenciar acessos de Admins de Academia.
- **Auditoria:** Log de atividades críticas.

### 4.2. Painel da Academia (Gestão do Clube)
- **Identidade Visual:** Configuração do logo e cores do portal do aluno.
- **Gestão de Alunos:**
  - Cadastro manual ou importação.
  - Bloqueio de alunos inadimplentes (o aluno perde acesso aos descontos instantaneamente).
- **Gestão de Parceiros:** Convida parceiros para a plataforma ou cadastra parceiros manualmente.
- **Dashboard de Engajamento:**
  - "Quantos alunos usaram benefícios este mês?"
  - "Quais parceiros são os favoritos dos meus alunos?"

### 4.3. Painel do Parceiro (Gestão de Ofertas)
- **Gestão de Promoções (Novo):**
  - O próprio parceiro cria a promoção (ex: "15% OFF em Suplementos").
  - Define regras (ex: "Válido apenas segundas-feiras", "Máximo 1 por CPF").
  - Define vigência (Data de início e fim).
- **Validação de Vouchers:**
  - Leitor de QR Code (Webcam/Celular).
  - Validação manual por CPF (Contingência).
- **Histórico Financeiro/Uso:** "Quantas vendas eu fiz através da Academia X?".

### 4.4. Portal do Aluno (Marketplace de Benefícios)
- **Marketplace Visual:**
  - Lista de parceiros com logos e chamadas para ação.
  - Filtros por categoria (Saúde, Alimentação, Estética).
  - *Futuro:* Ordenação por geolocalização (proximidade).
- **Carteira de Vouchers:**
  - Geração de QR Code dinâmico com timer.
  - Histórico de economia ("Você já economizou R$ 150,00 este mês").

---

## 5. Modelagem de Dados (Ajustes Supabase)

1.  **`public.academies`**: Tabela mãe dos tenants.
2.  **`public.users`**: Perfis de acesso (Super Admin, Admin Academia, Parceiro).
3.  **`public.partners`**:
    - Vinculado a `academy_id`.
    - Contém dados da empresa parceira.
    - Possui usuários vinculados (donos do parceiro).
4.  **`public.benefits`**:
    - Agora editável pelo usuário do tipo `PARTNER`.
    - `title`, `description`, `rules`, `active`.
5.  **`public.students`**:
    - Vinculado a `academy_id`.
    - `cpf` (Unique).

---

## 6. Regras de Negócio Críticas

1.  **Autonomia Controlada:** O Parceiro cria a promoção, mas a Academia (ou Super Admin, dependendo da config) pode inativar uma promoção ofensiva ou errada.
2.  **Isolamento Multi-tenant:** Um parceiro da Academia A não aparece para a Academia B, a menos que seja um "Parceiro Global" (feature futura).
3.  **Segurança do Voucher:**
    - Token único, uso único, expiração curta (5 min).
    - Validação atômica no banco para evitar uso duplicado.

---

## 7. Roadmap de Desenvolvimento (MVP & Releases)

### FASE 1: O MVP (Minimum Viable Product)
**Foco:** Validar o fluxo principal (Core Loop) -> "Aluno gera QR, Parceiro lê QR".
*Estimativa: 2 Sprints*

1.  **Infraestrutura & Auth:**
    *   Setup do Supabase (Tabelas e RLS).
    *   Login Admin (Email/Senha).
    *   Login Aluno (CPF Lookup -> Senha).
2.  **Painel Super Admin:**
    *   Criar Academia (com Logo e Cor).
3.  **Painel Academia:**
    *   Criar Parceiro (Simples).
    *   Criar Aluno (Cadastro Manual um a um).
4.  **Painel Parceiro:**
    *   Criar Benefício (Título e Regra básica).
    *   **Leitor de QR Code (Feature Chave).**
5.  **Portal do Aluno:**
    *   Listagem simples de benefícios (Card Grid).
    *   **Gerar Voucher (QR Code dinâmico).**

### FASE 2: Release 1.5 (Operacional)
**Foco:** Facilitar a vida dos gestores e contornar problemas físicos.

1.  **Importação em Massa:** Academia pode subir CSV com 500 alunos de uma vez.
2.  **Validação de Contingência:** Parceiro valida digitando CPF (caso a câmera do celular quebre ou internet esteja lenta).
3.  **Dashboards V1:** Contadores reais (Cards de "Total Usado", "Total Economizado").
4.  **Recuperação de Senha:** Fluxo de "Esqueci minha senha" funcional.

### FASE 3: Release 2.0 (Experiência & Marketplace)
**Foco:** Transformar a lista de benefícios em um produto desejável.

1.  **Marketplace Avançado:**
    *   Filtros por categoria (Tags).
    *   Busca por nome de parceiro.
2.  **Gestão Financeira:** Super Admin vê quanto cada academia deve pagar (SaaS).
3.  **Perfil do Parceiro Rico:** Parceiro pode fazer upload de fotos do estabelecimento e logo da marca.
4.  **PWA (Progressive Web App):** Ícone instalável no celular do aluno e notificações básicas.

# EPIC-02: Painéis de Gestão

**Projeto Pai:** PROJ-001 (MVP)
**Descrição:** Ferramentas para que Super Admins, Academias e Parceiros possam popular o sistema.

---

## 📜 STORY-004: Cadastro de Academias (Super Admin)
**Descrição:** Formulário para o Super Admin registrar um novo cliente (Academia) no sistema.

**Cenários:**
1.  Super Admin clica em "Nova Academia", preenche "Ironberg", define cor "#FF0000". Salva.

**Regras de Negócio:**
1.  O `slug` deve ser único no sistema e URL-friendly.
2.  Ao criar academia, não gera usuário automaticamente (feita em outra história).

**Critérios de Aceite:**
- [ ] Academia persistida no banco.
- [ ] Upload de Logo funcional (Supabase Storage).

**Detalhamento Técnico:**
-   Formulário com `react-hook-form`.
-   Upload de imagem via Bucket 'logos'.

**Detalhamento de UX:**
-   Modal ou Página dedicada.
-   Preview da cor escolhida e do logo.

**Detalhamento do Banco de Dados:**
-   INSERT em `academies`.

**Riscos:**
-   Slug duplicado gerar erro 500.
**Mitigação:** Validação assíncrona do slug antes do submit.

**Cenários de Testes:**
-   Criar academia com nome "Teste 123" e verificar slug gerado "teste-123".

---

## 📜 STORY-005: Cadastro de Parceiro (Admin Academia)
**Descrição:** Admin da Academia registra um estabelecimento comercial parceiro.

**Cenários:**
1.  Admin logado na academia X cadastra "Pizzaria do Zé".
2.  Sistema vincula Pizzaria à academia X.

**Regras de Negócio:**
1.  Parceiro pertence exclusivamente àquela academia (neste MVP).

**Critérios de Aceite:**
- [ ] Parceiro criado com status "Ativo".
- [ ] Geração de convite ou criação manual de usuário para o dono da pizzaria (simplificado: cria user/senha na hora).

**Detalhamento Técnico:**
-   Server Action `createPartner`.
-   Transação: Criar registro em `partners` e registro em `users` (role: PARTNER).

**Detalhamento de UX:**
-   Formulário: Nome Fantasia, Endereço, Nome do Responsável, Email, Senha Inicial.

**Detalhamento do Banco de Dados:**
-   INSERT `partners` (academy_id = current).
-   INSERT `auth.users` e `public.users`.

**Riscos:**
-   Admin criar parceiro com email já existente no Supabase.
**Mitigação:** Tratamento de erro amigável "Email já em uso".

**Cenários de Testes:**
-   Admin da Academia A tenta ver parceiros da Academia B (deve vir vazio).

---

## 📜 STORY-006: Gestão de Promoções (Painel do Parceiro)
**Descrição:** O Parceiro loga e cria uma oferta para os alunos.

**Cenários:**
1.  Parceiro acessa painel, vê lista vazia.
2.  Clica "Nova Promoção", define "10% Off". Salva.

**Regras de Negócio:**
1.  Promoção deve ter data de validade (opcional, default 30 dias).
2.  Promoção nasce com status `ACTIVE`.

**Critérios de Aceite:**
- [ ] Promoção aparece no app do aluno imediatamente.

**Detalhamento Técnico:**
-   CRUD simples na tabela `benefits`.

**Detalhamento de UX:**
-   Dashboard simples. Botão flutuante "+".
-   Card de promoção com botão "Editar" e Toggle "Ativo".

**Detalhamento do Banco de Dados:**
-   INSERT `benefits` (`partner_id` vinculado ao user logado).

**Riscos:**
-   Parceiro criar promoção com texto ofensivo.
**Mitigação:** (Futuro) Moderação. (Agora) Termos de uso.

**Cenários de Testes:**
-   Criar promoção e desativar. Verificar se sumiu da lista do aluno.

---

## 📜 STORY-007: Cadastro de Aluno (Admin Academia)
**Descrição:** Cadastro manual de um aluno para dar acesso ao benefício.

**Cenários:**
1.  Admin digita CPF, Nome. Salva.

**Regras de Negócio:**
1.  **R02 - Unicidade de CPF:** Verifica se CPF já existe no `public.students` global.
    *   Se existe e é da mesma academia: Erro.
    *   Se existe em outra academia: Permite (multi-academia no futuro), mas no MVP foca em garantir cadastro limpo.

**Critérios de Aceite:**
- [ ] Validação de formato de CPF.

**Detalhamento Técnico:**
-   Lib de validação de CPF (algoritmo mod11).
-   Input Mask.

**Detalhamento de UX:**
-   Formulário enxuto.

**Detalhamento do Banco de Dados:**
-   INSERT `students`.

**Riscos:**
-   Erro de digitação do CPF impedir aluno de logar.
**Mitigação:** Pedir digitação dupla ou validar nome na Receita (Futuro).

**Cenários de Testes:**
-   Cadastrar CPF inválido "111.111.111-11".
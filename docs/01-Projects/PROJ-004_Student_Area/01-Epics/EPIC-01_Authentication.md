# EPIC-01: Autenticação e Home

**Projeto:** PROJ-004 (Área do Aluno)
**Status:** Planejamento

## 1. Descrição
Implementação da "porta de entrada" do Web App. Este épico cobre a tela de login (apenas CPF), a lógica de validação no back-end (verificar se aluno existe e está ativo), a criação da sessão persistente e a renderização da Home Page com a identidade visual da academia.

## 2. Histórias de Usuário

### STORY-001: Login por CPF
**Como:** Aluno da Academia
**Quero:** Entrar no aplicativo digitando apenas meu CPF
**Para:** Acessar meus benefícios sem precisar decorar senhas.

#### Cenários de Teste
1.  **CPF Inexistente:** Digitar CPF não cadastrado -> Exibir erro "CPF não encontrado".
2.  **CPF Inválido:** Digitar "123" -> Exibir erro de formatação.
3.  **Sucesso:** Digitar CPF cadastrado -> Redirecionar para `/student/dashboard`.
4.  **Persistência:** Fechar o navegador e abrir de novo -> Continuar logado.

#### Regras de Negócio
*   Apenas alunos com status `ACTIVE` podem logar.
*   O sistema deve buscar a academia vinculada ao aluno para carregar o tema (Logo/Cor) imediatamente ou na próxima tela.

#### Detalhamento Técnico
*   **Rota:** `/student/login`
*   **Componente:** `LoginForm` (Input Mask para CPF).
*   **Action:** `studentLogin(cpf)`.
    *   Limpa caracteres não numéricos.
    *   Query: `select * from students where cpf = $1`.
    *   Se not found: erro.
    *   Se found: Gera JWT ou Cookie Simples com `{ student_id, academy_id }`.
    *   Set Cookie: `clubfit-student-token` (Max-Age: 30 dias).

#### UX
*   Logo do ClubFit (neutro) no login.
*   Input numérico grande.
*   Botão "Entrar" largo.

---

### STORY-002: Home Page (Dashboard) ✅ (Concluído)
**Como:** Aluno Logado
**Quero:** Ver a tela inicial com o logo da minha academia
**Para:** Ter certeza que estou no ambiente certo e acessar as funcionalidades.

#### Regras de Negócio
*   O Header deve exibir o `logo_url` da `academies` vinculada.
*   As cores de destaque (botões, ícones) devem usar `primary_color` da academia.

#### Detalhamento Técnico
*   **Rota:** `/student/dashboard`
*   **Layout:** `StudentLayout` (ler cookie, buscar dados da academia, injetar CSS variable `--primary-color`).
*   **Conteúdo:**
    *   Header: Logo.
    *   Bem-vindo: `student.full_name`.
    *   Quick Actions: "Meu Cartão" (Botão FAB ou Destaque).

#### Riscos
*   Academia sem logo ou cor definida -> Usar Fallback (Logo ClubFit, Cor Preta/Roxa).

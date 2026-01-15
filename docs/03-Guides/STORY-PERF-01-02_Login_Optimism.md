# STORY-PERF-01-02: UI Otimista no Login (Portal do Aluno)

**Vinculado ao Projeto:** PROJ-PERF-01

## 1. Descrição e Objetivos
*   **Ator:** Aluno da Academia.
*   **Objetivo:** Visualizar a marca da academia e o formulário de login imediatamente (< 200ms) ao acessar o link, sem telas brancas de espera.
*   **Valor:** Sensação de rapidez e profissionalismo. Redução da ansiedade em redes 4G.

## 2. Diagnóstico Técnico (O Problema)
Atualmente, `app/[slug]/page.tsx` faz:
1.  `await supabase.auth.getUser()` (Bloqueante ~300ms a 1s)
2.  `await fetchAcademy()` (Bloqueante ~200ms)
3.  Renderiza.

Se o Supabase demorar, o usuário vê Branco.

## 3. Solução Proposta (Arquitetura)
Inverter a ordem de dependência usando Streaming (Suspense):

1.  **Page Shell (Síncrono/Rápido):** Busca apenas os dados da Academia (que podem ser cacheados ou são rápidos). Renderiza Logo + Fundo.
2.  **Auth Guard (Assíncrono):** Um componente `<StudentAuthCheck />` envelopado em `<Suspense>` que roda a verificação de sessão.
3.  **LoginForm:** Renderizado imediatamente. Se o `AuthCheck` descobrir que já está logado, ele faz o `redirect` no client/server action.

## 4. Detalhamento Implementação
*   **Arquivo:** `app/[slug]/page.tsx`
    *   Remover `await auth.getUser()` do nível da página.
    *   Buscar apenas `academy`.
    *   Adicionar `<Suspense fallback={null}><LoginRedirector /></Suspense>` perto do topo ou fundo.
*   **Componente:** `components/student/login-redirector.tsx`
    *   Server Component.
    *   Faz `auth.getUser()`.
    *   Se User == Student, `redirect('/benefits')`.
    *   Retorna `null` (invisível) se não logado.

## 5. Critérios de Aceite
1.  [ ] Acessar `/demo` deve mostrar a Logo IMEDIATAMENTE.
2.  [ ] Se eu estiver deslogado, fico na tela.
3.  [ ] Se eu estiver logado, a tela aparece por 0.5s e depois redireciona (Aceitável para o ganho de percepção inicial).

## 6. Riscos
*   **Flash de Conteúdo:** O usuário logado vê o form de login por meio segundo antes de ser redirecionado.
    *   **Mitigação:** É "Better than nothing" (Tela branca). Podemos colocar um "Skeleton do Form" ou apenas a Logo se quisermos ser mais puristas, mas mostrar o form já permite quem *não* está logado começar a digitar.

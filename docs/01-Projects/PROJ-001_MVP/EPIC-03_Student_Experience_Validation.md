# EPIC-03: Experiência do Aluno e Validação

**Projeto Pai:** PROJ-001 (MVP)
**Descrição:** Interface mobile para o aluno e ferramentas de validação para o parceiro.

---

## 📜 STORY-008: Login do Aluno (CPF Lookup)
**Descrição:** O aluno acessa a URL da academia e loga usando CPF, sem precisar lembrar e-mail.

**Cenários:**
1.  Aluno entra em `clubfit.app/ironberg`. Vê logo da Ironberg.
2.  Digita CPF. Sistema pede senha.
3.  Digita senha. Entra.

**Regras de Negócio:**
1.  O sistema deve identificar o `academy_id` baseado na URL (slug).
2.  Login só permitido se o aluno estiver `ACTIVE` nesta academia.

**Critérios de Aceite:**
- [ ] Identidade visual correta na tela de login.
- [ ] Fluxo de "Primeiro Acesso" (Definir senha se não tiver).

**Detalhamento Técnico:**
-   Middleware para resolver Slug -> Academy ID.
-   Server Action para buscar email atrelado ao CPF (Security Definer).

**Detalhamento de UX:**
-   Mobile-first. Teclado numérico no CPF.
-   Feedback de carregamento ("Buscando seu cadastro...").

**Detalhamento do Banco de Dados:**
-   Select em `academies` (pelo slug).
-   Select em `students` (pelo cpf).

**Riscos:**
-   Enumeration Attack (descobrir quais CPFs têm cadastro).
**Mitigação:** Rate limiting e mensagens de erro genéricas ("Credenciais inválidas").

**Cenários de Testes:**
-   Acessar URL de academia inexistente (404).

---

## 📜 STORY-009: Marketplace de Benefícios (Feed)
**Descrição:** Tela principal do aluno listando todas as ofertas disponíveis.

**Cenários:**
1.  Aluno vê lista vertical de cards.
2.  Cada card tem: Logo do parceiro, Título ("15% Off"), Categoria ("Comida").

**Regras de Negócio:**
1.  Mostrar apenas benefícios `ACTIVE`.
2.  Mostrar apenas benefícios de parceiros `ACTIVE`.

**Critérios de Aceite:**
- [ ] Scroll infinito ou paginação (se tiver muitos).
- [ ] Carregamento rápido de imagens.

**Detalhamento Técnico:**
-   Grid CSS responsivo.
-   Imagens otimizadas (Next/Image).

**Detalhamento de UX:**
-   Visual "App Like". Bottom Navigation (Início, Carteira, Perfil).

**Detalhamento do Banco de Dados:**
-   Query com JOIN: Benefits -> Partners.

**Riscos:**
-   Imagens pesadas consumindo dados do aluno.
**Mitigação:** Otimização automática do Next.js.

**Cenários de Testes:**
-   Parceiro inativa promoção, aluno dá refresh -> Card some.

---

## 📜 STORY-010: Geração de Token (QR Code Dinâmico)
**Descrição:** Aluno seleciona um benefício e gera o código para apresentar.

**Cenários:**
1.  Aluno clica no card da promoção. Vê detalhes.
2.  Clica em "Gerar Voucher".
3.  Modal abre com QR Code e timer "04:59".

**Regras de Negócio:**
1.  **R03 - Validade:** Token expira em 5 min.
2.  **R04 - Uso Único:** Cria registro com status `PENDING`.
3.  Limitar geração excessiva (ex: max 3 tokens abertos simultâneos) para evitar spam.

**Critérios de Aceite:**
- [ ] QR Code legível.
- [ ] Timer atualizando em tempo real.

**Detalhamento Técnico:**
-   Server Action `generateToken(benefit_id)`.
-   Lib `react-qr-code` no front.

**Detalhamento de UX:**
-   Tela limpa, brilho da tela aumentado (se possível via API browser) ou recomendação de aumentar brilho.
-   Botão "Cancelar Voucher".

**Detalhamento do Banco de Dados:**
-   INSERT em `student_access_tokens`.

**Riscos:**
-   Token expirar enquanto aluno está na fila.
**Mitigação:** Botão "Renovar" fácil de acessar se expirado.

**Cenários de Testes:**
-   Gerar token, esperar 5 min, tentar validar (deve falhar).

---

## 📜 STORY-011: Validação de Token (Painel Parceiro)
**Descrição:** O parceiro finaliza a transação lendo o QR Code.

**Cenários:**
1.  Parceiro clica "Ler QR". Câmera abre.
2.  Lê o código do aluno.
3.  Tela Verde: "Validado! 15% de Desconto".

**Regras de Negócio:**
1.  Validação atômica (Lock de linha no banco) para evitar "Double Spending".
2.  Registrar `used_at` e mudar status para `USED`.

**Critérios de Aceite:**
- [ ] Funcionar em Android e iOS (navegador).
- [ ] Feedback visual inconfundível (Sucesso vs Erro).

**Detalhamento Técnico:**
-   Lib `react-qr-reader` ou API nativa de BarcodeDetection.
-   Rpc function `validate_token(token_string)`.

**Detalhamento de UX:**
-   Sons de "Beep" ao validar (feedback auditivo).
-   Vibração (Haptic feedback).

**Detalhamento do Banco de Dados:**
-   UPDATE `student_access_tokens`.
-   INSERT `benefit_usages` (Histórico permanente).

**Riscos:**
-   Internet lenta no estabelecimento.
**Mitigação:** Loader otimista e tratamento de timeout.

**Cenários de Testes:**
-   Tentar validar o mesmo QR Code duas vezes seguidas.
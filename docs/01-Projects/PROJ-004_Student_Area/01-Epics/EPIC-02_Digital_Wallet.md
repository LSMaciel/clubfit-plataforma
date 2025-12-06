# EPIC-02: Carteira Digital (QR Code)

**Projeto:** PROJ-004 (Área do Aluno)
**Status:** Planejamento

## 1. Descrição
Implementação da funcionalidade central de validação. O aluno gera um QR Code (Voucher) que será lido pelo estabelecimento parceiro. Este código deve ser seguro, único e expirável.

## 2. Histórias de Usuário

### STORY-003: Geração de QR Code
**Como:** Aluno
**Quero:** Clicar num botão para gerar meu código de acesso
**Para:** Mostrar ao parceiro e validar meu desconto.

#### Cenários de Teste
1.  **Gerar:** Clicar em "Gerar Cartão" -> Exibe modal com QR Code.
2.  **Expirar:** Aguardar 5 minutos -> O código some ou avisa que expirou.
3.  **Renovar:** Fechar e abrir de novo -> Gera um *novo* código (token diferente).

#### Regras de Negócio
*   **R03:** Token expira em 5 minutos.
*   **Unicidade:** Cada clique gera um registro novo na tabela `student_access_tokens`.
*   O QR Code deve conter o UUID do token gerado (não o CPF direto, para evitar fraude estática).

#### Detalhamento Técnico
*   **DB:** Insert em `student_access_tokens (student_id, token: uuid, expires_at: now()+5min)`.
*   **Lib Frontend:** `react-qr-code`.
*   **Valor do QR:** Um JSON ou String simples contendo o UUID do token. Ex: `{"t": "uuid-v4...", "c": "cpf-parcial"}`.
*   **Segurança:** O Back-end não deve aceitar gerar token se aluno estiver INACTIVE.

#### UX
*   Modal Fullscreen ou Card centralizado.
*   Brilho da tela (opcional: sugerir aumento).
*   Contador regressivo visual ("Válido por 04:59").

#### Detalhamento de Banco de Dados
*   Tabela `student_access_tokens` já existe.
    *   `token` (UUID, PK)
    *   `student_id` (FK)
    *   `created_at`
    *   `expires_at`
    *   `status` (PENDING, USED, EXPIRED)

#### Riscos
*   Usuário printar a tela. (Mitigação: O parceiro ao ler vai validar no banco. Se o aluno mandou o print pro amigo e o amigo usou, quando o aluno tentar usar o dele vai dar "Já utilizado" ou "Expirado" se passar o tempo).

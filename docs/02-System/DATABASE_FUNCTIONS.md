
# Funções de Banco de Dados (RPCs)

Este documento lista as *Stored Procedures* (funções armazenadas) criadas para encapsular lógica de negócios complexa diretamente no PostgreSQL.

---

## 1. `validate_token` (STORY-011)

**Objetivo:** Validar um token de acesso (QR Code) apresentado pelo aluno. Garante atomicidade da transação para evitar duplo uso e verifica regras de propriedade.

**Segurança:** `SECURITY DEFINER` (Executa com privilégios de owner para permitir UPDATE em tabelas protegidas, mas valida permissões internamente via código).

**Parâmetros:**
*   `token_code` (TEXT): O código UUID do voucher.

**Retorno (JSON):**
```json
{
  "success": true,
  "message": "Voucher validado com sucesso!",
  "student": "Nome do Aluno",
  "benefit": "Nome do Benefício"
}
```

**Lógica Interna:**
1.  Busca usuário logado (`auth.uid()`).
2.  Busca Token + Benefício + Aluno.
3.  Verifica se Token existe.
4.  Verifica se Token já foi usado (`VALIDATED`).
5.  Verifica se Token expirou.
6.  **Verifica Permissão:**
    *   Se usuário for `PARTNER`: Benefício deve pertencer à loja dele.
    *   Se usuário for `ACADEMY_ADMIN`: Benefício deve pertencer à academia dele.
7.  **Transação:**
    *   UPDATE `student_access_tokens` -> 'VALIDATED'.
    *   INSERT `benefit_usages`.

# STORY-10A-01: Atualização de Schema e Seeds

**Épico:** EPIC-10A
**Status:** Planejado

## 1. Descrição
Implementar as novas colunas na tabela `partners` para suportar informações de contato, horários e mídia. Além disso, criar um script de seed que atualize os parceiros existentes com dados fictícios verossímeis para permitir o teste imediato do frontend.

## 2. Regras de Negócio
*   **RN02 (Validação):** Campos de URL devem aceitar nulos, mas se preenchidos, devem ser strings válidas.
*   **Estrutura JSON:** O campo `opening_hours` deve seguir o padrão:
    ```json
    {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" }
      ...
    }
    ```

## 3. Critérios de Aceite
1.  **Migração Sucesso:** O script SQL roda sem erros em um banco já populado.
2.  **Dados Ricos:** Ao consultar um parceiro via SQL após o seed, ele possui `whatsapp`, `instagram`, `opening_hours` e `amenities` preenchidos.
3.  **Idempotência:** O script pode ser rodado múltiplas vezes sem duplicar dados ou causar erro.

## 4. Detalhamento Técnico (Banco de Dados)
*   **Arquivo:** `docs/02-System/migration_scripts/023_enhance_partner_schema.sql`
*   **Comandos:** `ALTER TABLE`, `UPDATE partners SET ...`

## 5. Riscos e Mitigação
*   *Risco:* Perda de dados existentes.
    *   *Mitigação:* Usar `ADD COLUMN IF NOT EXISTS`.

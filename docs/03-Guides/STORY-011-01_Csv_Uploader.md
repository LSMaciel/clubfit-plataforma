# STORY-011-01: Componente de Upload e Preview CSV

**Vinculado ao Projeto:** PROJ-011

## 1. Descrição e Objetivos
*   **Ator:** Admin da Academia.
*   **Objetivo:** Fazer upload de um arquivo CSV e visualizar os dados antes de confirmar.
*   **Valor:** Garantir que o usuário não suba dados errados (colunas trocadas, lixo).

## 2. Regras de Negócio & Critérios de Aceite
1.  [ ] O componente deve aceitar apenas arquivos `.csv`.
2.  [ ] Deve validar, no cliente, se as colunas obrigatórias existem: `name`, `cpf` (headers).
3.  [ ] Deve exibir um preview dos 5 primeiros registros.
4.  [ ] Deve exibir alerta se o arquivo tiver mais de 500 linhas.

## 3. Detalhamento Técnico
*   **Arquivos Afetados:**
    *   `[NEW] components/admin/students/csv-uploader.tsx` (Componente visual + Dropzone).
    *   `[NEW] components/admin/students/import-preview-table.tsx` (Tabela simples).
*   **Dependências:**
    *   `papaparse` (Instalar se não houver, ou usar CDN/Module).
*   **Fluxo de Dados:**
    *   `File` -> `Papa.parse()` -> `Array<StudentRow>` -> `State` -> Tabela.

## 4. Detalhamento de UX/UI
*   **Estados:**
    *   *Idle:* "Arraste seu arquivo aqui".
    *   *Parsing:* Spinner.
    *   *Preview:* Tabela com botão "Confirmar" e "Cancelar".
    *   *Error:* "Arquivo inválido: Coluna CPF não encontrada".

## 5. Riscos e Mitigações
*   **Risco:** Encoding errado (Excel salvando em Latin1 vs UTF-8).
*   **Mitigação:** PapaParse costuma lidar bem, mas forçar encoding UTF-8 na leitura se possível.

## 6. Cenários de Teste
1.  Arrastar arquivo `.pdf` -> Deve rejeitar.
2.  Arrastar CSV válido -> Deve mostrar tabela.
3.  Arrastar CSV sem coluna CPF -> Deve mostrar erro de validação.

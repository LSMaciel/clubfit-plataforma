# PROJ-011: Importação em Massa de Alunos (CSV)

**Status:** Planejamento
**Prioridade:** Alta (Feature "sumida")

## 1. Descrição e Objetivos
Permitir que a Academia cadastre centenas de alunos simultaneamente através do upload de um arquivo CSV simples. Isso resolve a dor de "cadastrar um a um" e bloqueia a entrada de novos clientes grandes.

*   **Objetivo:** Criar um fluxo de Importação -> Validação -> Persistência.
*   **Valor:** Redução drástica no tempo de onboarding de novas academias.

## 2. Regras de Negócio
1.  **Padronização de Arquivo:** O CSV deve ter colunas específicas (Nome, CPF, Email, Telefone).
2.  **Validação de CPF:**
    *   Formato deve ser validado (11 dígitos).
    *   Deve verificar duplicidade no banco (CPF Global Único).
3.  **Feedback Granular:** O sistema deve informar exatamente quais linhas falharam e porquê (ex: "Linha 4: CPF Inválido").
4.  **Limite de Lote:** Para evitar timeout, limitar a 500 alunos por arquivo no MVP.
5.  **Sanitização:** Remover caracteres especiais de CPFs e Telefones antes de salvar.

## 3. Critérios de Aceite
- [ ] Botão "Importar CSV" visível na tela de Alunos.
- [ ] Modal ou Página de Upload que aceita `.csv`.
- [ ] Preview dos dados lidos antes do envio final.
- [ ] Relatório de sucesso/erro após o processamento (ex: "450 importados, 2 erros").
- [ ] Links para download de um "Modelo de Planilha.csv".

## 4. Detalhamento de UX/UI
*   **Local:** `app/admin/(authenticated)/students/page.tsx` -> Novo botão secundário.
*   **Fluxo:**
    1.  Clique em "Importar".
    2.  Modal abre com área de drag-and-drop.
    3.  Usuário solta o arquivo.
    4.  Sistema lê o CSV no cliente (PapaParse) e mostra tabela de preview.
    5.  Usuário clica em "Confirmar Importação".
    6.  Barra de progresso ou Spinner.
    7.  Feedback final de linhas inseridas vs ignoradas.

## 5. Detalhamento Técnico
*   **Lib:** `papaparse` para leitura client-side.
*   **Componentes Novos:**
    *   `CsvUploader.tsx`: Área de drop e parsing.
    *   `ImportPreviewTable.tsx`: Tabela temporária para conferência.
*   **Server Action:** `importStudentsAction(utils/students)`: Recebe array de objetos, tenta inserir, retorna relatório.
*   **Performance:** Usar `upsert` ou `insert` em batch (Supabase suporta arrays).

## 6. Detalhamento de Banco de Dados
*   Nenhuma alteração de schema necessária (Tabela `students` já existe).
*   Utilizará a estrutura existente: `full_name`, `cpf`, `email`, `phone`, `academy_id`.

## 7. Riscos e Mitigação
*   **Risco:** Timeout em arquivos grandes (>1000 linhas).
    *   **Mitigação:** Limite hardcode de 500 linhas no frontend.
*   **Risco:** CPFs duplicados pararem a importação inteira.
    *   **Mitigação:** Usar `ignoreDuplicates` ou tratar erro linha a linha no backend (melhor: filtrar duplicados no client check antes de enviar, ou enviar em batch e retornar os rejeitados).

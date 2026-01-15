# Módulo: Students (Gestão de Alunos)

**Responsabilidade:** Gerenciar o cadastro, visualização e importação de alunos da academia.

## Estrutura de Arquivos

### Páginas (`app`)
*   `page.tsx`: Lista principal de alunos (Server Component).
*   `new/page.tsx`: Formulário de cadastro manual.
*   `actions.ts`: Server Actions (Create, Import).

### Componentes (`components/admin/students`)
*   `csv-uploader.tsx`: Área de drag-and-drop e parsing de CSV (Client Component).
*   `import-preview-table.tsx`: Visualização de dados antes da persistência.

## Dependências
*   **Banco de Dados:** Tabela `students`.
*   **Libs:** `papaparse` (CSV).
*   **UI:** `PageShell`, `Button`.

## Regras Locais
## Regras Locais
1.  **CPF Único:** A Server Action `importStudents` consulta o banco antes de inserir para filtrar duplicados.
2.  **Limite:** Upload limitado a 500 linhas.
3.  **Sanitização:** CPFs são limpos (apenas números) antes da persistência.

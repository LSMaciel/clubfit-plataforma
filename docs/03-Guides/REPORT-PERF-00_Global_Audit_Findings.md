# REPORT-PERF-00: Resultados da Auditoria Global

**Data:** 15/01/2026
**Autor:** Antigravity Agent
**Contexto:** Otimização de Performance (PROJ-PERF-01)

## 1. Análise do Bundle (Front-end)
Baseado nos relatórios gerados (`client.html`):

*   **Ofensor 1: Bibliotecas de QR Code (`zxing-js`, `html5-qrcode`)**
    *   **Diagnóstico:** O pacote `zxing-js.umd.js` é massivo e está aparecendo como um chunk grande.
    *   **Impacto:** Se este código estiver sendo carregado no `layout.tsx` ou em páginas que não usam scanner, está prejudicando o TTI (Time to Interactive) global.
    *   **Recomendação:** Implementar `dynamic import` para o componente de Scanner, garantindo que essas libs só baixem quando o usuário clicar em "Escanear".

*   **Ofensor 2: Recharts**
    *   **Diagnóstico:** `recharts` ocupa um espaço considerável.
    *   **Recomendação:** Verificar se está sendo importado no Dashboard. Se sim, manter o Dashboard como uma rota carregada sob demanda (que já é o padrão do Next.js), mas garantir que componentes compartilhados não estejam puxando o Recharts para o bundle principal (`main.js`).

## 2. Análise de RLS (Banco de Dados)
Baseado no dump de policies:

*   **Padrão Recorrente:** Subqueries aninhadas.
    *   Exemplo (`partners`): `EXISTS (SELECT 1 FROM academy_partners ap JOIN users u ...)`
    *   **Risco:** O Postgres executa essa subquery para *cada linha* que ele tenta mostrar. Se você tiver 1.000 parceiros e 100 academias, isso pode escalar mal sem índices perfeitos.

*   **Índices Faltantes (Hipótese):**
    *   Precisamos garantir que `academy_partners` tenha um índice composto: `CREATE INDEX idx_ap_academy_partner ON academy_partners(academy_id, partner_id);`
    *   Precisamos garantir que `users` tenha índice em `academy_id`.

## 3. Próximos Passos (Plano de Ação)

### Ação Imediata (Lazy Loading)
Criar uma "Story" para refatorar o `QRScanner` e `Recharts` para serem carregados via `next/dynamic`.

### Ação de Banco (Indexação)
Criar um script de migração SQL para adicionar os índices de performance nas chaves estrangeiras identificadas acima.

### Ação de Login (Já planejada)
Seguir com a Otimização do Login (STORY-PERF-01-02), já que o Middleware já foi ajustado.

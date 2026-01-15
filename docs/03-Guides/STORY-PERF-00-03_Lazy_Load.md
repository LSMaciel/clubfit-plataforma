# STORY-PERF-00-03: Lazy Loading de Bibliotecas Pesadas

**Vinculado ao Projeto:** PROJ-PERF-01

## 1. Descrição e Objetivos
*   **Ator:** Frontend Dev.
*   **Objetivo:** Remover bibliotecas pesadas (`zxing`, `recharts`) do bundle principal (que carrega em todas as páginas) e carregá-las apenas quando necessárias.
*   **Valor:** Diminuir o tempo de download inicial do site (TTI), economizando dados do usuário mobile.

## 2. Diagnóstico Técnico
O `bundle-analyzer` mostrou:
1.  **Scanner de QR Code:** Está sendo importado estaticamente, possivelmente em algum layout ou componente compartilhado.
2.  **Recharts:** Idem.

## 3. Solução Proposta (Code Splitting)

### A. Scanner Dinâmico
*   **Arquivo:** Onde o scanner for usado (ex: `validate/page.tsx`).
*   **Ação:** Usar `next/dynamic`.
    ```tsx
    const QrReader = dynamic(() => import('react-qr-code'), { 
      loading: () => <Skeleton className="w-64 h-64" />,
      ssr: false 
    })
    ```

### B. Gráficos sob Demanda
*   **Arquivo:** `dashboard/page.tsx`
*   **Ação:** Garantir que o Dashboard inteiro ou os widgets de gráfico sejam carregados dinamicamente se estiverem impactando outras rotas.

## 4. Detalhamento Implementação
1.  Identificar todos os `import ... from 'html5-qrcode'` e `import ... from 'recharts'`.
2.  Substituir por `dynamic()`.

## 5. Critérios de Aceite
1.  [ ] O report do `bundle-analyzer` (client.html) deve mostrar `zxing` e `recharts` em chunks separados (cores diferentes), não dentro do bloco principal.
2.  [ ] A funcionalidade de Scanner e Gráficos deve continuar funcionando normalmente (apenas com um leve delay de loading na primeira vez q abrir).

## 6. Riscos
*   **Flash de Loading:** O usuário vai ver um skeleton antes do scanner abrir. (Aceitável).

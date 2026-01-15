# STORY-PERF-03: Otimização de Imagens (Next/Image)

**Status:** Planejamento
**Data:** 13/01/2026
**Responsável:** AI Agent

---

## 1. Contexto
A aplicação atualmente carrega imagens de benefícios usando tags HTML `<img>` padrão.
Isso faz com que o navegador baixe a imagem original enviada para o Storage (ex: 5MB), mesmo que ela seja exibida em um espaço de 300x200px.
Para usuários móveis (4G), isso consome muita banda e torna o scroll lento.

## 2. Solução Técnica

### 2.1. Configuração do Next.js
*   Adicionar o domínio do Supabase (`.supabase.co`) no `next.config.mjs` em `remotePatterns`.

### 2.2. Componente `BenefitCard`
*   Substituir `<img>` por `next/image`.
*   Propriedades recomendadas:
    *   `width` e `height` (ou `fill` com parent relative).
    *   `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` (ajustar conforme grid).
    *   `quality={75}` (padrão 75 é bom).

## 3. Critérios de Aceite
1.  Imagens devem carregar no formato WebP/AVIF (verificar Network tab).
2.  Tamanho do arquivo baixado deve ser na ordem de KB, não MB.
3.  Layout não deve quebrar (manter aspect ratio e cover).

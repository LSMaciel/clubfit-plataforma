# STORY-PERF-02: Otimização de Consultas (Parallel Fetching)

**Status:** Planejamento
**Data:** 13/01/2026
**Responsável:** AI Agent

---

## 1. Contexto e Problema
A página de benefícios (`app/[slug]/benefits/page.tsx`) apresenta um comportamento de "Waterfall" (Cascata) nas requisições ao banco de dados.
Atualmente, o servidor realiza as operações sequencialmente:
1.  Busca Academia (await)
2.  Busca Vínculos de Parceiros (await)
3.  Busca Benefícios (await)

Isso soma os tempos de latência (`T1 + T2 + T3`), causando lentidão desnecessária no carregamento da página.

## 2. Solução Técnica
Implementar o padrão **Parallel Data Fetching** utilizando `Promise.all`.
As consultas que não dependem estritamente do resultado **imediato** uma da outra para iniciar devem ser disparadas simultaneamente.

### 2.1. Estratégia
1.  Isolar a busca da **Academia** (necessária para saber o ID e cor).
2.  Paralelizar a busca de **Parceiros Filtrados** e **Benefícios** quando possível, ou otimizar a query para reduzir round-trips.
    *   *Nota:* Para buscar benefícios, precisamos saber os IDs dos parceiros válidos. Portanto, a dependência *existe*, mas podemos otimizar a forma como os dados são trazidos ou buscar dados independentes (ex: configs de usuário) em paralelo se houver.
    *   **Refinamento:** Neste caso específico, a busca de benefícios depende dos parceiros. Porém, podemos otimizar validando se realmente precisamos de duas queries separadas ou se podemos fazer um `join` mais eficiente ou buscar tudo de uma vez.
    *   **Estratégia Adotada:** Manter a busca da Academia (primeira etapa). Tentar buscar os vínculos e outras informações auxiliares em paralelo se possível. Se a dependência for forte (Benefícios dependem de Vínculos), focaremos em deixar a query mais limpa ou usar uma única query com JOIN se o Supabase permitir facilmente sem complicar o RLS.

    *   **Abordagem Alternativa (Melhor):**
        O Supabase permite filtrar inner joins. Podemos tentar buscar os benefícios filtrando diretamente pela tabela de `academy_partners` em uma única query elaborada, ou manter a lógica atual mas garantir que não haja *outros* awaits bloqueantes no meio (ex: auth check, user profile check).

    *   **Otimização Real (Low Hanging Fruit):**
        Atualmente:
        `await params`
        `await searchParams`
        `await supabase.from('academies')...`
        `await supabase.from('partner_links')...`
        `await supabase.from('benefits')...`
        
        A verificação de usuário (Auth) e a busca da Academia podem rodar juntas inicialmente?
        Não, pois o `createClient` é síncrono, mas chamadas de banco são assíncronas.
        
        Vamos focar em:
        1. Iniciar a busca da Academia.
        2. Iniciar a busca do Usuário (se houver lógica de user no futuro).
        
        Na implementação atual do arquivo (analisado anteriormente), a lógica é:
        1. Resolve Params.
        2. Busca Academia.
        3. Busca Links de Parceiros.
        4. Busca Benefícios.

        Podemos melhorar a lógica de "Links de Parceiros" e "Busca de Benefícios". Em vez de buscar IDs e depois buscar Benefits `in` IDs, podemos fazer uma query só nos Benefícios fazendo join com `academy_partners`?
        O Supabase suporta filtros em tabelas relacionadas `!inner`.
        
        Query Otimizada Proposta:
        Buscar Benefícios onde o `partner_id` está presente na tabela `academy_partners` filtrada pela `academy_id` atual.
        Isso eliminaria a Query 2 (busca de IDs) completamente, reduzindo para 2 queries totais (Academia + Benefícios) em vez de 3.

---

## 3. Critérios de Aceite
1.  Redução do número de `await` sequenciais críticos.
2.  A página deve continuar exibindo apenas benefícios de parceiros ATIVOS e VINCULADOS à academia atual.
3.  Não deve haver regressão na funcionalidade de filtro por parceiro (`?partner_id=...`).

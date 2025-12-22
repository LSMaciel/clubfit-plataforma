# EPIC-12A: Estrutura de Dados e Lógica (Backend)

## Visão Geral
Preparar a fundação do sistema, criando a estrutura de banco de dados flexível (JSONB) e populando com dados de teste para viabilizar o desenvolvimento dos frontends.

---

## Histórias de Usuário

### STORY-12A-01: Migração de Schema (JSONB)

*   **Nome:** Criação de Colunas Dinâmicas na Tabela Benefits
*   **Descrição:** Alterar a tabela `benefits` existente para suportar a configuração de diferentes tipos de promoção e suas regras de negócio, utilizando colunas JSONB para flexibilidade futura.
*   **Cenários:**
    *   **Cenário 1:** Banco de dados existente sem as colunas novas -> Script roda e adiciona colunas `type`, `config`, `rules`.
    *   **Cenário 2:** Tabela com benefícios antigos -> Script define `type='STANDARD'` para não quebrar legados.
*   **Regras de Negócio:**
    *   **RN01:** O campo `type` deve ser um ENUM (texto restrito): `DISCOUNT_PERCENTAGE`, `DISCOUNT_FIXED`, `DEAL_BOGO`, `GIFT`, `FREE_SHIPPING`.
    *   **RN02:** Os campos `config` e `rules` não podem ser nulos (default `{}`).
*   **Critérios de Aceite:**
    *   Execução do script SQL retorna sucesso.
    *   Colunas `type`, `config`, `constraints` visíveis no schema.
    *   Nenhum dado existente foi perdido.
*   **Detalhamento Técnico:**
    *   Migration File: `docs/02-System/migration_scripts/030_enhance_benefits_schema.sql`
    *   DDL:
        ```sql
        ALTER TABLE benefits 
        ADD COLUMN type text DEFAULT 'STANDARD',
        ADD COLUMN configuration jsonb DEFAULT '{}',
        ADD COLUMN constraints jsonb DEFAULT '{}';
        ```
*   **Detalhamento de UX:** N/A (Backend puro).
*   **Detalhamento do Banco de Dados:**
    *   Tabela impactada: `public.benefits`.
    *   Novo índice: `CREATE INDEX idx_benefits_type ON benefits(type);`
*   **Riscos:**
    *   Quebra de compatibilidade com app antigo.
*   **Mitigação dos Riscos:**
    *   Manter colunas legadas (`description`, `rules` text) funcionando em paralelo ou sincronizadas.
    *   Default value 'STANDARD' garante que código velho não crasha ao ler tipos desconhecidos.
*   **Cenários de Testes:**
    *   `SELECT * FROM benefits LIMIT 1` após update.

---

### STORY-12A-02: Seed de Promoções

*   **Nome:** População de Promoções de Teste (Mock)
*   **Descrição:** Inserir registros na tabela `benefits` representando cada um dos 5 tipos novos, vinculados à "Pizzaria QA", para que o time de Frontend possa testar a visualização.
*   **Cenários:**
    *   **Cenário 1:** Desenvolvedor roda o script de seed -> Banco é populado com 5 ofertas ativas.
*   **Regras de Negócio:**
    *   As promoções devem ter configurações válidas (ex: BOGO com `buy_qty` > 0).
*   **Critérios de Aceite:**
    *   Query `SELECT * FROM benefits WHERE partner_id = '...'` retorna 5 linhas, uma de cada tipo.
*   **Detalhamento Técnico:**
    *   Script: `031_seed_advanced_promotions.sql`.
    *   Payloads JSON reais (ex: `{"percent": 15}`).
*   **Detalhamento de UX:** N/A.
*   **Detalhamento do Banco de Dados:** Apenas inserts (DML).
*   **Riscos:**
    *   Dados conflitarem com validações de UI futuras se não forem realistas.
*   **Mitigação dos Riscos:**
    *   Usar dados sensatos (ex: 10% de desconto, não 1000%).
*   **Cenários de Testes:**
    *   Verificar JSON no banco após insert.

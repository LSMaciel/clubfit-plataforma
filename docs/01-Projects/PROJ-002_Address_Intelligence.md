# PROJ-002: Cadastro de Endereço Inteligente (BrasilAPI)

**Status:** Aprovado
**Data:** 2025-12-05

## 1. Objetivo
Modernizar o sistema de cadastro de endereços (Parceiros e Academias) implementando busca automática por CEP e geolocalização automática (Latitude/Longitude) utilizando a BrasilAPI v2. Isso visa reduzir erros de digitação, agilizar o onboarding e preparar a base de dados para futuras features geoespaciais (mapa de calor, busca por raio).

## 2. Escopo
### Dentro do Escopo
*   Alteração estrutural do Banco de Dados (Tabelas `partners` e `academies` mudam de um campo `address` simples para múltiplos campos estruturados).
*   Criação de componente React reutilizável (`AddressForm`) para gestão de estados de endereço.
*   Integração com BrasilAPI (Endpoint CEP v2).
*   Atualização dos formulários de "Novo Parceiro" e "Nova Academia".
*   Tratamento de fallback (edição manual) em caso de falha da API.

### Fora do Escopo
*   Funcionalidades de mapa no Frontend (ex: Google Maps visual).
*   Busca de parceiros por proximidade (esta é uma feature futura que consumirá os dados gerados aqui).
*   Alteração no cadastro de Alunos (nesta fase MVP não coletamos endereço de aluno).

## 3. Regras de Negócio
1.  **Fonte da Verdade:** O CEP ditado pelo usuário é a chave primária de busca.
2.  **Autonomia do Usuário (Fallback):** O sistema NUNCA deve bloquear o cadastro se a API estiver fora do ar. Todos os campos (Rua, Bairro, Cidade) devem permitir edição manual em caso de erro ou dados desatualizados na base oficial.
3.  **Geolocalização:** Latitude e Longitude devem ser salvos automaticamente sempre que possível.
4.  **Imutabilidade do Estado:** Se o usuário trocar o UF manualmente para um valor inválido, o sistema deve aceitar (confiança no input humano vs máquina).

## 4. Detalhamento Técnico
### Integração BrasilAPI
*   **Endpoint:** `GET https://brasilapi.com.br/api/cep/v2/{cep}`
*   **Timeout:** 5 segundos (se passar disso, libera manual).
*   **Cache:** Opcional (Front-end pode cachear requisições repetidas na sessão).

### Banco de Dados (Supabase)
Migração de schema para as tabelas `public.partners` e `public.academies`:
*   `zip_code` (VARCHAR(8/9))
*   `street` (VARCHAR)
*   `number` (VARCHAR) -> *Único campo manual obrigatório pós-ce*
*   `sub_neighborhood` (VARCHAR / Bairro)
*   `city` (VARCHAR)
*   `state` (VARCHAR(2))
*   `complement` (VARCHAR - Opcional)
*   `latitude` (NUMERIC/FLOAT)
*   `longitude` (NUMERIC/FLOAT)

### UX/UI
*   **Input Mask:** CEP deve ter máscara `99999-999`.
*   **Feedback Visual:** Spinner/Skeleton enquanto busca o CEP.
*   **Foco Automático:** Após buscar o CEP, o cursor deve pular automaticamente para o campo `number`.

## 5. Matriz de Riscos
| Risco | Impacto | Mitigação |
| :--- | :--- | :--- |
| BrasilAPI fora do ar | Alto (Bloqueio) | Implementar botão ou timeout que habilita edição manual dos campos. |
| Coordenadas imprecisas | Baixo | Utilizar as coords apenas para raio aproximado, não para navegação turn-by-turn. |
| Migração de dados legados | Médio | Criar script para tentar quebrar o texto antigo `address` em novos campos ou apenas deixá-lo como "legado" e pedir atualização no próximo login. (Decisão: Manter `address` antigo como backup ou 'street' genérico temporariamente). |

## 6. Critérios de Aceite Geral
- [ ] Cadastro de Parceiro salva endereço particionado no banco.
- [ ] Cadastro de Academia salva endereço particionado no banco.
- [ ] Digitar CEP preenche Rua, Bairro, Cidade, UF.
- [ ] Latitude e Longitude são salvos no banco.
- [ ] É possível cadastrar mesmo se a internet cair (modo manual).

# PROJ-010: Enriquecimento de Perfil do Parceiro

**Status:** Draft
**Data de Criação:** 21/12/2025
**Épicos Relacionados:** EPIC-10A, EPIC-10B

## 1. Descrição
O projeto visa transformar a experiência de descoberta de parceiros no aplicativo do aluno. Atualmente, o parceiro é exibido apenas como um card com informações mínimas. O objetivo é criar uma **Página de Perfil do Parceiro** rica e detalhada, que funcione como uma "mini landing page" para cada estabelecimento, fornecendo informações cruciais como horário de funcionamento em tempo real, links diretos de contato (WhatsApp, Instagram), galeria de fotos e facilidades (comodidades).

Isso aumentará a conversão (visitas físicas) e o engajamento do aluno com o App, além de valorizar a vitrine para o parceiro comercial.

## 2. Regras de Negócio (RN)

*   **RN01 - Status de Funcionamento:** O status (Aberto/Fechado) deve ser calculado no aplicativo do aluno (client-side) com base no fuso horário do dispositivo do usuário, comparando com a tabela de horários JSON do parceiro.
*   **RN02 - Validação de Contatos:**
    *   **WhatsApp:** Deve conter apenas números (ex: `5511999999999`) para garantir funcionamento da API `wa.me`.
    *   **Instagram:** Pode ser a URL completa ou apenas o `@username`. O sistema deve tratar ambos.
*   **RN03 - Link de Mapas (Custo Zero):** Não utilizar SDKs pagos de mapas (Google Maps API Embed). O sistema deve utilizar *Deeplinks* (URLs `geo:` ou `https://www.google.com/maps/dir/?api=1...`) que forçam a abertura do aplicativo nativo (Waze/Maps) instalado no celular do usuario.
*   **RN04 - Herança de Endereço:** Se o parceiro não tiver coordenadas (Lat/Long) cadastradas, o botão de mapa deve buscar pelo endereço em texto (Query Search). Se tiver coordenadas, deve usar lat/long para precisão.

## 3. Critérios de Aceite (DoA - Definition of Done)

1.  **Schema de Banco de Dados:** Tabela `partners` atualizada com colunas para `opening_hours` (JSON), `socials` (Insta, Whats, Site, Phone), `gallery` (Array Text) e `amenities` (Array Text).
2.  **Visualização no App:** O aluno consegue clicar em um parceiro na Home e acessar a página de detalhes.
3.  **Contatos Funcionais:** O clique no botão "WhatsApp" abre o app do WhatsApp com uma mensagem pré-definida. O mesmo para Instagram e Telefone.
4.  **Status Real-time:** O badge "Aberto Agora" ou "Fechado" reflete corretamente a hora atual vs. horário cadastrado.
5.  **Sem Erros de Layout:** O layout se adapta se o parceiro não tiver fotos ou não tiver Instagram (os botões devem sumir ou ficar desabilitados, não quebrar a tela).

## 4. Detalhamento Técnico

### 4.1. Banco de Dados (PostgreSQL/Supabase)
Alteração na tabela `public.partners`:
*   `opening_hours` (JSONB): Estrutura `{'monday': {'open': '08:00', 'close': '18:00'}, ...}`.
*   `whatsapp` (TEXT): `5511999999999`.
*   `instagram` (TEXT): URL ou Handle.
*   `website` (TEXT): URL.
*   `gallery_urls` (TEXT[]): URLs de imagens (Bucket ou Externas).
*   `menu_url` (TEXT): URL para PDF ou Imagem.
*   `amenities` (TEXT[]): Enum em array `['wifi', 'parking', 'ac', 'kids', 'pet']`.

### 4.2. Frontend (Next.js / React)
*   **Nova Página:** `app/student/(app)/[academySlug]/partner/[partnerId]/page.tsx`.
*   **Componentes Novos:**
    *   `PartnerHero`: Carrossel de imagens + Logo + Título.
    *   `StatusBadge`: Componente lógico que recebe o JSON de horas e retorna UI verde/vermelha.
    *   `ContactGrid`: Grid de botões de ícones.
    *   `OpeningHoursTable`: Accordion para ver a semana toda.
    *   `AmenitiesList`: Lista horizontal de ícones.

## 5. Detalhamento de UX (User Experience)

*   **Hierarquia:** 
    1.  **Topo (Emocional):** Fotos do ambiente (Galeria) para gerar desejo.
    2.  **Cabeçalho (Identidade):** Logo e Nome.
    3.  **Ação (Conversão):** Botões de "Como Chegar" e "WhatsApp" em destaque imediato.
    4.  **Informação (Racional):** Horários, Comodidades e Descrição.
    5.  **Benefícios (Financeiro):** Lista de ofertas disponíveis.
*   **Feedback Visual:** Se a loja estiver fechada, o badge deve ser evidente, mas não impedir a visualização do perfil.
*   **Empty States:** Se não houver galeria, mostrar um placeholder elegante com a cor da marca.

## 6. Riscos e Mitigação

*   **Risco:** Horários complexos (fechar para almoço, feriados).
    *   *Mitigação:* Inicialmente suportar apenas horário corrido (Abre X, Fecha Y). MVP não tratará intervalos de almoço na V1.
*   **Risco:** Links de mapa abrirem errado.
    *   *Mitigação:* Priorizar Lat/Long no cadastro para precisão exata. Usar fallback de busca por texto apenas se GPS nulo.
*   **Risco:** Imagens pesadas na galeria deixando o app lento.
    *   *Mitigação:* Usar componente `<Image>` do Next.js para otimização automática e definir limite de 5 fotos no cadastro inicial (Seed).

## 7. Estrutura de Entregáveis (Épicos)

### EPIC-10A: Estrutura de Dados e API
Focado no Backend e Dados. Garante que o App tenha o que consumir.

### EPIC-10B: Interface do Aluno (Frontend)
Focado na UI/UX e interatividade no App Mobile.

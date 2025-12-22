# EPIC-12C: Experiência de Consumo (App Aluno)

## Visão Geral
Adaptação da listagem e detalhe do parceiro para renderizar os novos formatos de promoção e garantir que as regras de validação (horário, canal) sejam respeitadas no momento da visualização e clique.

---

## Histórias de Usuário

### STORY-12C-01: Cards de Promoção Inteligentes

*   **Nome:** Renderização Polimórfica de Ofertas
*   **Descrição:** O componente de Card de Benefício deve mudar visualmente dependendo do `type` da promoção recebida do backend.
*   **Cenários:**
    *   **Cenário 1 (Percent):** Mostra Badge vermelho "-15%".
    *   **Cenário 2 (Frete Grátis):** Mostra ícone de moto verde.
    *   **Cenário 3 (BOGO):** Mostra "2x1" em destaque.
*   **Regras de Negócio:**
    *   Deve priorizar a informação mais atrativa (o valor do desconto).
*   **Critérios de Aceite:**
    *   Implementar variantes visuais para os 5 tipos.
    *   Fallback elegante para tipos desconhecidos (padrão antigo).
*   **Detalhamento Técnico:**
    *   Componente `BenefitCard.tsx`.
    *   Função helper `getBenefitBadge(type, config)` que retorna cor/ícone/texto.
*   **Detalhamento de UX:**
    *   Badges coloridos para destacar tipos diferentes.
    *   Ícones da biblioteca `lucide-react`.
*   **Detalhamento do Banco de Dados:**
    *   Leitura dos campos JSONB (`configuration`).
*   **Riscos:**
    *   Design ficar poluído com muitas informações.
*   **Mitigação dos Riscos:**
    *   Mostrar apenas o título principal e 1 badge no card fechado. Detalhes só ao expandir.
*   **Cenários de Testes:**
    *   Visualizar lista na Pizzaria QA (que tem todos os tipos seedados).

---

### STORY-12C-02: Validação de Regras (Client-Side)

*   **Nome:** Verificação de Disponibilidade em Tempo Real
*   **Descrição:** Ao renderizar a promoção, o app deve verificar se as restrições (`constraints`) de horário, dia e canal são atendidas. Se não forem, a promoção aparece desabilitada ou com aviso.
*   **Cenários:**
    *   **Cenário 1 (Dia Errado):** Promoção de "Terça-Feira". Hoje é Quarta. Card aparece cinza (grayscale) com texto "Indisponível hoje".
    *   **Cenário 2 (Horário):** Happy Hour começa 18h. Agora são 17h. Texto "Começa em 1h".
*   **Regras de Negócio:**
    *   Não pode permitir gerar Voucher/Token se a regra não for atendida.
*   **Critérios de Aceite:**
    *   Função de validação `isBenefitAvailable(rules)` cobrindo Dias e Horas.
*   **Detalhamento Técnico:**
    *   Hook customizado `useBenefitAvailability(benefit)`.
    *   Lógica de data com `date-fns`.
*   **Detalhamento de UX:**
    *   Estado "Disabled" visualmente claro.
    *   Mensagem de erro amigável explicando o porquê ("SÓ DELIVERY", "ENCERRADO").
*   **Detalhamento do Banco de Dados:**
    *   Leitura de `constraints` (JSONB).
*   **Riscos:**
    *   Timezone do cliente estar errada.
*   **Mitigação dos Riscos:**
    *   Mostrar horário de referência ou usar horário do servidor se crítico (para MVP, horário do dispositivo é aceitável, com aviso).
*   **Cenários de Testes:**
    *   Mudar relógio do sistema e ver o card ativar/desativar.

---

### STORY-12C-03: Visualização Detalhada (Modal/Pagina)

*   **Nome:** Detalhes da Oferta
*   **Descrição:** Criar uma experiência rica de visualização antes da geração do token. O usuário deve clicar no card e ver todos os detalhes (imagem, regras completas, horário) antes de decidir resgatar.
*   **Cenários:**
    *   **Cenário 1 (Clique no Card):** Abre um modal/drawer com imagem full-width no topo.
    *   **Cenário 2 (Resgate):** Dentro do modal, existe um botão "Resgatar Oferta" fixo no rodapé.
*   **Regras de Negócio:**
    *   A validação de "Disponibilidade" (STORY-12C-02) deve se aplicar também ao botão do modal.
*   **Critérios de Aceite:**
    *   Modal deve mostrar imagem grande, título, descrição longa e regras.
    *   Botão de ação deve ficar sempre visível (sticky footer em mobile).
*   **Detalhamento Técnico:**
    *   Novo componente `BenefitDetailsModal.tsx`.
    *   Refatorar fluxo: `BenefitCard` -> `BenefitDetailsModal` -> `VoucherModal`.
*   **Detalhamento de UX:**
    *   Uso de Sheet/Drawer para mobile (vem de baixo).
*   **Cenários de Testes:**
    *   Abrir card, ler regras, clicar em resgatar.

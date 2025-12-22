# STORY-10B-02: Lógica de Negócio e Interatividade

**Épico:** EPIC-10B
**Status:** Planejado

## 1. Descrição
Conectar a página de perfil às funcionalidades dinâmicas. Implementar a lógica de cálculo de horário (Open/Closed), badges de status, links corretos para WhatsApp/Instagram e renderização condicional de ícones de comodidades.

## 2. Regras de Negócio
*   **RN01 (Status):** Comparar `new Date()` (client-side) com os intervalos do dia atual no JSON `opening_hours`.
*   **RN03 (Mapas):** Gerar link `https://www.google.com/maps/search/?api=1&query={address}` prioritariamente.

## 3. Critérios de Aceite
1.  **Badge Funcional:** Mostra "Aberto" se dentro do horário, "Fechado" se fora.
2.  **Whats:** Abre o app com número correto.
3.  **Ícones:** Se parceiro tem tag 'wifi', ícone de Wifi aparece.

## 4. Detalhamento Técnico
*   **Utils:** Criar `utils/business-hours.ts` para isolar a lógica de verificação de data/hora.
*   **Componentes:** `StatusBadge.tsx`, `ActionGrid.tsx`.

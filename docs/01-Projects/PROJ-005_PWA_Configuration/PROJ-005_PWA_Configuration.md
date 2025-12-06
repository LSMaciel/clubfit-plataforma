# PROJ-005: Transformação PWA (Super App)

**Status:** 🟡 Planejamento
**Data de Criação:** 05/12/2025
**Responsável:** Tech Lead System
**Stack:** Next.js + next-pwa

---

## 1. Descrição do Projeto
Transformar a Área do Aluno (atualmente um site móvel) em um **Progressive Web App (PWA)** instalável. O objetivo é reduzir a fricção de acesso, permitindo que o aluno tenha o ícone do ClubFit (ou da academia) na tela inicial do celular, com suporte a funcionamento offline básico e experiência de tela cheia (sem barra de URL).

## 2. Regras de Negócio
1.  **Instalação Universal:** O app deve ser instalável em Android (Chrome) e iOS (Safari).
2.  **Ícone da Plataforma:** Como a instalação ocorre antes do login, o ícone na tela inicial será o do **ClubFit** (Marca Mãe).
    *   *Nota:* Mudar o ícone dinamicamente para o da academia é tecnicamente complexo/inviável na maioria dos OS atuais sem publicar múltiplos apps nas lojas.
3.  **Offline Fallback:** Se o usuário abrir o app sem internet, deve ver uma tela personalizada "Sem Conexão" em vez do dinossauro do Chrome.
4.  **Cache Strategy:** Assets estáticos (JS, CSS, Imagens do Layout) devem ser cacheados (`Stale-While-Revalidate`). Dados dinâmicos (QR Code, Lista de Parceiros) requerem Network.

## 3. Critérios de Aceite
1.  Ao acessar `/student/login`, o navegador exibe o prompt "Adicionar à Tela Inicial" (ou ícone de instalação).
2.  Lighthouse Audit na categoria PWA deve atingir nota mínima 90 (Green).
3.  O `manifest.json` está configurado corretamente com ícones de todos os tamanhos (192, 512, maskable).
4.  O app abre em modo `standalone` (sem barra de navegador).

## 4. Detalhamento Técnico
### Stack PWA
*   **Lib:** `next-pwa` ou `@ducanh2912/next-pwa` (Fork mantido).
*   **Manifest:** Arquivo `manifest.json` na raiz ou gerado dinamicamente.
*   **Service Worker:** Gerado no build para controlar cache.

### Assets Necessários
*   `icon-192x192.png`
*   `icon-512x512.png`
*   `apple-touch-icon.png`

## 5. Detalhamento de UX
*   **Splash Screen:** Fundo branco com logo do ClubFit centralizado.
*   **Theme Color:** `#0f172a` (Slate 900) para combinar com a barra de status do sistema.
*   **Display:** `standalone` (Experiência imersiva).

## 6. Riscos e Mitigação
| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Cache Invalido:** Usuário ver versão antiga do app com bugs corrigidos. | Média | Alto | Configurar Service Worker com estratégia de atualização agressiva (`skipWaiting: true`). Adicionar versionamento no SW. |
| **iOS Limitado:** iOS não mostra prompt nativo de instalação. | 100% | Médio | Criar um componente "Install Instructions" que detecta iOS e ensina a clicar em "Compartilhar -> Adicionar à Tela Inicial". |

---

## 7. Estrutura de Épicos
1.  [EPIC-01: Configuração e Manifesto](./01-Epics/EPIC-01_PWA_Setup.md)

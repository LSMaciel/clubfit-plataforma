# EPIC-01: Configuração e Manifesto PWA

**Projeto:** PROJ-005 (PWA)
**Status:** Planejamento

## 1. Descrição
Configuração técnica fundamental para transformar o site em um APP instalável. Envolve a criação do Manifesto, geração de ícones e configuração do Service Worker no Next.js.

## 2. Histórias de Usuário

### STORY-005: Configuração do Manifesto e Ícones ✅ (Concluído)
**Como:** Aluno
**Quero:** Poder instalar o ClubFit no meu celular
**Para:** Acessar mais rápido sem digitar o site toda vez.

#### Cenários de Teste
1.  **Lighthouse PWA:** Rodar auditoria no Chrome DevTools -> Passar nos checks de "Installable".
2.  **Android:** Abrir site -> Ver barra "Adicionar ClubFit à tela inicial".
3.  **iOS:** Adicionar manualmente -> Ver ícone correto na Home e Splash Screen simples.

#### Regras de Negócio
*   Nome do App: "ClubFit" (Curto) e "ClubFit Student" (Longo).
*   Cor de fundo: `#ffffff`.
*   Cor do tema: `#0f172a`.

#### Detalhamento Técnico
*   **Instalação de Lib:** `npm install @ducanh2912/next-pwa`.
*   **Arquivo:** `next.config.js` -> Envolver config com `withPWA`.
*   **Arquivo:** `public/manifest.json`.
*   **Assets:** Gerar ícones em `public/icons/`.

#### Detalhamento de UX
*   Garantir que os ícones sejam "Maskable" (adaptáveis ao formato redondo/quadrado do Android).

#### Riscos
*   Conflito com Turbopack (Next.js 15+).
*   *Mitigação:* Se `next-pwa` falhar com Turbo, usar configuração manual de SW ou desativar Turbo para build.

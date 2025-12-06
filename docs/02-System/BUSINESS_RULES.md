# Regras de Negócio Globais (ClubFit)

Este documento centraliza as regras de negócio perenes do sistema. Regras específicas de funcionalidades devem ser documentadas nos respectivos Projetos e depois consolidadas aqui.

## 1. Entidades e Definições

*(Aguardando migração do PROJECT_SPEC.md)*

## 2. Regras de Segurança

*   **R01 - Isolamento Multi-tenant:** Nenhum usuário de uma academia pode acessar dados de outra academia sob nenhuma circunstância (Garantido via RLS).
*   **R02 - Unicidade de CPF:** Um CPF só pode ter um único cadastro no ecossistema global do ClubFit.

## 3. Regras de Benefícios

*   **R03 - Validade do Voucher:** Tokens de QR Code devem expirar em 5 minutos após a geração.
*   **R04 - Uso Único:** Um token utilizado não pode ser reutilizado.

# STORY-14B-01: Widget de Economia (Mobile)

## 1. Descrição
Criação de um componente visual na tela de Perfil do aluno (e opcionalmente na Home) que exibe o total economizado no mês corrente ou desde o início.

## 2. Cenários
*   **Cenário 1 (Com Economia):** Aluno com R$ 50 de economia vê um card verde/dourado com o valor em destaque e uma frase motivacional.
*   **Cenário 2 (Zero Economia):** Aluno novo vê o card cinza/neutro convidando a usar: "Comece a economizar hoje!".
*   **Cenário 3 (Loading):** Skeleton screen enquanto busca o dado.

## 3. Regras de Negócio
*   **RN01 - Cache:** O valor não precisa ser real-time ao segundo. Pode ser cacheado por sessão ou por X minutos.
*   **RN02 - Privacidade:** O valor é pessoal e intransferível.

## 4. Critérios de Aceite
1.  Componente `EconomyWidget` criado em React.
2.  Integração com RPC `get_student_economy_summary` via Server Action.
3.  Exibição correta de formatação de moeda (BRL).

## 5. Detalhamento Técnico
*   **Frontend:** Componente Server Side (RSC) que busca o dado e passa para um Client Component para animação (se houver).
*   **Backend:** RPC `get_student_economy_summary(student_uuid)` que faz um `SELECT SUM(estimated_economy) FROM student_access_tokens WHERE student_id = X`.

## 6. Detalhamento de UX
*   **Estilo:** Card com gradiente dourado (`bg-gradient-to-r from-yellow-400 to-yellow-600`) para dar sensação de prêmio.
*   **Ícone:** Cofrinho (Piggy Bank) ou Símbolo de Dinheiro.

## 7. Detalhamento do Banco de Dados
*   *Leitura apenas*.

## 8. Riscos
*   **Valor Zero:** Alunos desmotivados se verem R$ 0,00.
*   **Mitigação:** Copywriting focado em oportunidade ("Potencial de economia: R$ 200/mês").

## 9. Testes
*   **T01:** Logar com aluno que gerou vouchers -> Verificar valor.
*   **T02:** Logar com aluno zerado -> Verificar estado vazio.

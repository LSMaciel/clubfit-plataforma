# EPIC-02: Experiência de Endereçamento e Frontend

**Status:** Planejado

## Descrição
Implementação dos componentes visuais e lógica de integração com a BrasilAPI.

## Histórias de Usuário

### USER_STORY-003: Componente `AddressForm` (Smart Component)
**Descrição:** Criar um componente isolado que encapsulate a lógica de busca de CEP.
**UX/UI:**
*   Input de CEP com máscara `99999-999`.
*   Ao completar 8 dígitos, disparar `fetchAddressData`.
*   Exibir estado `loading` (spinner).
*   Preencher inputs `street`, `neighborhood`, `city`, `state`.
*   Focar input `number`.
*   Botão "Editar Manualmente" caso a API falhe.
**Detalhamento Técnico:**
*   Caminho sugerido: `components/shared/address-form.tsx`.
*   Props: `onSelectAddress: (data: AddressData) => void` ou usar `react-hook-form` context.
*   Tratamento de erro `try/catch` na chamada `fetch`.
**Critérios de Aceite:**
- [ ] Componente busca CEP na BrasilAPI V2.
- [ ] Retorna Lat/Long para o componente pai.
- [ ] Permite edição manual.

### USER_STORY-004: Integração Cadastro de Parceiro
**Descrição:** Substituir o campo de texto simples "Endereço" na tela `/admin/partners/new` pelo novo `AddressForm`.
**Cenários de Teste:**
1.  Cadastrar com CEP válido -> Verifica se salvou Lat/Long no banco.
2.  Cadastrar com CEP inválido -> Verifica se permitiu digitar e salvar sem Lat/Long.
**Critérios de Aceite:**
- [ ] Formulário de Parceiro envia dados estruturados para a Server Action.

### USER_STORY-005: Integração Cadastro de Academia
**Descrição:** Adicionar a seção de endereço na tela `/admin/academies/new` (hoje não existe).
**Regras de Negócio:**
*   Academia agora passa a ter endereço obrigatório (para fins de SEO local futuro).
**Critérios de Aceite:**
- [ ] Formulário de Academia inclui seção de endereço completa.

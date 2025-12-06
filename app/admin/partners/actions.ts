
'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getEffectiveAcademyId } from '@/utils/admin-context'

export async function createPartner(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Identificar quem está logado (O Admin da Academia)
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) return { error: 'Não autenticado.' }

  // Buscar dados do perfil para saber qual academia ele gerencia
  const { data: adminProfile } = await supabase
    .from('users')
    .select('role, academy_id')
    .eq('id', currentUser.id)
    .single()

  // Validação de Permissão
  if (!adminProfile || !['ACADEMY_ADMIN', 'SUPER_ADMIN'].includes(adminProfile.role)) {
    return { error: 'Permissão negada. Apenas Admins de Academia podem cadastrar parceiros.' }
  }

  const effectiveAcademyId = await getEffectiveAcademyId(adminProfile)

  if (!effectiveAcademyId) {
    return { error: 'Nenhuma academia selecionada (Use o seletor no topo se for Super Admin).' }
  }

  // 2. Dados do Formulário
  // 3. Dados do Formulário
  const partnerName = formData.get('partner_name') as string
  const description = formData.get('description') as string

  // Novos Campos de Endereço V2
  const zipCode = formData.get('zip_code') as string
  const street = formData.get('street') as string
  const number = formData.get('number') as string
  const neighborhood = formData.get('neighborhood') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const complement = formData.get('complement') as string

  // Legacy address (Fallback: Montar string completa para exibir em listas antigas)
  // Se o form enviou 'address' explícito, usa ele. Se não, monta com base nos novos campos.
  let legacyAddress = formData.get('address') as string
  if (!legacyAddress && street) {
    legacyAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}`
  }

  // Tratamento de Lat/Long (podem vir vazios)
  const latStr = formData.get('latitude') as string
  const lngStr = formData.get('longitude') as string
  const latitude = latStr ? parseFloat(latStr) : null
  const longitude = lngStr ? parseFloat(lngStr) : null

  const ownerName = formData.get('owner_name') as string
  const ownerEmail = formData.get('owner_email') as string
  const ownerPassword = formData.get('owner_password') as string

  // Validação básica (mantendo compatibilidade: apenas campos antigos obrigatórios por enquanto)
  if (!partnerName || !ownerEmail || !ownerPassword || !ownerName) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  // 3. Criar Usuário Auth (Usando Admin Client para não perder sessão atual)
  // email_confirm: true evita que o usuário fique preso no envio de email
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
    user_metadata: { full_name: ownerName }
  })

  if (authError) {
    console.error('Erro Auth:', authError)
    return { error: `Erro ao criar login: ${authError.message}` }
  }

  const newUserId = authData.user.id

  // 4. Criar Perfil Público (public.users)
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      id: newUserId,
      name: ownerName,
      role: 'PARTNER',
      academy_id: effectiveAcademyId
    })

  if (profileError) {
    // Rollback manual (deletar user criado se falhar perfil)
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    console.error('Erro Profile:', profileError)
    return { error: 'Erro ao criar perfil do parceiro.' }
  }

  // 5. Criar Registro do Parceiro (public.partners)
  const { error: partnerError } = await supabaseAdmin
    .from('partners')
    .insert({
      academy_id: effectiveAcademyId,
      owner_id: newUserId,
      name: partnerName,
      address: legacyAddress, // Mantendo legado
      description: description,
      // Novos campos
      zip_code: zipCode || null,
      street: street || null,
      number: number || null,
      neighborhood: neighborhood || null,
      city: city || null,
      state: state || null,
      complement: complement || null,
      latitude: latitude,
      longitude: longitude
    })

  if (partnerError) {
    console.error('Erro Partner:', partnerError)
    return { error: 'Erro ao criar dados da empresa parceira.' }
  }

  revalidatePath('/admin/partners')
  redirect('/admin/partners')
}

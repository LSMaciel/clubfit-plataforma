
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
  const partnerName = formData.get('partner_name') as string
  const cnpj = formData.get('cnpj') as string
  const description = formData.get('description') as string

  // Novos Campos de Endereço V2
  const zipCode = formData.get('zip_code') as string
  const street = formData.get('street') as string
  const number = formData.get('number') as string
  const neighborhood = formData.get('neighborhood') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const complement = formData.get('complement') as string

  // Legacy address (Fallback)
  let legacyAddress = formData.get('address') as string
  if (!legacyAddress && street) {
    legacyAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}`
  }

  // Tratamento de Lat/Long
  const latStr = formData.get('latitude') as string
  const lngStr = formData.get('longitude') as string
  const latitude = latStr ? parseFloat(latStr) : null
  const longitude = lngStr ? parseFloat(lngStr) : null

  const ownerName = formData.get('owner_name') as string
  const ownerEmail = formData.get('owner_email') as string
  const ownerPassword = formData.get('owner_password') as string

  // Validação
  if (!partnerName || !cnpj || !ownerEmail || !ownerPassword || !ownerName) {
    return { error: 'Preencha todos os campos obrigatórios (incluindo CNPJ).' }
  }

  // 3. CHECK DUPLO: CNPJ já existe?
  // Se existir, não podemos criar duplicado. Devemos orientar a vincular.
  const { data: existingPartner } = await supabaseAdmin
    .from('partners')
    .select('id, name')
    .eq('cnpj', cnpj)
    .single()

  if (existingPartner) {
    return {
      error: `O parceiro "${existingPartner.name}" já existe na rede global com este CNPJ. Use a opção "Explorar" para vinculá-lo à sua academia.`
    }
  }

  // 4. Criar Usuário Auth (Owner)
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

  // 5. Criar Perfil Público (public.users)
  // Nota: O Owner do parceiro NÃO tem academy_id vinculado diretamente a ele, 
  // pois ele pode "pertencer" a várias (conceitualmente). 
  // Mas para MVP, se ele for criado por uma academia, ele é "dela" por enquanto?
  // NÃO. Owner de parceiro é independente. academy_id deve ser NULL para parceiro puro?
  // DATABASE ARCHITECTURE says: users extends auth.users. 
  // Se ele é parceiro, ele não é staff de academia.

  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      id: newUserId,
      name: ownerName,
      role: 'PARTNER',
      academy_id: null // Parceiro não pertence estruturalmente à academia, ele é uma entidade externa.
    })

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(newUserId) // Rollback
    console.error('Erro Profile:', profileError)
    return { error: 'Erro ao criar perfil do parceiro.' }
  }

  // 6. Criar Registro do Parceiro (GLOBAL - sem academy_id)
  const { data: newPartner, error: partnerError } = await supabaseAdmin
    .from('partners')
    .insert({
      // academy_id: REMOVIDO
      owner_id: newUserId,
      name: partnerName,
      cnpj: cnpj,
      address: legacyAddress,
      description: description,
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
    .select()
    .single()

  if (partnerError) {
    console.error('Erro Partner:', partnerError)
    // Tentar limpar usuário criado para não deixar lixo
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return { error: 'Erro ao criar registro da empresa parceira. Verifique se o CNPJ é válido.' }
  }

  // 7. CRITICAL: VINCULAR IMEDIATAMENTE (Criação do Link)
  const { error: linkError } = await supabaseAdmin
    .from('academy_partners')
    .insert({
      academy_id: effectiveAcademyId,
      partner_id: newPartner.id,
      status: 'ACTIVE'
    })

  if (linkError) {
    console.error('Erro Link:', linkError)
    // Situação delicada: Parceiro criado, mas não vinculado.
    // Retornamos erro mas o parceiro existe. O usuário terá que ir em "Explorar" e vincular.
    return { error: 'Parceiro criado, mas houve erro ao vincular automaticamente. Por favor, busque-o na aba "Explorar" e clique em Vincular.' }
  }

  revalidatePath('/admin/partners')
  redirect('/admin/partners')
}

// --- NEW ACTIONS FOR GLOBAL PARTNER SEARCH (STORY-003) ---

export async function searchGlobalPartners(query: string) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: adminProfile } = await supabase
    .from('users')
    .select('role, academy_id')
    .eq('id', user.id)
    .single()

  const academyId = await getEffectiveAcademyId(adminProfile)
  if (!academyId) return { error: 'Academia não identificada' }

  // 1. Search in Global Partners using Admin Client to bypass RLS restrictions
  // Note: ILIKE is case insensitive. Search both name and CNPJ.
  const { data: partners, error } = await supabaseAdmin
    .from('partners')
    .select(`
      id, 
      name, 
      city, 
      state, 
      cnpj,
      cnpj,
      academy_partners!left (status, academy_id)
    `)
    .or(`name.ilike.%${query}%,cnpj.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error("Search Error:", error)
    return { error: 'Erro ao buscar parceiros' }
  }

  // 2. Process results to determine status relative to THIS academy
  const results = partners.map((p: any) => {
    // Find if there is a link for THIS academy using the joined data
    // The left join returns an array (academy_partners)
    const link = Array.isArray(p.academy_partners)
      ? p.academy_partners.find((ap: any) => ap.academy_id === academyId)
      : null

    return {
      ...p,
      link_status: link ? link.status : 'NONE', // ACTIVE, INACTIVE, NONE
      is_linked: link?.status === 'ACTIVE'
    }
  })

  return { data: results }
}

export async function linkPartner(partnerId: string) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient() // Need admin to bypass potential policy restrictions on insert if strictly scoped

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: adminProfile } = await supabase
    .from('users')
    .select('academy_id, role')
    .eq('id', user.id)
    .single()

  // Allow Super Admin context switching
  const academyId = await getEffectiveAcademyId(adminProfile)

  if (!academyId) return { error: 'Academia não identificada' }

  // Upsert into academy_partners
  // If exists (conflict on academy_id, partner_id), update status to ACTIVE
  // Using explicit ON CONFLICT constraint name if possible, or columns
  const { error } = await supabaseAdmin
    .from('academy_partners')
    .upsert({
      academy_id: academyId,
      partner_id: partnerId,
      status: 'ACTIVE'
    }, { onConflict: 'academy_id, partner_id' })

  if (error) {
    console.error("Link Error:", error)
    return { error: 'Erro ao vincular parceiro' }
  }

  revalidatePath('/admin/partners/explore')
  revalidatePath('/admin/partners')
  return { success: true }
}

export async function unlinkPartner(partnerId: string) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: adminProfile } = await supabase
    .from('users')
    .select('academy_id, role')
    .eq('id', user.id)
    .single()

  const academyId = await getEffectiveAcademyId(adminProfile)
  if (!academyId) return { error: 'Academia não identificada' }

  const { error } = await supabaseAdmin
    .from('academy_partners')
    .update({ status: 'INACTIVE' })
    .eq('academy_id', academyId)
    .eq('partner_id', partnerId)

  if (error) {
    console.error("Unlink Error:", error)
    return { error: 'Erro ao desvincular parceiro' }
  }

  revalidatePath('/admin/partners/explore')
  revalidatePath('/admin/partners')
  return { success: true }
}

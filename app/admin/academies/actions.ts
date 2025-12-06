'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createAdminClient } from '@/utils/supabase/admin'

export async function createAcademy(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Verificação de Segurança (Apenas Super Admin)
  // 1. Verificação de Segurança (Apenas Super Admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Não autenticado.' }
  }

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'SUPER_ADMIN') {
    return { error: 'Permissão negada.' }
  }

  // Dados da Academia
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const primaryColor = formData.get('primary_color') as string
  const logoFile = formData.get('logo') as File

  // Dados do Dono
  const ownerName = formData.get('owner_name') as string
  const ownerEmail = formData.get('owner_email') as string
  const ownerPassword = formData.get('owner_password') as string

  // Novos Campos de Endereço V2
  const zipCode = formData.get('zip_code') as string
  const street = formData.get('street') as string
  const number = formData.get('number') as string
  const neighborhood = formData.get('neighborhood') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const complement = formData.get('complement') as string

  // Tratamento de Lat/Long
  const latStr = formData.get('latitude') as string
  const lngStr = formData.get('longitude') as string
  const latitude = latStr ? parseFloat(latStr) : null
  const longitude = lngStr ? parseFloat(lngStr) : null

  // 2. Validações Básicas
  if (!name || !slug) {
    return { error: 'Nome e Slug são obrigatórios.' }
  }

  // Validar formato do slug
  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { error: 'O Slug deve conter apenas letras minúsculas, números e hífens.' }
  }

  // Se preencheu algum campo de login, obriga a preencher todos
  const hasCredentialInputs = ownerEmail || ownerPassword || ownerName
  if (hasCredentialInputs && (!ownerEmail || !ownerPassword || !ownerName)) {
    return { error: 'Para criar um usuário, preencha Nome, Email e Senha.' }
  }

  let logoUrl = null

  // 3. Upload do Logo (se houver)
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${slug}-${Date.now()}.${fileExt}`
    const filePath = `public/${fileName}`

    // USAR ADMIN CLIENT PARA GARANTIR PERMISSÃO DE UPLOAD (BYPASS RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('academy-logos')
      .upload(filePath, logoFile, {
        contentType: logoFile.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Erro upload:', uploadError)
      // Se o erro for "Bucket not found", tentamos criar (Opcional, mas robusto)
      return { error: `Erro ao fazer upload da logo: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('academy-logos')
      .getPublicUrl(filePath)

    logoUrl = publicUrl
  }

  // --- INÍCIO DA TRANSAÇÃO LÓGICA ---

  let newUserId = null

  // 4. Criar Usuário Auth (Se fornecido)
  if (hasCredentialInputs) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { full_name: ownerName }
    })

    if (authError) {
      return { error: `Erro ao criar login: ${authError.message}` }
    }
    newUserId = authData.user.id
  }

  // 5. Inserir Academia
  const { data: academyData, error: insertError } = await supabaseAdmin // Usar admin para garantir
    .from('academies')
    .insert({
      name,
      slug,
      primary_color: primaryColor || '#000000',
      logo_url: logoUrl,
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

  if (insertError) {
    // ROLLBACK: Deletar usuário criado (se houver)
    if (newUserId) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
    }

    if (insertError.code === '23505') {
      return { error: 'Este Slug já está em uso. Escolha outro.' }
    }
    console.error('Erro insert academy:', insertError)
    return { error: 'Erro ao cadastrar academia.' }
  }

  // 6. Criar Perfil Público (Se usuário foi criado)
  if (newUserId) {
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: newUserId,
        name: ownerName,
        role: 'ACADEMY_ADMIN',
        academy_id: academyData.id
      })

    if (profileError) {
      // ROLLBACK TOTAL: Deletar Academia e Usuário
      await supabaseAdmin.from('academies').delete().eq('id', academyData.id)
      await supabaseAdmin.auth.admin.deleteUser(newUserId)

      console.error('Erro insert user profile:', profileError)
      return { error: 'Erro ao criar perfil do administrador.' }
    }
  }

  // 7. Finalizar
  revalidatePath('/admin/academies')
  redirect('/admin/academies')
}

import { cookies } from 'next/headers'

export async function switchAdminContext(academyId: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify if user is really Super Admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized: Only Super Admin can switch context.' }
  }

  const cookieStore = await cookies()
  if (academyId) {
    cookieStore.set('admin-context-academy-id', academyId)
  } else {
    cookieStore.delete('admin-context-academy-id')
  }

  revalidatePath('/admin', 'layout')
  return { success: true }
}

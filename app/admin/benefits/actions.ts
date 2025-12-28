'use server'

import { createClient } from '@/utils/supabase/server'
import { PromotionDraft } from '@/components/admin/promotions/types'
import { baseFormSchema } from '@/components/admin/promotions/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBenefit(draft: PromotionDraft) {
  const supabase = await createClient()

  // 1. Auth and Permission Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  // 2. Resolve User & Partner Context
  // Query User for Academy ID (Global Partners MVP assumes User is tied to Academy context)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('academy_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.academy_id) {
    console.error('User Academy ID not found:', user.id)
    return { error: 'Seu usuário não está vinculado a nenhuma academia.' }
  }

  // Query Partner owned by User (partners table is Global, no academy_id)
  const { data: partner, error: partnerError } = await supabase
    .from('partners')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (partnerError || !partner) {
    console.error('Partner not found for user:', user.id)
    return { error: 'Perfil de parceiro não encontrado para este usuário.' }
  }

  // 3. Validation (Re-run Zod on Server)
  // Ideally we would validate the specific strategy schema too, but base is a good start for the wrapper.
  const validation = baseFormSchema.safeParse({
    title: draft.title,
    description: draft.description,
    min_spend: draft.constraints?.min_spend,
    channel: draft.constraints?.channel
  })

  if (!validation.success) {
    const zodError = validation.error as any
    const firstError = zodError.errors?.[0]?.message || 'Erro desconhecido'
    return { error: 'Dados inválidos: ' + firstError }
  }

  // 4. Insert to Database
  const { error: insertError } = await supabase
    .from('benefits')
    .insert({
      partner_id: partner.id,
      academy_id: userData.academy_id, // Use User's Academy Context
      title: draft.title,
      description: draft.description,
      type: draft.type,
      cover_image_url: draft.cover_image_url,
      configuration: draft.configuration,
      constraints: draft.constraints,
      rules: `Regras geradas automaticamente: Tipo ${draft.type}`, // Simple fallback for text rules column
      status: 'ACTIVE'
    })

  if (insertError) {
    console.error('Insert Benefit Error:', insertError)
    return { error: 'Erro ao salvar no banco de dados. Tente novamente.' }
  }

  // 5. Revalidate and Redirect
  revalidatePath('/admin/benefits')
  // We return success here and let the client redirect, or redirect directly.
  // Redirect inside server action acts as throw, preventing further execution.
  redirect('/admin/benefits')
  // Redirect inside server action acts as throw, preventing further execution.
  redirect('/admin/benefits')
}

export async function toggleBenefitStatus(id: string, currentStatus: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  const { error } = await supabase
    .from('benefits')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating status:', error)
    return { error: 'Falha ao atualizar status' }
  }

  revalidatePath('/admin/benefits')
  return { success: true }
}
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBenefit(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Identificar Usuário Logado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  // 2. Buscar Perfil e Vínculo com Parceiro
  // Precisamos saber se ele é um DONO de parceiro (owner_id)
  const { data: partnerData, error: partnerError } = await supabase
    .from('partners')
    .select('id, academy_id')
    .eq('owner_id', user.id)
    .single()

  // Se não achar parceiro vinculado ao usuário, verificar se é Admin da Academia (opcional, mas focado no parceiro agora)
  if (partnerError || !partnerData) {
    return { error: 'Você não tem um estabelecimento comercial vinculado ao seu perfil.' }
  }

  // 3. Coletar Dados
  const title = formData.get('title') as string
  const rules = formData.get('rules') as string
  const validityEnd = formData.get('validity_end') as string

  if (!title) {
    return { error: 'O título da promoção é obrigatório.' }
  }

  // 4. Inserir Benefício
  const { error: insertError } = await supabase
    .from('benefits')
    .insert({
      academy_id: partnerData.academy_id,
      partner_id: partnerData.id,
      title,
      rules,
      validity_end: validityEnd || null, // Se vazio, null (sem validade/eterno)
      status: 'ACTIVE'
    })

  if (insertError) {
    console.error('Erro Benefit:', insertError)
    return { error: 'Erro ao criar promoção.' }
  }

  revalidatePath('/admin/benefits')
  redirect('/admin/benefits')
}

export async function toggleBenefitStatus(benefitId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  await supabase
    .from('benefits')
    .update({ status: newStatus })
    .eq('id', benefitId)

  revalidatePath('/admin/benefits')
}

'use server'

import { createClient } from '@/utils/supabase/server'

export type ValidationResult = {
  success: boolean
  message: string
  student?: string
  benefit?: string
}

export async function validateTokenAction(tokenCode: string): Promise<ValidationResult> {
  const supabase = await createClient()

  // Verifica autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Usuário não autenticado.' }
  }

  // Chama a RPC criada no banco
  const { data, error } = await supabase.rpc('validate_token', {
    token_code: tokenCode
  })

  if (error) {
    console.error('RPC Error:', error)
    return { success: false, message: 'Erro interno ao validar voucher.' }
  }

  return data as ValidationResult
}

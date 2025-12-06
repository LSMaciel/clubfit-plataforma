
'use server'

import { createClient } from '@/utils/supabase/server'

export async function generateToken(benefitId: string) {
  const supabase = createClient()
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  // 2. Identificar o Aluno
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!student) return { error: 'Perfil de aluno não encontrado.' }

  // 3. Verificar se já existe um token PENDENTE e VÁLIDO (Idempotência)
  // Isso evita gerar múltiplos tokens se o usuário clicar várias vezes
  const now = new Date().toISOString()
  
  const { data: existingToken } = await supabase
    .from('student_access_tokens')
    .select('token, expires_at')
    .eq('student_id', student.id)
    .eq('benefit_id', benefitId)
    .eq('status', 'PENDING')
    .gt('expires_at', now) // Expira no futuro
    .order('expires_at', { ascending: false })
    .limit(1)
    .single()

  if (existingToken) {
    return { 
        token: existingToken.token, 
        expiresAt: existingToken.expires_at 
    }
  }

  // 4. Gerar Novo Token
  // Usaremos crypto.randomUUID para o token interno
  const tokenValue = crypto.randomUUID()
  
  // Validade de 5 minutos
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  const { data: newToken, error } = await supabase
    .from('student_access_tokens')
    .insert({
      student_id: student.id,
      benefit_id: benefitId,
      token: tokenValue,
      expires_at: expiresAt,
      status: 'PENDING'
    })
    .select('token, expires_at')
    .single()

  if (error) {
    console.error('Erro ao gerar token:', error)
    return { error: 'Falha ao gerar voucher. Tente novamente.' }
  }

  return { 
    token: newToken.token, 
    expiresAt: newToken.expires_at 
  }
}

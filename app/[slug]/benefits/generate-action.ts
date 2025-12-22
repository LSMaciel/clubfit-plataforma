
'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { getStudentSession } from '@/utils/auth-student'

export async function generateToken(benefitId: string) {
  // 1. Auth Check (Custom Session)
  const session = await getStudentSession()
  if (!session || !session.studentId) return { error: 'Não autenticado.' }

  const supabase = createAdminClient()

  // 2. Identificar o Aluno
  const { data: student } = await supabase
    .from('students')
    .select('id, academy_id')
    .eq('id', session.studentId) // Correção: usamos o ID direto da sessão
    .single()

  if (!student) return { error: 'Perfil de aluno não encontrado.' }

  // 2.a Validar se o Benefício pertence a um Parceiro ATIVO para esta Academia (STORY-007)
  const { data: benefitCheck, error: benefitError } = await supabase
    .from('benefits')
    .select(`
        id, 
        partner_id
    `)
    .eq('id', benefitId)
    .single()

  if (benefitError || !benefitCheck) return { error: 'Benefício não encontrado.' }

  // Check do Vínculo na tabela associativa
  // URGENT FIX: Validate against the STUDENT'S academy, not the benefit's (which doesn't happen academy_id)
  const { data: linkCheck } = await supabase
    .from('academy_partners')
    .select('status')
    .eq('academy_id', student.academy_id)
    .eq('partner_id', benefitCheck.partner_id)
    .eq('status', 'ACTIVE')
    .single()

  // Se não tiver vínculo ativo
  if (!linkCheck) {
    const debugInfo = `(S:${student.academy_id} vs P:${benefitCheck.partner_id} | Link: Missing)`
    console.log('❌ FALHA NA VALIDAÇÃO:', debugInfo)
    return { error: `Erro de validação: Este benefício não está ativo para sua academia. ${debugInfo}` }
  }


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

  // Validade de 20 segundos (Solicitação Usuário)
  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString()

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

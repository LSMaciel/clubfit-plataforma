'use server'

import { createClient } from '@/utils/supabase/server'
import { getStudentSession } from '@/utils/auth-student'
import { randomUUID } from 'crypto'

export async function generateWalletToken() {
    const session = await getStudentSession()
    if (!session || !session.studentId) {
        return { error: 'Sessão inválida.' }
    }

    const supabase = await createClient()

    // 1. Gerar Token Seguro (UUID)
    const token = randomUUID()

    // 2. Definir Expiração (5 minutos)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // 3. Salvar no Banco
    const { error } = await supabase
        .from('student_access_tokens')
        .insert({
            student_id: session.studentId,
            token: token,
            expires_at: expiresAt,
            benefit_id: null, // Token Genérico
            status: 'PENDING'
        })

    if (error) {
        console.error('Erro ao gerar token:', error)
        return { error: 'Falha ao gerar cartão digital.' }
    }

    return { token, expiresAt }
}
// ... (existing imports)

export async function generateBenefitVoucher(benefitId: string) {
    const session = await getStudentSession()
    if (!session || !session.studentId) {
        return { error: 'Sessão inválida.' }
    }

    const supabase = await createClient()
    const supabaseAdmin = await createClient() // Actually we need Admin for checking benefit rules?
    // Let's use standard client for now, assuming RLS allows reading Active Benefits.
    // Insert into student_access_tokens requires RLS allowing student to insert their own.

    // 1. Validar Benefício
    const { data: benefit } = await supabase
        .from('benefits')
        .select('status, validity_end, partners(name)')
        .eq('id', benefitId)
        .single()

    if (!benefit || benefit.status !== 'ACTIVE') {
        return { error: 'Oferta indisponível ou expirada.' }
    }

    if (benefit.validity_end && new Date(benefit.validity_end) < new Date()) {
        return { error: 'Oferta expirada.' }
    }

    // 2. Gerar Token
    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 1000).toISOString() // 30 segundos (TOTP Style)

    // 3. Salvar
    const { error } = await supabase
        .from('student_access_tokens')
        .insert({
            student_id: session.studentId,
            token: token,
            expires_at: expiresAt,
            benefit_id: benefitId,
            status: 'PENDING'
        })

    if (error) {
        console.error('Erro Voucher:', error)
        return { error: 'Erro ao gerar voucher.' }
    }

    return {
        success: true,
        token,
        expiresAt,
        partnerName: benefit.partners?.name
    }
}

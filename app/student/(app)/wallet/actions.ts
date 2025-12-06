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

'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createStudentSession } from '@/utils/auth-student'
import { redirect } from 'next/navigation'

export async function studentLogin(formData: FormData) {
    const rawCpf = formData.get('cpf') as string
    if (!rawCpf) return { error: 'CPF é obrigatório.' }

    // Clean CPF
    const cpf = rawCpf.replace(/\D/g, '')

    if (cpf.length !== 11) return { error: 'CPF inválido.' }

    const supabaseAdmin = createAdminClient()

    // 1. Buscar Aluno (Admin Client para bypass RLS)
    // Precisamos encontrar se esse CPF existe e está ativo.
    const { data: student, error } = await supabaseAdmin
        .from('students')
        .select('id, academy_id, full_name, status')
        .eq('cpf', cpf)
        .single()

    if (error || !student) {
        return { error: 'CPF não encontrado. Verifique se digitou corretamente.' }
    }

    if (student.status !== 'ACTIVE') {
        return { error: 'Seu cadastro está inativo. Procure a recepção da academia.' }
    }

    // 2. Criar Sessão
    await createStudentSession(student.id, student.academy_id)

    // 3. Redirecionar
    redirect('/student/dashboard')
}

export async function studentLogout() {
    const { deleteStudentSession } = await import('@/utils/auth-student')
    await deleteStudentSession()
    redirect('/student/login')
}

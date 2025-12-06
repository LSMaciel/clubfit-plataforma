
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cleanCPF } from '@/utils/formatters'

import { cookies } from 'next/headers'

export async function createStudent(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Verificar Autenticação e Permissão
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  const { data: profile } = await supabase
    .from('users')
    .select('role, academy_id')
    .eq('id', user.id)
    .single()

  if (!profile || !['ACADEMY_ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
    return { error: 'Permissão negada. Apenas administradores podem cadastrar alunos.' }
  }

  // 1.5. Determinar Academia Alvo (Context Aware)
  let targetAcademyId = profile.academy_id

  if (profile.role === 'SUPER_ADMIN') {
    const cookieStore = await cookies()
    targetAcademyId = cookieStore.get('admin-context-academy-id')?.value

    if (!targetAcademyId) {
      return { error: 'Modo Super Admin: Selecione uma academia no menu de contexto (topo da tela) para realizar esta ação.' }
    }
  }

  // 2. Coletar e Limpar Dados
  const fullName = formData.get('full_name') as string
  const rawCpf = formData.get('cpf') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  if (!fullName || !rawCpf) {
    return { error: 'Nome e CPF são obrigatórios.' }
  }

  const cpf = cleanCPF(rawCpf)

  // Validação simples de tamanho (MVP)
  if (cpf.length !== 11) {
    return { error: 'O CPF deve conter exatamente 11 dígitos.' }
  }

  // 3. Inserir no Banco
  const { error: insertError } = await supabase
    .from('students')
    .insert({
      academy_id: targetAcademyId,
      full_name: fullName,
      cpf: cpf,
      email: email || null,
      phone: phone || null,
      status: 'ACTIVE'
    })

  if (insertError) {
    // Tratamento de Erro Específico: CPF Duplicado (constraint unique_cpf)
    if (insertError.code === '23505') {
      return { error: 'Este CPF já está cadastrado no sistema ClubFit.' }
    }
    console.error('Erro Student:', insertError)
    return { error: 'Erro ao cadastrar aluno.' }
  }

  revalidatePath('/admin/students')
  redirect('/admin/students')
}

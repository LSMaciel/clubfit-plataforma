'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { cleanCPF } from '@/utils/formatters'

/**
 * Verifica o status do aluno baseado no CPF e na Academia (Slug).
 * Retorna se é FIRST_ACCESS (não tem usuário Auth), LOGIN (tem usuário) ou NOT_FOUND.
 */
export async function checkStudentStatus(slug: string, rawCpf: string) {
  const supabase = createClient()
  const supabaseAdmin = createAdminClient() // Usamos Admin pois RLS bloqueia leitura de alunos para visitantes

  const cpf = cleanCPF(rawCpf)

  // 1. Buscar Academia pelo Slug (Público)
  const { data: academy } = await supabase
    .from('academies')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!academy) {
    return { error: 'Academia não encontrada.' }
  }

  // 2. Buscar Aluno pelo CPF e AcademyID
  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id, full_name, user_id, status')
    .eq('academy_id', academy.id)
    .eq('cpf', cpf)
    .single()

  if (!student) {
    return { status: 'NOT_FOUND' }
  }

  if (student.status !== 'ACTIVE') {
    return { error: 'Cadastro inativo. Procure a recepção.' }
  }

  // 3. Determinar Fluxo
  if (!student.user_id) {
    return { status: 'FIRST_ACCESS', name: student.full_name }
  }

  return { status: 'LOGIN', name: student.full_name }
}

/**
 * Realiza o PRIMEIRO ACESSO do aluno:
 * 1. Cria usuário no Auth (email fictício baseado no CPF).
 * 2. Atualiza tabela students com user_id.
 * 3. Loga o usuário.
 */
export async function handleFirstAccess(slug: string, rawCpf: string, password: string) {
  const supabase = createClient()
  const supabaseAdmin = createAdminClient()
  
  const cpf = cleanCPF(rawCpf)
  const dummyEmail = `${cpf}@clubfit.app` // Email fictício para o Auth

  // 1. Buscar dados necessários novamente (segurança)
  const { data: academy } = await supabase.from('academies').select('id').eq('slug', slug).single()
  if (!academy) return { error: 'Academia inválida.' }

  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id, user_id')
    .eq('academy_id', academy.id)
    .eq('cpf', cpf)
    .single()

  if (!student) return { error: 'Aluno não encontrado.' }
  if (student.user_id) return { error: 'Este aluno já possui cadastro. Faça login.' }

  // 2. Criar Usuário Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: dummyEmail,
    password: password,
    email_confirm: true,
    user_metadata: { role: 'STUDENT' } // Metadado auxiliar
  })

  if (authError) {
    console.error('Erro Auth Create:', authError)
    return { error: 'Erro ao criar credenciais de acesso.' }
  }

  const newUserId = authUser.user.id

  // 3. Atualizar tabela Students (Vincular)
  const { error: updateError } = await supabaseAdmin
    .from('students')
    .update({ user_id: newUserId })
    .eq('id', student.id)

  if (updateError) {
    // Rollback (Deletar user criado)
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    console.error('Erro Update Student:', updateError)
    return { error: 'Erro ao vincular cadastro.' }
  }
  
  // 4. Criar perfil em public.users também (Opcional, mas bom para consistência do RLS get_user_data)
  // A tabela students já serve como perfil, mas se seu RLS usa public.users para roles globais, precisamos criar.
  // Pelo nosso Schema v1, public.users é core. Então vamos criar.
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      id: newUserId,
      academy_id: academy.id,
      name: 'Aluno ClubFit', // Nome genérico ou pegar do student
      role: 'STUDENT'
    })
    
   if (profileError) {
      console.warn('Erro ao criar public.users para aluno (não crítico se RLS olhar students):', profileError)
   }

  // 5. Fazer Login
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: dummyEmail,
    password: password
  })

  if (loginError) {
    return { error: 'Conta criada, mas erro ao logar. Tente entrar novamente.' }
  }

  redirect(`/${slug}/benefits`)
}

/**
 * Realiza o LOGIN recorrente do aluno.
 */
export async function handleLogin(slug: string, rawCpf: string, password: string) {
  const supabase = createClient()
  const cpf = cleanCPF(rawCpf)
  const dummyEmail = `${cpf}@clubfit.app`

  const { error } = await supabase.auth.signInWithPassword({
    email: dummyEmail,
    password: password
  })

  if (error) {
    return { error: 'Senha incorreta.' }
  }

  redirect(`/${slug}/benefits`)
}
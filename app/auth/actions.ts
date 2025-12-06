
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // 1. Tentar Login no Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/admin/login?message=Credenciais inválidas.')
  }

  // 2. Verificar Role na tabela public.users (Regra de Negócio)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .single() // O RLS garante que ele só busca o próprio user

  if (userError || !userData) {
    await supabase.auth.signOut()
    return redirect('/admin/login?message=Erro ao verificar cadastro.')
  }

  // 3. Bloquear Alunos no painel Admin
  if (userData.role === 'STUDENT') {
    await supabase.auth.signOut()
    return redirect('/admin/login?message=Acesso restrito a administradores.')
  }

  // 4. Sucesso
  return redirect('/admin/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/admin/login')
}

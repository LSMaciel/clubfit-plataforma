
'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // 1. Tentar Login no Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return redirect('/admin/login?message=Credenciais inválidas.')
  }

  // 2. Verificar Role na tabela public.users (Usando Admin Client para garantir leitura)
  const supabaseAdmin = createAdminClient()
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (userError || !userData) {
    console.error('LOGIN ERROR - Profile Lookup Failed:', userError)

    await supabase.auth.signOut()
    const errorMsg = userError ? `Erro BD: ${userError.message} (${userError.code})` : 'Usuário não encontrado na tabela public.users.'
    return redirect(`/admin/login?message=${encodeURIComponent(errorMsg)}`)
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

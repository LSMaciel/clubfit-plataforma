import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { LoginForm } from '@/components/student/login-form'

interface PageProps {
  params: { slug: string }
}

export default async function AcademyLoginPage({ params }: PageProps) {
  const supabase = createClient()
  
  // 1. Verificar se usuário já está logado
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    // Se for Aluno, manda para os benefícios
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role === 'STUDENT') {
        redirect(`/${params.slug}/benefits`)
    }
    // Se for Admin, ignora e deixa ver a tela (ou poderia mandar pro dashboard)
  }

  // 2. Buscar Dados da Academia (Leitura Pública)
  const { data: academy } = await supabase
    .from('academies')
    .select('id, name, logo_url, primary_color')
    .eq('slug', params.slug)
    .single()

  if (!academy) {
    notFound() // Retorna 404 se slug não existe
  }

  // Cor de fundo levemente tintada com a cor da marca (opacidade bem baixa)
  // Como não podemos calcular hex com alpha fácil no server sem lib, usaremos slate-900 padrão com overlay
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* Background Decorativo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
            background: `radial-gradient(circle at center, ${academy.primary_color}, transparent 70%)` 
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Logo da Academia */}
        <div className="mb-8 flex flex-col items-center">
            {academy.logo_url ? (
                <img 
                    src={academy.logo_url} 
                    alt={academy.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl mb-4"
                />
            ) : (
                <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-4"
                    style={{ backgroundColor: academy.primary_color }}
                >
                    {academy.name.substring(0, 2).toUpperCase()}
                </div>
            )}
            <h1 className="text-3xl font-bold text-white text-center drop-shadow-md">
                {academy.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1">Clube de Benefícios</p>
        </div>

        {/* Formulário de Login */}
        <LoginForm 
            slug={params.slug} 
            academyName={academy.name} 
            primaryColor={academy.primary_color || '#000000'} 
        />

        <div className="mt-12 text-center opacity-40">
            <p className="text-xs text-white">Powered by <strong>ClubFit</strong></p>
        </div>

      </div>
    </div>
  )
}
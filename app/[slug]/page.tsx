import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { StudentLoginForm as LoginForm } from '@/components/student/login-form'
import { Suspense } from 'react'
import { LoginRedirector } from '@/components/student/login-redirector'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AcademyLoginPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. OTIMIZAÇÃO DE PERFORMANCE (STORY-PERF-01-02)
  // Removemos o blocking auth check daqui. Ele agora acontece em background
  // dentro do component <LoginRedirector />.

  // 2. Buscar Dados da Academia (Leitura Pública)
  // Esta é a única query bloqueante agora, mas ela é geralmente rápida (PK lookup)
  const { data: academy } = await supabase
    .from('academies')
    .select('id, name, logo_url, primary_color')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!academy) {
    notFound() // Retorna 404 se slug não existe
  }

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
        <div className="w-full relative">
          {/* 
               Suspense Boundary:
               Aqui acontece a mágica. O render continua (mostra o form)
               enquanto o LoginRedirector verifica a sessão em paralelo.
            */}
          <Suspense fallback={null}>
            <LoginRedirector slug={resolvedParams.slug} />
          </Suspense>

          <LoginForm
            slug={resolvedParams.slug}
            academyName={academy.name}
            primaryColor={academy.primary_color || '#000000'}
          />
        </div>

        <div className="mt-12 text-center opacity-40">
          <p className="text-xs text-white">Powered by <strong>ClubFit</strong></p>
        </div>

      </div>
    </div>
  )
}
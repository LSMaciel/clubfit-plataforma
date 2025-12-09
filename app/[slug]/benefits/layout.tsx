
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { BottomNav } from '@/components/student/bottom-nav'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function StudentLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Verificar Semssão
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${resolvedParams.slug}`)
  }

  // 2. Buscar Dados da Academia (Theme)
  const { data: academy } = await supabase
    .from('academies')
    .select('name, logo_url, primary_color')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!academy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20"> {/* pb-20 para não esconder atrás da nav */}

      {/* Header App */}
      <header className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {academy.logo_url ? (
            <img src={academy.logo_url} alt={academy.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: academy.primary_color }}>
              {academy.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-slate-800 text-sm">{academy.name}</span>
        </div>
        <div className="text-xs text-slate-400">
          Olá, Aluno
        </div>
      </header>

      {/* Conteúdo */}
      <main className="p-4 max-w-md mx-auto">
        {children}
      </main>

      {/* Navegação Inferior */}
      <BottomNav slug={resolvedParams.slug} primaryColor={academy.primary_color || '#000000'} />

    </div>
  )
}
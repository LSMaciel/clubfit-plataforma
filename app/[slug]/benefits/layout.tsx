
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { BottomNav } from '@/components/student/bottom-nav'
import React from 'react'
import { getStudentSession } from '@/utils/auth-student'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function StudentLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Verificar Sessão (Supabase OU Token Customizado)
  const { data: { user } } = await supabase.auth.getUser()
  const studentSession = await getStudentSession()

  if (!user && !studentSession) {
    redirect(`/${resolvedParams.slug}`)
  }

  // 2. Buscar Dados da Academia (Theme)
  const { data: academy } = await supabase
    .from('academies')
    .select('name, logo_url, color_primary, color_secondary, color_background, color_surface, color_text_primary, color_text_secondary, color_border, border_radius')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!academy) {
    notFound()
  }

  // 3. Definir Tema
  const theme = {
    '--color-primary': academy.color_primary || '#000000',
    '--color-secondary': academy.color_secondary || '#F59E0B',
    '--color-background': academy.color_background || '#F8FAFC',
    '--color-surface': academy.color_surface || '#FFFFFF',
    '--color-text-primary': academy.color_text_primary || '#0F172A',
    '--color-text-secondary': academy.color_text_secondary || '#64748B',
    '--color-border': academy.color_border || '#E2E8F0',
    '--border-radius': academy.border_radius || '1rem',
  } as React.CSSProperties

  const primaryColor = academy.color_primary || '#000000'

  return (
    <div
      className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text-primary)] pb-20"
      style={theme}
    >

      {/* Header App */}
      <header className="bg-[var(--color-surface)] px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          {academy.logo_url ? (
            <img src={academy.logo_url} alt={academy.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
              {academy.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-[var(--color-text-primary)] text-sm">{academy.name}</span>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)]">
          Olá, Aluno
        </div>
      </header>

      {/* Conteúdo */}
      <main className="p-4 max-w-md mx-auto">
        {children}
      </main>

      {/* Navegação Inferior */}
      <BottomNav slug={resolvedParams.slug} primaryColor={primaryColor} />

    </div>
  )
}
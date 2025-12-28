import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { StudentHeader } from '@/components/student/student-header'

import { MaintenanceScreen, SuspendedScreen } from '@/components/student/status-screens'
import { StudentNav } from './components/student-nav'

export default async function StudentAppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Validar Sessão
    const session = await getStudentSession()
    if (!session || !session.studentId) {
        redirect('/student/login')
    }

    const { studentId, academyId } = session

    // 2. Buscar Dados da Academia (Theme + Status)
    const supabaseAdmin = createAdminClient()

    const { data: academy } = await supabaseAdmin
        .from('academies')
        .select('name, logo_url, color_primary, color_secondary, color_background, color_surface, color_text_primary, color_text_secondary, color_border, border_radius, status')
        .eq('id', academyId)
        .single()

    // 2.1 Validação de Status (Gatekeeper)
    const status = academy?.status || 'ACTIVE'
    const primaryColor = academy?.color_primary || '#000000'
    const name = academy?.name || 'ClubFit'

    if (status === 'MAINTENANCE') {
        return <MaintenanceScreen academyName={name} primaryColor={primaryColor} />
    }

    if (status === 'INACTIVE' || status === 'SUSPENDED') {
        return <SuspendedScreen academyName={name} primaryColor={primaryColor} />
    }

    // 3. Definir Tema (com Fallback para padrão ClubFit/Dotty)
    const theme = {
        '--color-primary': academy?.color_primary || '#000000',
        '--color-secondary': academy?.color_secondary || '#F59E0B',
        '--color-background': academy?.color_background || '#F8FAFC',
        '--color-surface': academy?.color_surface || '#FFFFFF',
        '--color-text-primary': academy?.color_text_primary || '#0F172A',
        '--color-text-secondary': academy?.color_text_secondary || '#64748B',
        '--color-border': academy?.color_border || '#E2E8F0',
        '--border-radius': academy?.border_radius || '1rem',
    } as React.CSSProperties

    return (
        <div
            className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text-primary)]"
            style={theme}
        >
            <StudentHeader
                academyName={name}
                logoUrl={academy?.logo_url}
                primaryColor={primaryColor}
            />

            <main className="pb-24">
                {children}
            </main>

            <StudentNav />
        </div>
    )
}

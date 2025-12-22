import { createClient } from '@/utils/supabase/server'
import { getEffectiveAcademyId } from '@/utils/admin-context'
import { SettingsForm, DEFAULT_COLORS } from './settings-form'

export default async function SettingsPage() {
    const supabase = await createClient()

    // 1. Auth & Profile
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Não autenticado</div>

    // 2. Profile
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (!profile) return <div>Perfil inválido</div>

    // 3. Effective Academy (Context Aware)
    const academyId = await getEffectiveAcademyId(profile)

    let currentColors = DEFAULT_COLORS

    if (academyId) {
        // 4. Load Academy Data
        const { data: academy } = await supabase.from('academies').select('*').eq('id', academyId).single()

        if (academy) {
            currentColors = {
                primary: academy.color_primary || DEFAULT_COLORS.primary,
                secondary: academy.color_secondary || DEFAULT_COLORS.secondary,
                background: academy.color_background || DEFAULT_COLORS.background,
                surface: academy.color_surface || DEFAULT_COLORS.surface,
                textPrimary: academy.color_text_primary || DEFAULT_COLORS.textPrimary,
                textSecondary: academy.color_text_secondary || DEFAULT_COLORS.textSecondary,
                border: academy.color_border || DEFAULT_COLORS.border,
                radius: academy.border_radius || DEFAULT_COLORS.radius
            }
        }
    }

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <a href="/admin/dashboard" className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-2 inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Voltar para Início
                </a>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Personalização do App</h1>
            <p className="text-slate-500 mb-8 max-w-2xl">
                Defina as cores que seus alunos verão no aplicativo. A prévia ao lado mostra como ficará em tempo real.
            </p>

            <SettingsForm initialColors={currentColors} />
        </main>
    )
}

import { createClient } from '@/utils/supabase/server'
import { getCachedAdminProfile } from '@/utils/supabase/cached-queries'
import { SettingsForm, DEFAULT_COLORS } from './settings-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
    const profile = await getCachedAdminProfile()

    if (!profile) {
        redirect('/admin/login')
    }

    const academyId = profile.effective_academy_id
    let currentColors = DEFAULT_COLORS

    // 1. TRAVA: Super Admin sem contexto
    if (profile.role === 'SUPER_ADMIN' && !academyId) {
        return (
            <main className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75Z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Selecione uma Academia</h1>
                <p className="text-slate-500 mb-8">
                    Para personalizar o aplicativo, você precisa primeiro selecionar qual academia deseja editar.
                </p>
                <div className="flex gap-4">
                    <a
                        href="/admin/dashboard"
                        className="px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transaction-colors"
                    >
                        Voltar ao Dashboard
                    </a>
                    <a
                        href="/admin/super/academies"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
                    >
                        Ir para Lista de Academias
                    </a>
                </div>
            </main>
        )
    }

    if (academyId) {
        const supabase = await createClient()
        // 4. Load Academy Data (We still fetch academy details as they are specific)
        // We could optimize this by adding academy details to cached profile if needed, 
        // but fetching one row by ID is fast enough if auth is skipped.
        const { data: academy } = await supabase
            .from('academies')
            .select('*')
            .eq('id', academyId)
            .single()

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

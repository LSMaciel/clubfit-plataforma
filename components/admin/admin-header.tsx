import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/auth/actions'
import { cookies } from 'next/headers'
import { AdminContextSwitcher } from './admin-context-switcher'
import { AdminNav } from './admin-nav'

export async function AdminHeader() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get full profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

    const isSuperAdmin = profile?.role === 'SUPER_ADMIN'

    // Logic for Context Switcher (Super Admin only)
    let academies: any[] = []
    let currentContextId: string | null = null

    if (isSuperAdmin) {
        const { data: allAcademies } = await supabase
            .from('academies')
            .select('id, name')
            .order('name')

        academies = allAcademies || []

        const cookieStore = await cookies()
        currentContextId = cookieStore.get('admin-context-academy-id')?.value || null
    }

    // Determine Display Title based on Context
    let contextTitle = "ClubFit"
    let contextColorClass = "text-slate-900" // Default Dark

    if (currentContextId) {
        const activeAcademy = academies.find(a => a.id === currentContextId)
        if (activeAcademy) {
            contextTitle = `${activeAcademy.name}`
            contextColorClass = "text-amber-700" // Warning/Attention color
        }
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            {/* Top Bar: Logo, Context & Profile */}
            <div className="px-8 py-3 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-6">
                    <Link href="/admin" className={`font-bold text-xl ${contextColorClass}`}>
                        {contextTitle}
                    </Link>

                    {isSuperAdmin && (
                        <div className="pl-6 border-l border-slate-200">
                            <AdminContextSwitcher
                                academies={academies}
                                currentContextId={currentContextId}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-right hidden sm:block">
                        <p className="font-medium">{profile?.name || user?.email}</p>
                        <p className="text-xs text-slate-500 uppercase">{profile?.role?.replace('_', ' ')}</p>
                    </div>
                    <form action={signOut}>
                        <button className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 border border-transparent hover:border-red-100 rounded-md transition-colors uppercase tracking-wider">
                            Sair
                        </button>
                    </form>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="px-8 flex">
                <AdminNav
                    role={profile?.role}
                    isGlobalContext={isSuperAdmin && !currentContextId}
                />
            </div>
        </header>
    )
}

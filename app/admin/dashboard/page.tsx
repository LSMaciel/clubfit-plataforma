
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Buscar dados do perfil
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

    const isSuperAdmin = profile?.role === 'SUPER_ADMIN'
    const isAcademyAdmin = profile?.role === 'ACADEMY_ADMIN'
    const isPartner = profile?.role === 'PARTNER'

    return (
        <main className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Status do Sistema</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">Operacional</p>
                </div>
            </div>

            {isSuperAdmin && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
                    <h2 className="text-lg font-bold mb-4 text-indigo-900">Gestão Global (Super Admin)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/academies"
                            className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                🏢
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-indigo-700">Academias</span>
                        </Link>
                    </div>
                </div>
            )}

            {(isAcademyAdmin || isSuperAdmin) && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
                    <h2 className="text-lg font-bold mb-4 text-emerald-900">Gestão da Academia</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/partners"
                            className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                                🤝
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-emerald-700">Parceiros</span>
                        </Link>

                        <Link
                            href="/admin/students"
                            className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                                👥
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-emerald-700">Alunos</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Card do Parceiro */}
            {isPartner && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold mb-4 text-blue-900">Painel do Parceiro</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/benefits"
                            className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600">
                                🏷️
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-blue-700">Minhas Ofertas</span>
                        </Link>

                        <Link
                            href="/admin/validate"
                            className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-50 group-hover:text-purple-600">
                                📷
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-purple-700">Validar Voucher</span>
                        </Link>
                    </div>
                </div>
            )}
        </main>
    )
}

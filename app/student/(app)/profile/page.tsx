import { getStudentEconomyStats, studentLogout } from '@/app/student/actions'
import { EconomyWidget } from '@/components/student/economy-widget'
import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { LogOut, User, ArrowLeft, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function StudentProfilePage() {
    const session = await getStudentSession()
    if (!session) return null

    // 1. Get Student Info
    const supabase = createAdminClient()
    const { data: student } = await supabase
        .from('students')
        .select('full_name, cpf, academy_id, academies(name, logo_url, primary_color)')
        .eq('id', session.studentId)
        .single()

    const academy = Array.isArray(student?.academies) ? student?.academies[0] : student?.academies

    // 2. Get Statistics
    const stats = await getStudentEconomyStats()
    const totalEconomy = stats?.total_economy || 0
    const vouchersCount = stats?.vouchers_count || 0

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Topo */}
            <header className="bg-white p-6 pb-8 border-b border-slate-100">
                <div className="mb-4">
                    <Link
                        href="/student/dashboard"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-[var(--primary-color)] text-sm font-medium transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Promoções
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 border-2 border-white shadow-sm overflow-hidden relative">
                        {/* Placeholder Avatar - Poderia ser foto real se tivéssemos upload */}
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">{student?.full_name}</h1>
                        <p className="text-sm text-slate-500">CPF: {student?.cpf}</p>
                        {academy && (
                            <p className="text-xs text-[var(--primary-color)] font-medium mt-1 px-2 py-0.5 bg-slate-100 rounded-md inline-block">
                                {academy.name}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            <main className="px-6 -mt-6">
                {/* Economy Widget (Destaque) */}
                <EconomyWidget totalEconomy={Number(totalEconomy)} vouchersCount={Number(vouchersCount)} />

                {/* Menu Options */}
                <div className="mt-8 space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Configurações</h3>

                    <form action={studentLogout}>
                        <button type="submit" className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-red-50 transition group">
                            <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-200 transition">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-700 group-hover:text-red-700">Sair da Conta</p>
                                <p className="text-xs text-slate-400">Encerrar sessão neste dispositivo</p>
                            </div>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

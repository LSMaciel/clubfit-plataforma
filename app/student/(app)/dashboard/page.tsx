import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'

export default async function StudentDashboardPage() {
    const session = await getStudentSession()
    if (!session) return null // Layout handles redirect

    const supabaseAdmin = createAdminClient()
    const { data: student } = await supabaseAdmin
        .from('students')
        .select('full_name')
        .eq('id', session.studentId)
        .single()

    const firstName = student?.full_name.split(' ')[0] || 'Aluno'

    return (
        <div className="p-6 space-y-8">
            {/* Welcome Card */}
            <section>
                <h1 className="text-2xl font-light text-slate-800">
                    Olá, <span className="font-bold">{firstName}</span>.
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Bem-vindo de volta!
                </p>
            </section>

            {/* Quick Action: Digital Wallet */}
            <section>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Carteira Digital</h3>
                        <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                            Gere seu QR Code para utilizar descontos nos parceiros.
                        </p>
                    </div>
                    <Link
                        href="/student/wallet"
                        className="w-full py-3 px-6 rounded-xl font-bold bg-[var(--primary-color)] text-white shadow-md shadow-[var(--primary-color)]/20 active:scale-95 transition-transform inline-block"
                    >
                        Abrir Meu Cartão
                    </Link>
                </div>
            </section>

            {/* Partner Teaser */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800">Parceiros em Destaque</h2>
                    <Link href="/student/partners" className="text-xs font-medium text-[var(--primary-color)] hover:underline">
                        Ver todos
                    </Link>
                </div>
                {/* MVP: Teaser estático que leva para a lista */}
                <Link href="/student/partners" className="block bg-white p-4 rounded-xl border border-slate-100 text-center hover:bg-slate-50 transition-colors group">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">🛍️</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Explorar Clube de Vantagens</p>
                    <p className="text-xs text-slate-400 mt-1">Clique para ver as ofertas</p>
                </Link>
            </section>
        </div>
    )
}

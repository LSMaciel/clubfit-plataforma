
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { StatusCell } from './status-cell'
import { RenewalButton } from './renewal-button'

import { MagicLinkButton } from './magic-link-button'

export default async function SuperAdminAcademiesPage() {
    const supabase = await createClient()

    // Buscar academias (apenas Super Admin verá todas devido ao RLS, mas garantimos visualização)
    const { data: academies, error } = await supabase
        .from('academies')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestão Global de Academias</h1>
                    <p className="text-sm text-slate-500">Controle de ciclo de vida e status</p>
                </div>
                <Link
                    href="/admin/academies/new"
                    className="bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 flex items-center gap-2"
                >
                    <span>+</span> Nova Academia
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Academia</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ciclo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criado em</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {academies?.map((academy) => (
                            <tr key={academy.id} className={academy.status !== 'ACTIVE' ? 'bg-slate-50/50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {academy.logo_url ? (
                                            <img src={academy.logo_url} alt={academy.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                                                {academy.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{academy.name}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: academy.primary_color || '#000000' }}></div>
                                                <span className="text-xs text-slate-400">{academy.primary_color}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <a href={`https://${academy.slug}.clubfit.app`} target="_blank" className="hover:text-indigo-600 hover:underline">
                                        /{academy.slug}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusCell academyId={academy.id} initialStatus={academy.status || 'ACTIVE'} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {(() => {
                                        if (!academy.due_day) return <span className="text-slate-400">--</span>

                                        const today = new Date()
                                        const currentYear = today.getFullYear()
                                        const currentMonth = today.getMonth()

                                        // Data de vencimento deste mês
                                        const dueDate = new Date(currentYear, currentMonth, academy.due_day)

                                        // Se o dia de vencimento ja passou, e nao pagou, entao venceu.
                                        // Se ainda nao passou, vence dia X.

                                        // Ultimo pagamento
                                        const lastPayment = academy.last_payment_date ? new Date(academy.last_payment_date) : null
                                        if (lastPayment) lastPayment.setHours(12, 0, 0, 0)

                                        // Esta pago se lastPayment for deste mes ou futuro
                                        const isPaid = lastPayment && (
                                            (lastPayment.getMonth() === currentMonth && lastPayment.getFullYear() === currentYear) ||
                                            lastPayment > today
                                        )

                                        const isLate = !isPaid && today > dueDate

                                        return (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${isLate ? 'text-red-600' : 'text-slate-900'}`}>
                                                        Vence: {academy.due_day}/{currentMonth + 1}/{currentYear}
                                                    </span>
                                                    {isLate && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">ATRASADO</span>}
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    Último: {lastPayment ? lastPayment.toLocaleDateString('pt-BR') : 'Nunca'}
                                                </span>
                                            </div>
                                        )
                                    })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(academy.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center gap-2">
                                        <RenewalButton
                                            academyId={academy.id}
                                            dueDay={academy.due_day}
                                            lastPayment={academy.last_payment_date}
                                        />
                                        <button className="text-slate-400 hover:text-indigo-600 transition-colors ml-2">
                                            Gerenciar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {academies?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Nenhuma academia encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

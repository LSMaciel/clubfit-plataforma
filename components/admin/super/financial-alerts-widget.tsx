import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export async function FinancialAlertsWidget() {
    const supabase = await createClient()

    // Buscar todas as academias ativas ou suspensas
    // Precisamos de due_day e last_payment_date
    const { data: academies } = await supabase
        .from('academies')
        .select('id, name, slug, status, due_day, last_payment_date')
        .in('status', ['ACTIVE', 'SUSPENDED'])
        .order('name')

    if (!academies) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const alerts = {
        overdue: [] as any[], // Vencido (Vermelho)
        dueSoon: [] as any[], // A Vencer (Amarelo)
        paid: 0 // Em dia
    }

    academies.forEach(academy => {
        // Se não tiver due_day, ignoramos (ou consideramos OK)
        if (!academy.due_day) return

        const dueDay = academy.due_day

        // Data de vencimento deste mês
        const dueDateThisMonth = new Date(currentYear, currentMonth, dueDay)

        // Se o dia de vencimento já passou, consideramos o mês atual.
        // Se ainda não passou, "vencimento atual" é hoje? Não, é o dia X deste mês.

        // Data do último pagamento (normalizada para meio-dia para evitar timezone issues básicos)
        const lastPayment = academy.last_payment_date ? new Date(academy.last_payment_date) : null
        if (lastPayment) lastPayment.setHours(12, 0, 0, 0)

        // Verificação:
        // O pagamento cobre o mês atual se:
        // last_payment_date >= dueDateThisMonth (Pelo menos a data de vencimento)
        // OU se last_payment_date for no mês atual ou posterior.

        // Simplificação Rígida: Consideramos "Pago" se month(lastPayment) >= month(today)
        // Mas e se pagou adiantado? Vamos usar uma lógica de dias:
        // Um pagamento é válido por 30 dias? Ou "referente ao mês"?
        // Vamos assumir: last_payment_date deve ser >= dueDateThisMonth - 30 days.

        // Lógica PROPOSTA NO PLANO:
        // OK: last_payment_date >= vencimento_atual OU (hoje < vencimento E pagou mes passado)

        // Vamos simplificar para MVP:
        // Se hoje > dueDateThisMonth E (lastPayment < dueDateThisMonth ou null) -> VENCIDO
        // Se hoje <= dueDateThisMonth E (dueDateThisMonth - hoje <= 5 dias) E (lastPayment < dueDateThisMonth ou null) -> A VENCER

        const isPaidForThisCycle = lastPayment && (
            lastPayment.getMonth() === currentMonth && lastPayment.getFullYear() === currentYear
            || lastPayment > today // Pagou futuro
        )

        // Se já pagou neste mês/ciclo, tá pago.
        if (isPaidForThisCycle) {
            alerts.paid++
            return
        }

        // Se não pagou ainda...
        const diffTime = dueDateThisMonth.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            // Vencimento já passou
            alerts.overdue.push({ ...academy, daysLate: Math.abs(diffDays) })
        } else if (diffDays <= 5) {
            // Vai vencer em breve
            alerts.dueSoon.push({ ...academy, daysUntil: diffDays })
        } else {
            // Vence longe, mas não pagou. Consideramos "Em dia" por enquanto (aguardando vencimento)
            alerts.paid++
        }
    })

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                💰 Alertas Financeiros
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* VENCIDOS */}
                <div className={`p-4 rounded-lg border ${alerts.overdue.length > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-sm font-medium text-slate-500 mb-1">Vencidos</div>
                    <div className={`text-2xl font-bold ${alerts.overdue.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {alerts.overdue.length}
                    </div>
                </div>

                {/* PRÓXIMOS */}
                <div className={`p-4 rounded-lg border ${alerts.dueSoon.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-sm font-medium text-slate-500 mb-1">A Vencer (5 dias)</div>
                    <div className={`text-2xl font-bold ${alerts.dueSoon.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {alerts.dueSoon.length}
                    </div>
                </div>

                {/* EM DIA */}
                <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                    <div className="text-sm font-medium text-slate-500 mb-1">Em dia</div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {alerts.paid}
                    </div>
                </div>
            </div>

            {/* Lista de Detalhes (Mostra só os criticos) */}
            {(alerts.overdue.length > 0 || alerts.dueSoon.length > 0) && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Atenção Necessária</h3>
                    <div className="space-y-2">
                        {alerts.overdue.map(ac => (
                            <Link key={ac.id} href={`/admin/super/academies`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-medium text-slate-700">{ac.name}</span>
                                </div>
                                <span className="text-xs font-bold text-red-600 group-hover:underline">
                                    Venceu há {ac.daysLate} dias
                                </span>
                            </Link>
                        ))}
                        {alerts.dueSoon.map(ac => (
                            <Link key={ac.id} href={`/admin/super/academies`} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-sm font-medium text-slate-700">{ac.name}</span>
                                </div>
                                <span className="text-xs font-bold text-amber-600 group-hover:underline">
                                    Vence em {ac.daysUntil} dias
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

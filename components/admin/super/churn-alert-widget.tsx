import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export async function ChurnAlertWidget() {
    const supabase = await createClient()

    // Threshold de 30 dias para considerar risco
    const THRESHOLD = 30

    // Chamada RPC
    const { data: risks, error } = await supabase.rpc('get_churn_risks', {
        days_threshold: THRESHOLD
    })

    if (error) {
        console.error('Error fetching churn risks:', error)
        return null
    }

    // Se não tiver riscos, não mostra nada (ou mostra mensagem de sucesso)
    // Opção: Mostrar apenas se houver riscos para não poluir
    if (!risks || risks.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                    🚀
                </div>
                <div>
                    <h2 className="text-sm font-bold text-emerald-900">Engajamento Total!</h2>
                    <p className="text-xs text-emerald-700">Todas as academias estão gerando vouchers.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                ⚠️ Risco de Churn (Inatividade {'>'} {THRESHOLD}d)
            </h2>

            <div className="space-y-3">
                {risks.map((item: any) => (
                    <Link
                        key={item.academy_id}
                        href={`/admin/super/academies`} // Idealmente link para detalhes da academia
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">💤</span>
                            <div>
                                <div className="text-sm font-bold text-slate-800">{item.academy_name}</div>
                                <div className="text-xs text-slate-500">
                                    {item.last_activity_date
                                        ? `Último voucher: ${new Date(item.last_activity_date).toLocaleDateString()}`
                                        : 'Nenhuma atividade registrada'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-block px-2 py-1 rounded-md bg-white border border-orange-200 text-orange-700 text-xs font-bold">
                                {item.days_inactive === 999 ? 'Nunca' : `${item.days_inactive} dias`}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

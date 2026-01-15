import { getAdminDashboardData } from '@/app/admin/(authenticated)/dashboard/actions'
import { KPICard } from '@/components/admin/kpi-card'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'

export async function KPIGrid({ academyId }: { academyId: string }) {
    // This fetch happens in parallel with other components
    const kpiData = await getAdminDashboardData(academyId)

    const currentEconomy = kpiData?.current_month.economy || 0
    const prevEconomy = kpiData?.previous_month.economy || 0

    let trend = 'neutral' as 'up' | 'down' | 'neutral'
    let trendValue = ''

    if (prevEconomy > 0) {
        const delta = ((currentEconomy - prevEconomy) / prevEconomy) * 100
        trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral'
        trendValue = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
    } else if (currentEconomy > 0) {
        trend = 'up'
        trendValue = '+100%'
    }

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <KPICard
                title="Economia Gerada (Mês)"
                value={moneyFormatter.format(Number(currentEconomy))}
                icon={DollarSign}
                description="vs mês passado"
                trend={trend}
                trendValue={trendValue}
            />
            <KPICard
                title="Vouchers Gerados"
                value={kpiData?.current_month.vouchers || 0}
                icon={CreditCard}
                description="neste mês"
            />
            <KPICard
                title="Alunos Ativos (ClubFit)"
                value={kpiData?.current_month.activity || 0}
                icon={Users}
                description="usuários únicos dia"
            />
        </div>
    )
}

import { signOut } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PageShell } from '@/components/admin/page-shell' // Import PageShell
import { FinancialAlertsWidget } from '@/components/admin/super/financial-alerts-widget'
import { ChurnAlertWidget } from '@/components/admin/super/churn-alert-widget'
import { getAdminDashboardData, getAcademyPartnersRanking, getPartnerDashboardData } from '@/app/admin/dashboard/actions'
import { PartnerDashboardView } from '@/components/admin/partner-dashboard-view'
import { KPICard } from '@/components/admin/kpi-card'
import { EconomyChart } from '@/components/admin/economy-chart'
import { PartnersRankingTable } from '@/components/admin/partners-ranking-table'
import { Activity, CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react'

export default async function DashboardPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()
    // ... existing auth ...
    const { data: { user } } = await supabase.auth.getUser()

    // ... fetch profile ...
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

    const isSuperAdmin = profile?.role === 'SUPER_ADMIN'
    const isAcademyAdmin = profile?.role === 'ACADEMY_ADMIN'
    const isPartner = profile?.role === 'PARTNER'

    // PARTNER DASHBOARD LOGIC
    if (isPartner) {
        const startDate = typeof searchParams?.startDate === 'string' ? searchParams.startDate : undefined
        const endDate = typeof searchParams?.endDate === 'string' ? searchParams.endDate : undefined

        const partnerData = await getPartnerDashboardData(startDate, endDate)

        return (
            <PageShell
                title="Visão Geral"
                subtitle="Acompanhe o desempenho do seu negócio."
            >
                {partnerData ? (
                    <PartnerDashboardView data={partnerData} />
                ) : (
                    <div>Erro ao carregar dados.</div>
                )}
            </PageShell>
        )
    }

    // ACADEMY ADMIN LOGIC (Existing)
    // ... existing code ...
    // BI Data Fetching
    let kpiData = null
    let rankingData = []

    if (isAcademyAdmin || isSuperAdmin) {
        kpiData = await getAdminDashboardData()
        rankingData = await getAcademyPartnersRanking(30)
    }

    // ... process data ...
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
    const currentDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

    return (
        <PageShell
            title="Visão Geral"
            subtitle={`Resumo de desempenho de ${currentDate}`}
        >
            {/* Same generic KPIs ... */}
            {(isAcademyAdmin || isSuperAdmin) && (
                <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {/* ... Chart & Table ... */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <EconomyChart data={kpiData?.daily_series || []} />
                            <PartnersRankingTable data={rankingData} />
                        </div>
                        {/* Right Col */}
                        <div className="space-y-6">
                            {/* ... Dica ... */}
                            <div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900">Dica ClubFit 🚀</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Incentive seus alunos a usarem os benefícios!
                                    Quanto mais economia gerada, maior a percepção de valor da mensalidade.
                                </p>
                            </div>
                            {/* ... Meta ... */}
                        </div>
                    </div>
                </div>
            )}

            {isSuperAdmin && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FinancialAlertsWidget />
                        <ChurnAlertWidget />
                    </div>
                </>
            )}
        </PageShell>
    )
}

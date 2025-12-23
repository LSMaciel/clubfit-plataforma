import { signOut } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FinancialAlertsWidget } from '@/components/admin/super/financial-alerts-widget'
import { ChurnAlertWidget } from '@/components/admin/super/churn-alert-widget'
import { getAdminDashboardData, getAcademyPartnersRanking } from '@/app/admin/dashboard/actions'
import { KPICard } from '@/components/admin/kpi-card'
import { EconomyChart } from '@/components/admin/economy-chart'
import { PartnersRankingTable } from '@/components/admin/partners-ranking-table'
import { Activity, CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react'

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

    // BI Data Fetching (Only for Academy/Super)
    let kpiData = null
    let rankingData = []

    if (isAcademyAdmin || isSuperAdmin) {
        kpiData = await getAdminDashboardData()
        rankingData = await getAcademyPartnersRanking(30) // Last 30 days
    }

    // Process Data for View
    const currentEconomy = kpiData?.current_month.economy || 0
    const prevEconomy = kpiData?.previous_month.economy || 0

    // Calculate Trend
    let trend = 'neutral' as 'up' | 'down' | 'neutral'
    let trendValue = ''

    if (prevEconomy > 0) {
        const delta = ((currentEconomy - prevEconomy) / prevEconomy) * 100
        trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral'
        trendValue = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
    } else if (currentEconomy > 0) {
        trend = 'up'
        trendValue = '+100%' // First month growth
    }

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <main className="p-8 max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
                <div className="text-sm text-slate-500">
                    {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* SECTION: SHORTCUTS (Moved to Top) */}

            {(isAcademyAdmin || isSuperAdmin) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <Link
                        href="/admin/partners"
                        className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white shadow-sm"
                    >
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 group-hover:text-emerald-700 text-emerald-600 transition">
                            🤝
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-emerald-800">Parceiros</span>
                    </Link>

                    <Link
                        href="/admin/students"
                        className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white shadow-sm"
                    >
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 group-hover:text-emerald-700 text-emerald-600 transition">
                            👥
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-emerald-800">Alunos</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white shadow-sm"
                    >
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 group-hover:text-purple-700 text-purple-600 transition">
                            🎨
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-purple-800">Personalizar App</span>
                    </Link>
                </div>
            )}

            {/* SECTION: ACADEMY BI (KPIs) */}
            {(isAcademyAdmin || isSuperAdmin) && (
                <div className="space-y-6 mb-10">
                    {/* KPI Cards */}
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

                    {/* Chart & Ranking Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <EconomyChart data={kpiData?.daily_series || []} />

                            {/* Partners Ranking Table */}
                            <PartnersRankingTable data={rankingData} />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-lg mb-2">Dica ClubFit 🚀</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed">
                                    Incentive seus alunos a usarem os benefícios!
                                    Quanto mais economia gerada, maior a percepção de valor da mensalidade.
                                </p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Meta do Mês</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold">R$ 5k</span>
                                    <span className="text-sm text-indigo-300 mb-1">em economia</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
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

            {/* ... Rest of existing shortcuts if any ... */}

            {/* ... Rest of existing shortcuts if any ... */}
        </main>
    )
}

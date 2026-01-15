import { getPartnerDashboardData } from '@/app/admin/(authenticated)/dashboard/actions'
import { PageShell } from '@/components/admin/page-shell'
import { PartnerDashboardView } from '@/components/admin/partner-dashboard-view'
import { FinancialAlertsWidget } from '@/components/admin/super/financial-alerts-widget'
import { ChurnAlertWidget } from '@/components/admin/super/churn-alert-widget'
import { getCachedAdminProfile } from '@/utils/supabase/cached-queries'
import { KPICard } from '@/components/admin/kpi-card' // Mantido para skeletons se necessário
import { Suspense } from 'react'
import { KPIGrid } from '@/components/admin/dashboard/kpi-grid'
import { ChartsSection } from '@/components/admin/dashboard/charts-section'
import { createClient } from '@/utils/supabase/server' // Mantido para partner logic legada se necessario
import { redirect } from 'next/navigation'

export default async function DashboardPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams

    // 1. Optimized Profile Fetch (Cached)
    const profile = await getCachedAdminProfile()

    if (!profile) {
        // Fallback safety (should be handled by middleware mostly)
        redirect('/admin/login')
    }

    const isSuperAdmin = profile.role === 'SUPER_ADMIN'
    const isAcademyAdmin = profile.role === 'ACADEMY_ADMIN'
    const isPartner = profile.role === 'PARTNER'

    // PARTNER DASHBOARD LOGIC (Legacy / Not Optimized yet)
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

    // ACADEMY / SUPER ADMIN LOGIC (Optimized)
    const currentDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const effectiveAcademyId = profile.effective_academy_id

    // Fallback UI for KPIs
    const KPIFallback = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-100/50 rounded-xl animate-pulse border border-slate-100" />
            ))}
        </div>
    )

    // Fallback UI for Charts
    const ChartsFallback = (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-100/50 rounded-xl animate-pulse border border-slate-100" />
            <div className="h-96 bg-slate-100/50 rounded-xl animate-pulse border border-slate-100" />
        </div>
    )

    return (
        <PageShell
            title="Visão Geral"
            subtitle={`Resumo de desempenho de ${currentDate}`}
        >
            {(isAcademyAdmin || isSuperAdmin) && effectiveAcademyId && (
                <div className="space-y-6">

                    {/* Streaming Area 1: KPIs */}
                    <Suspense fallback={KPIFallback}>
                        <KPIGrid academyId={effectiveAcademyId} />
                    </Suspense>

                    {/* Streaming Area 2: Charts (Heavier) */}
                    <Suspense fallback={ChartsFallback}>
                        <ChartsSection academyId={effectiveAcademyId} />
                    </Suspense>

                </div>
            )}

            {(isAcademyAdmin || isSuperAdmin) && !effectiveAcademyId && (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    Nenhuma academia selecionada para visualizar dados.
                </div>
            )}

            {isSuperAdmin && (
                <div className="mt-10 pt-10 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Monitoramento Global</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FinancialAlertsWidget />
                        <ChurnAlertWidget />
                    </div>
                </div>
            )}
        </PageShell>
    )
}

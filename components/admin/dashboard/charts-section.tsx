import { getAdminDashboardData, getAcademyPartnersRanking } from '@/app/admin/(authenticated)/dashboard/actions'
import dynamic from 'next/dynamic'

const EconomyChart = dynamic(() => import('@/components/admin/economy-chart').then(mod => mod.EconomyChart), {
    loading: () => <div className="h-[350px] w-full bg-slate-50 rounded-xl animate-pulse" />,
    ssr: false
})
import { PartnersRankingTable } from '@/components/admin/partners-ranking-table'

export async function ChartsSection({ academyId }: { academyId: string }) {
    // Parallel fetching
    const [kpiData, rankingData] = await Promise.all([
        getAdminDashboardData(academyId),
        getAcademyPartnersRanking(academyId, 30)
    ])

    return (
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
            </div>
        </div>
    )
}

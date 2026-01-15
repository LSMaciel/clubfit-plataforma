
import { PageShell } from '@/components/admin/page-shell'

export default function DashboardLoading() {
    return (
        <PageShell
            title="Visão Geral"
            subtitle="Carregando dados..."
        >
            <div className="space-y-6">
                {/* KPI Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
                    ))}
                </div>

                {/* Chart Skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
                    <div className="h-96 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
                </div>
            </div>
        </PageShell>
    )
}

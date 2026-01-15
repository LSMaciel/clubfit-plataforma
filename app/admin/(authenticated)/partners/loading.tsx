
import { PageShell } from '@/components/admin/page-shell'

export default function PartnersLoading() {
    return (
        <PageShell
            title="Parceiros Comerciais"
            subtitle="Carregando parceiros..."
        >
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                </div>
                <div className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex gap-4 animate-pulse">
                            <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    )
}

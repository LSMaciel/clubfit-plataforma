
export default function SuperPartnersLoading() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-4 w-96 bg-slate-100 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-48 bg-slate-100 rounded animate-pulse"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <div className="flex gap-4">
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="p-4 flex gap-4 animate-pulse">
                            <div className="h-12 w-full bg-slate-50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

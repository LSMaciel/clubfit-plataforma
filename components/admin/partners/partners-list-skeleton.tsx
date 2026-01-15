import { Skeleton } from "@/components/ui/skeleton"

export function PartnersListSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Localização</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Status Vínculo</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-900 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-3 w-40" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-6 w-16 rounded-md" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Skeleton className="h-4 w-20 ml-auto" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

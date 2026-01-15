import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6">

            {/* Botão Voltar Skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Grid de Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
                        {/* Cover Image Skeleton */}
                        <div className="h-36 bg-slate-200 relative">
                            <Skeleton className="absolute top-3 left-3 h-6 w-24 rounded-lg bg-slate-300/50" />
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-4 flex-1 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                            </div>

                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />

                            <div className="mt-auto border-t border-slate-50 pt-3 flex gap-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>

                        {/* Footer Button Skeleton */}
                        <div className="px-4 pb-4">
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900">

            {/* Background Decorativo Dummy */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-slate-800 to-transparent" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-md">

                {/* Logo da Academia Skeleton */}
                <div className="mb-8 flex flex-col items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full bg-slate-700/50" />
                    <Skeleton className="h-8 w-48 bg-slate-700/50" />
                    <Skeleton className="h-4 w-32 bg-slate-700/30" />
                </div>

                {/* Formulário Skeleton */}
                <div className="w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full bg-slate-200" />
                        <Skeleton className="h-10 w-full bg-slate-200" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-xl bg-slate-300" />
                </div>

                <div className="mt-12 text-center opacity-40">
                    <Skeleton className="h-4 w-24 bg-slate-700/30 mx-auto" />
                </div>

            </div>
        </div>
    )
}

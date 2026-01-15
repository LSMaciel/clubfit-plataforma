'use client'

import dynamic from 'next/dynamic'

const EconomyChartInternal = dynamic(
    () => import('@/components/admin/economy-chart').then((mod) => mod.EconomyChart),
    {
        loading: () => <div className="h-[350px] w-full bg-slate-50 rounded-xl animate-pulse" />,
        ssr: false,
    }
)

export function LazyEconomyChart(props: any) {
    return <EconomyChartInternal {...props} />
}

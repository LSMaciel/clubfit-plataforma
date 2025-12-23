'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface EconomyChartProps {
    data: { date: string; estimated_economy: number }[]
}

export function EconomyChart({ data }: EconomyChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p>Nenhum dado para exibir no gráfico ainda.</p>
            </div>
        )
    }

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem)
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date)
    }

    const formatYAxis = (value: number) => {
        if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
        return `R$ ${value}`
    }

    const formatTooltip = (value: any) => [
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)),
        'Economia'
    ]

    return (
        <div className="h-[350px] w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Evolução da Economia (30 dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEconomy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickFormatter={formatXAxis} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatYAxis} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip formatter={formatTooltip} />
                    <Area type="monotone" dataKey="estimated_economy" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEconomy)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

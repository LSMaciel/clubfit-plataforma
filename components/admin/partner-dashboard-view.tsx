'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Ticket, Trophy, Users } from 'lucide-react'

interface PartnerDashboardViewProps {
    data: {
        metrics: {
            totalVouchers: number
            topPromo: string
            topPromoCount: number
        }
        history: any[]
    }
}

export function PartnerDashboardView({ data }: PartnerDashboardViewProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Simple Period Filter Handler
    const handlePeriodChange = (days: number) => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - days)

        const params = new URLSearchParams(searchParams)
        params.set('startDate', start.toISOString())
        params.set('endDate', end.toISOString())

        router.push(`?${params.toString()}`)
    }

    const { metrics, history } = data

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Minha Performance</h2>
                    <p className="text-sm text-slate-500">Acompanhe os resultados das suas promoções.</p>
                </div>

                <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                    <button
                        onClick={() => handlePeriodChange(7)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                    >
                        7 Dias
                    </button>
                    <div className="w-px bg-slate-200 my-1 mx-1"></div>
                    <button
                        onClick={() => handlePeriodChange(30)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                    >
                        30 Dias
                    </button>
                    <div className="w-px bg-slate-200 my-1 mx-1"></div>
                    <button
                        onClick={() => handlePeriodChange(90)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                    >
                        3 Meses
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Vouchers Gerados
                        </CardTitle>
                        <Ticket className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.totalVouchers}</div>
                        <p className="text-xs text-slate-500 mt-1">no período selecionado</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Promoção Campeã
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 truncate" title={metrics.topPromo}>
                            {metrics.topPromo}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {metrics.topPromoCount} vouchers gerados
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Histórico de Vouchers</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Aluno</th>
                                <th className="px-6 py-3">Promoção</th>
                                <th className="px-6 py-3">Código</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 text-slate-600">
                                            {new Date(item.createdAt).toLocaleDateString('pt-BR')} <br />
                                            <span className="text-xs text-slate-400">
                                                {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-medium text-slate-900">
                                            {item.studentName}
                                        </td>
                                        <td className="px-6 py-3 text-slate-600 truncate max-w-[200px]">
                                            {item.benefitTitle}
                                        </td>
                                        <td className="px-6 py-3 font-mono text-slate-500">
                                            {item.token ? item.token.substring(0, 8).toUpperCase() : '...'}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`
                                                inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                                                ${item.status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'EXPIRED' ? 'bg-red-50 text-red-600' :
                                                        'bg-slate-100 text-slate-600'}
                                            `}>
                                                {item.status === 'VALIDATED' ? 'Usado' :
                                                    item.status === 'EXPIRED' ? 'Expirou' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Nenhum voucher encontrado neste período.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

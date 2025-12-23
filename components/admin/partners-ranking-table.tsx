'use client'

import { Trophy, Store } from 'lucide-react'
import Image from 'next/image'

interface PartnerRankingItem {
    partner_id: string
    partner_name: string
    partner_logo: string | null
    category_name: string | null
    total_vouchers: number
    total_economy: string | number
}

interface PartnersRankingTableProps {
    data: PartnerRankingItem[]
}

export function PartnersRankingTable({ data }: PartnersRankingTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Trophy className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700">Ranking Vazio</h3>
                <p className="text-slate-400 text-sm mt-1">Nenhum parceiro gerou resultados neste período.</p>
            </div>
        )
    }

    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Top Parceiros
                </h3>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                    Últimos 30 dias
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Parceiro</th>
                            <th className="px-6 py-3 text-right">Vouchers</th>
                            <th className="px-6 py-3 text-right">Economia Gerada</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item, index) => (
                            <tr key={item.partner_id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-bold text-slate-400 w-12">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 relative rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {item.partner_logo ? (
                                                <Image
                                                    src={item.partner_logo}
                                                    alt={item.partner_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Store className="w-4 h-4 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{item.partner_name}</p>
                                            <p className="text-xs text-slate-400">{item.category_name || 'Diversos'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                                        {item.total_vouchers}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                    {formatter.format(Number(item.total_economy))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

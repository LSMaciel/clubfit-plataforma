'use client'

import { ArrowRight, PiggyBank, Receipt, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface EconomyWidgetProps {
    totalEconomy: number
    vouchersCount: number
}

export function EconomyWidget({ totalEconomy, vouchersCount }: EconomyWidgetProps) {
    // Formatter
    const money = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(totalEconomy)

    return (
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Texture/Blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-amber-100 text-sm font-medium mb-1">
                    <PiggyBank className="w-4 h-4" />
                    <span>Economia Total</span>
                </div>

                <h2 className="text-4xl font-bold tracking-tight">{money}</h2>

                <p className="text-amber-100 text-xs mt-1">
                    Você já economizou esse valor usando o ClubFit! 🚀
                </p>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <Receipt className="w-4 h-4 text-white" />
                        <span className="text-xs font-semibold">{vouchersCount} vouchers</span>
                    </div>

                    <Link
                        href="/student/profile/history"
                        className="flex items-center gap-1 text-xs font-bold bg-white text-amber-600 px-4 py-2 rounded-full shadow-sm hover:bg-amber-50 transition"
                    >
                        Ver Extrato
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

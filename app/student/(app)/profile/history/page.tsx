import { getStudentHistory } from '@/app/student/actions'
import { ArrowLeft, Calendar, Store } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function HistoryPage() {
    const history = await getStudentHistory(0) // Page 0 mostly for MVP

    // Formatter
    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-4">
                <Link href="/student/profile" className="text-slate-400 hover:text-slate-600 p-1">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold text-slate-800">Extrato de Economia</h1>
            </header>

            <main className="p-6">
                {history.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <p>Nenhum histórico encontrado.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item: any) => (
                            <div key={item.token_id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Logo or Method Icon */}
                                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                                        {item.partner_logo ? (
                                            <Image
                                                src={item.partner_logo}
                                                alt={item.partner_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Store className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{item.partner_name}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-1">{item.benefit_title}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {dateFmt.format(new Date(item.created_at))}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {Number(item.estimated_economy) > 0 ? (
                                        <span className="block font-bold text-green-600 text-sm">
                                            +{currency.format(item.estimated_economy)}
                                        </span>
                                    ) : (
                                        <span className="block font-bold text-slate-300 text-sm">
                                            R$ 0,00
                                        </span>
                                    )}
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${item.status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                                            item.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {item.status === 'VALIDATED' ? 'Usado' : item.status === 'PENDING' ? 'Gerado' : 'Expirado'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

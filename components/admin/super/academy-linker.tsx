'use client'

import { useState } from 'react'
import { linkAcademySuper, unlinkAcademySuper } from '@/app/admin/super/partners/actions'

interface Academy {
    id: string
    name: string
    slug: string
}

interface Link {
    academyId: string
    academyName: string
    status: 'ACTIVE' | 'INACTIVE'
}

interface AcademyLinkerProps {
    partnerId: string
    initialLinks: Link[]
    allAcademies: Academy[]
}

export function AcademyLinker({ partnerId, initialLinks, allAcademies }: AcademyLinkerProps) {
    const [isPending, setIsPending] = useState(false)
    const [selectedAcademy, setSelectedAcademy] = useState('')

    // Computar academias disponíveis (que não estão ativas)
    // Na verdade, podemos mostrar todas, mas desabilitar as já vinculadas seria melhor UX.
    // Vamos simplificar: se já está vinculado (ACTIVE), não mostra no select ou mostra disabled.
    const activeAcademyIds = new Set(initialLinks.filter(l => l.status === 'ACTIVE').map(l => l.academyId))

    async function handleLink() {
        if (!selectedAcademy) return
        setIsPending(true)
        await linkAcademySuper(partnerId, selectedAcademy)
        setIsPending(false)
        setSelectedAcademy('')
    }

    async function handleUnlink(academyId: string) {
        if (!confirm('Tem certeza que deseja remover o acesso dessa academia?')) return
        setIsPending(true)
        await unlinkAcademySuper(partnerId, academyId)
        setIsPending(false)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Gestão de Vínculos</h2>

            {/* Action Bar */}
            <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Adicionar Academia
                    </label>
                    <select
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={selectedAcademy}
                        onChange={(e) => setSelectedAcademy(e.target.value)}
                        disabled={isPending}
                    >
                        <option value="">Selecione uma academia...</option>
                        {allAcademies.map(acc => (
                            <option key={acc.id} value={acc.id} disabled={activeAcademyIds.has(acc.id)}>
                                {acc.name} {activeAcademyIds.has(acc.id) ? '(Já vinculada)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleLink}
                    disabled={!selectedAcademy || isPending}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? 'Processando...' : 'Vincular Agora'}
                </button>
            </div>

            {/* List */}
            <div className="overflow-hidden bg-white ring-1 ring-slate-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Academia</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {initialLinks.map((link) => (
                            <tr key={link.academyId}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                    {link.academyName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                    {link.status === 'ACTIVE' ? (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Ativo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                            Inativo
                                        </span>
                                    )}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    {link.status === 'ACTIVE' ? (
                                        <button
                                            onClick={() => handleUnlink(link.academyId)}
                                            disabled={isPending}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-30"
                                        >
                                            Desvincular
                                        </button>
                                    ) : (
                                        <span className="text-slate-300 pointer-events-none">Removido</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {initialLinks.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500 text-sm">
                                    Nenhuma academia vinculada a este parceiro.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

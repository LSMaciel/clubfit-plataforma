'use client'

import { useState } from 'react'
import { updateAcademyStatus } from '../actions'

type AcademyStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'MAINTENANCE'

interface StatusCellProps {
    academyId: string
    initialStatus: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: 'Ativo', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    INACTIVE: { label: 'Inativo', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
    SUSPENDED: { label: 'Suspenso', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    MAINTENANCE: { label: 'Manutenção', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
}

export function StatusCell({ academyId, initialStatus }: StatusCellProps) {
    const [status, setStatus] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const currentConfig = statusConfig[status] || statusConfig['INACTIVE']

    async function handleStatusChange(newStatus: string) {
        if (newStatus === status) return

        if (newStatus === 'SUSPENDED' || newStatus === 'INACTIVE') {
            if (!confirm(`Tem certeza que deseja alterar o status para ${newStatus}? Isso bloqueará o acesso.`)) {
                return
            }
        }

        setIsLoading(true)
        setIsOpen(false)

        const result = await updateAcademyStatus(academyId, newStatus)

        if (result.success) {
            setStatus(newStatus)
        } else {
            alert('Erro ao atualizar status: ' + result.error)
        }

        setIsLoading(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`
                    px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 transition-all
                    ${currentConfig.bg} ${currentConfig.color}
                    ${isLoading ? 'opacity-50 cursor-wait' : 'hover:brightness-95'}
                `}
            >
                <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-current'}`} />
                {isLoading ? 'Atualizando...' : currentConfig.label}
                <span className="text-[10px] opacity-60">▼</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 overflow-hidden">
                        {Object.keys(statusConfig).map((key) => {
                            const config = statusConfig[key]
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleStatusChange(key)}
                                    className={`
                                        w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2
                                        ${key === status ? 'bg-slate-50 text-slate-900' : 'text-slate-500'}
                                    `}
                                >
                                    <div className={`w-2 h-2 rounded-full ${key === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                    {config.label}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

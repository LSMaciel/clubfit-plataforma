'use client'

import { useRouter } from 'next/navigation'
import { switchAdminContext } from '@/app/admin/academies/actions'
import { useState, useTransition } from 'react'

interface Academy {
    id: string
    name: string
}

interface AdminContextSwitcherProps {
    academies: Academy[]
    currentContextId: string | null
}

export function AdminContextSwitcher({ academies, currentContextId }: AdminContextSwitcherProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedId, setSelectedId] = useState<string>(currentContextId || '')

    async function handleSwitch(formattedId: string) {
        // formattedId is "" for global, or "uuid" for academy
        const targetId = formattedId === '' ? null : formattedId
        setSelectedId(formattedId)

        startTransition(async () => {
            await switchAdminContext(targetId)
            router.refresh()
        })
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 hidden md:inline">Contexto:</span>
            <select
                value={selectedId}
                onChange={(e) => handleSwitch(e.target.value)}
                disabled={isPending}
                className={`
                    text-sm border-slate-200 rounded-md py-1 pl-2 pr-8 cursor-pointer focus:ring-2 focus:ring-slate-900 focus:border-transparent
                    ${selectedId === '' ? 'bg-slate-100 text-slate-700 font-medium' : 'bg-amber-50 border-amber-200 text-amber-900 font-bold'}
                `}
            >
                <option value="">🌎 Visão Global (Super Admin)</option>
                <optgroup label="Gerenciar Academia Específica">
                    {academies.map((ac) => (
                        <option key={ac.id} value={ac.id}>
                            🏢 {ac.name}
                        </option>
                    ))}
                </optgroup>
            </select>
            {isPending && <span className="text-xs text-slate-400 animate-pulse">Carregando...</span>}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { renewAcademySubscription } from '../actions'

interface RenewalButtonProps {
    academyId: string
    dueDay?: number
    lastPayment?: string
}

export function RenewalButton({ academyId, dueDay, lastPayment }: RenewalButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'ok' | 'late' | 'none'>('none')

    // Determine status for visual feedback
    useEffect(() => {
        if (!dueDay) {
            setStatus('none')
            return
        }

        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const dueDate = new Date(currentYear, currentMonth, dueDay)

        let paymentDate = lastPayment ? new Date(lastPayment) : null
        if (paymentDate) paymentDate.setHours(12, 0, 0, 0)

        // Verificacao Simplificada igual ao Widget
        // Se pagou neste mes ou futuro -> OK
        const isPaid = paymentDate && (
            (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) ||
            paymentDate > today
        )

        if (isPaid) {
            setStatus('ok')
            return
        }

        // Se nao pagou e ja passou o vencimento -> Late
        if (today > dueDate) {
            setStatus('late')
        } else {
            // Nao pagou ainda, mas nao venceu.
            setStatus('none')
        }

    }, [dueDay, lastPayment])

    async function handleRenew() {
        if (!confirm('Confirmar o pagamento da mensalidade atual para esta academia?')) return

        setIsLoading(true)
        const res = await renewAcademySubscription(academyId)

        if (res.success) {
            // Toast logic normally creates conflict, relying on server revalidate
            // Local update strictly for button feedback
            setStatus('ok')
            router.refresh()
        } else {
            alert('Falha ao renovar: ' + res.error)
        }
        setIsLoading(false)
    }

    if (isLoading) {
        return <span className="text-xs text-slate-400">Processando...</span>
    }

    if (status === 'ok') {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 cursor-default">
                Pago ✔
            </span>
        )
    }

    return (
        <button
            onClick={handleRenew}
            className={`
                px-3 py-1 rounded-md text-xs font-bold border transition-colors flex items-center gap-1
                ${status === 'late'
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 animate-pulse-slow'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200'}
            `}
            title={status === 'late' ? 'Pagamento Atrasado! Clique para dar baixa.' : 'Registrar Pagamento'}
        >
            💲 Renovar
        </button>
    )
}

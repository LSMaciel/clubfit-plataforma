'use client'

import { switchAdminContext } from '@/app/admin/(authenticated)/academies/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AccessAcademyButton({ academyId }: { academyId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleAccess = async () => {
        setLoading(true)
        try {
            const result = await switchAdminContext(academyId)
            if (result.success) {
                // Force a hard refresh/navigation to ensure all server components
                // pick up the new cookie context immediately
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                alert('Erro ao mudar de contexto: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Erro inesperado.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleAccess}
            disabled={loading}
            title="Acessar Painel desta Academia"
            className="text-slate-400 hover:text-indigo-600 transition-colors ml-2 font-medium text-sm disabled:opacity-50 disabled:cursor-wait flex items-center gap-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            {loading ? '...' : 'Acessar'}
        </button>
    )
}

'use client'

import { useState } from 'react'
import { MagicLinkModal } from '@/components/admin/super/magic-link-modal'

interface MagicLinkButtonProps {
    academyId: string
    academyName: string
}

export function MagicLinkButton({ academyId, academyName }: MagicLinkButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                title="Gerar Link de Acesso"
                className="text-slate-400 hover:text-amber-600 transition-colors bg-slate-50 hover:bg-amber-50 p-2 rounded-full border border-slate-200 hover:border-amber-200"
            >
                🔑
            </button>

            <MagicLinkModal
                academyId={academyId}
                academyName={academyName}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

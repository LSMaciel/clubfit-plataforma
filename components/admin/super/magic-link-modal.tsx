'use client'

import { useState } from 'react'
import { getAcademyAdmins, generateMagicLink } from '@/app/admin/super/actions'

interface MagicLinkModalProps {
    academyId: string
    academyName: string
    isOpen: boolean
    onClose: () => void
}

export function MagicLinkModal({ academyId, academyName, isOpen, onClose }: MagicLinkModalProps) {
    const [loading, setLoading] = useState(false)
    const [admins, setAdmins] = useState<any[]>([])
    const [view, setView] = useState<'LIST' | 'RESULT'>('LIST')
    const [magicLink, setMagicLink] = useState('')
    const [error, setError] = useState('')

    // Fetch admins when opening (or via useEffect if keeping mounting logic simple)
    // Here we assume it mounts/unmounts or we trigger fetch

    // Better: Trigger fetch when 'isOpen' becomes true, or a "Load" button.
    // Let's us a "Load Admins" effect if isOpen changes to true.

    React.useEffect(() => {
        if (isOpen) {
            fetchAdmins()
        }
    }, [isOpen])

    async function fetchAdmins() {
        setLoading(true)
        setError('')
        setView('LIST')

        const result = await getAcademyAdmins(academyId)

        if (result.error) {
            setError(result.error)
        } else {
            setAdmins(result.admins)
        }
        setLoading(false)
    }

    async function handleGenerate(userId: string) {
        setLoading(true)
        setError('')

        const result = await generateMagicLink(userId)

        if (result.error) {
            setError(result.error)
        } else {
            setMagicLink(result.url)
            setView('RESULT')
        }
        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-1 text-slate-900">Acesso Administrativo 🔑</h2>
                <p className="text-sm text-slate-500 mb-6">Gerar Magic Link para <strong>{academyName}</strong></p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                {loading && view === 'LIST' && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {!loading && view === 'LIST' && admins.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                        Nenhum administrador encontrado nesta academia.
                    </div>
                )}

                {!loading && view === 'LIST' && admins.length > 0 && (
                    <div className="space-y-3">
                        {admins.map((admin) => (
                            <div key={admin.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                                <div>
                                    <p className="font-medium text-slate-800">{admin.name}</p>
                                    <p className="text-xs text-slate-500">{admin.email}</p>
                                </div>
                                <button
                                    onClick={() => handleGenerate(admin.id)}
                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                >
                                    Gerar Link
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'RESULT' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800 font-medium mb-2">Link gerado com sucesso!</p>
                            <input
                                readOnly
                                value={magicLink}
                                className="w-full text-xs p-2 bg-white border border-green-300 rounded text-slate-600 font-mono select-all"
                                onClick={(e) => e.currentTarget.select()}
                            />
                        </div>
                        <p className="text-xs text-slate-500 text-center">
                            Este link é único e expira em breve. Envie para o administrador via canal seguro (WhatsApp).
                        </p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(magicLink)
                                alert('Link copiado!')
                            }}
                            className="w-full py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium text-sm"
                        >
                            Copiar Link
                        </button>
                        <button
                            onClick={() => setView('LIST')}
                            className="w-full py-2 text-slate-600 hover:text-slate-900 text-sm mt-2"
                        >
                            Voltar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

import React from 'react'

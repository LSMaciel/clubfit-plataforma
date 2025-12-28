'use client'

import { useState, useEffect } from 'react'

interface StudentWalletProps {
    student: {
        name: string
        cpf: string // Used for ID/Validation
        status: string // ACTIVE | INACTIVE
        academyName: string
        academyLogo: string | null
        primaryColor: string
    } | null
}

export function StudentWallet({ student }: StudentWalletProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [walletData, setWalletData] = useState<StudentWalletProps['student']>(null)
    const [isOfflineMode, setIsOfflineMode] = useState(false)

    // Sync with LocalStorage and Handle Offline Fallback
    useEffect(() => {
        const STORAGE_KEY = 'clubfit_wallet_data'

        if (student) {
            // Online: Update Storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(student))
            setWalletData(student)
            setIsOfflineMode(false)
        } else {
            // Potential Offline: Try to read from Storage
            const cached = localStorage.getItem(STORAGE_KEY)
            if (cached) {
                try {
                    setWalletData(JSON.parse(cached))
                    setIsOfflineMode(true)
                } catch (e) {
                    console.error('Failed to parse cached wallet', e)
                }
            }
        }
    }, [student])

    if (!walletData) return null

    // Determine Status Color
    const isActive = walletData.status === 'ACTIVE'
    const statusColor = isActive ? '#22c55e' : '#ef4444' // Green or Red
    const statusText = isActive ? 'ATIVO' : 'INATIVO'

    // Use primary color from academy or fallback
    const cardBg = walletData.primaryColor || '#0f172a'

    return (
        <>
            {/* FAB - Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-40 bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 border-2 border-white/10"
                style={{ backgroundColor: cardBg }}
                aria-label="Abrir Carteira"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
            </button>

            {/* Modal / Bottom Sheet */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Card Content */}
                    <div className="relative bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
                        {/* Drag Handle (Mobile aesthetic) */}
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Academy Header */}
                        <div className="flex flex-col items-center mb-6">
                            {walletData.academyLogo ? (
                                <img
                                    src={walletData.academyLogo}
                                    alt={walletData.academyName}
                                    className="h-12 object-contain mb-2"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-slate-800">{walletData.academyName}</h2>
                            )}
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Carteira Digital</p>
                        </div>

                        {/* ID Card */}
                        <div
                            className="rounded-xl p-6 text-white shadow-lg relative overflow-hidden mb-6"
                            style={{ backgroundColor: cardBg }}
                        >
                            {/* Texture/Pattern Overlay */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-70 mb-1">Nome do Aluno</p>
                                        <h3 className="font-bold text-lg leading-tight">{walletData.name}</h3>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                                        ID
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-70 mb-1">CPF</p>
                                        <p className="font-mono text-sm tracking-wider opacity-90">
                                            {walletData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.$3-$4')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/90 text-slate-900 px-3 py-1 rounded-full shadow-sm">
                                        <div
                                            className="w-2 h-2 rounded-full animate-pulse"
                                            style={{ backgroundColor: statusColor }}
                                        />
                                        <span className="text-xs font-bold">{statusText}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                            <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                                {/* Using a generic QR API or just a placeholder for now */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletData.cpf}`}
                                    alt="QR Code"
                                    className="w-full h-full opacity-90"
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-mono text-center">
                                {isOfflineMode ? 'Modo Offline - Validação Visual' : 'Atualizado agora'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

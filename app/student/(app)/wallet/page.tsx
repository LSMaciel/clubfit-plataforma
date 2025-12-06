'use client'

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { generateWalletToken } from './actions'
import Link from 'next/link'

export default function WalletPage() {
    const [token, setToken] = useState<string | null>(null)
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Função para carregar novo token
    async function loadToken() {
        setLoading(true)
        setError(null)
        setToken(null) // Clear previous to avoid confusion

        try {
            const result = await generateWalletToken()
            if (result.error) {
                setError(result.error)
            } else {
                setToken(result.token!)
                const expiry = new Date(result.expiresAt!)
                setExpiresAt(expiry)
                // Calcular tempo restante em segundos
                const secondsLeft = Math.floor((expiry.getTime() - Date.now()) / 1000)
                setTimeLeft(Math.max(0, secondsLeft))
            }
        } catch (err) {
            setError('Erro de conexão.')
        } finally {
            setLoading(false)
        }
    }

    // Effect inicial
    useEffect(() => {
        loadToken()
    }, [])

    // Contador Regressivo
    useEffect(() => {
        if (!expiresAt || timeLeft <= 0) return

        const interval = setInterval(() => {
            const seconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
            setTimeLeft(Math.max(0, seconds))
        }, 1000)

        return () => clearInterval(interval)
    }, [expiresAt, timeLeft])

    // Formatar Tempo MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const isExpired = timeLeft <= 0 && !loading

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-8 px-4">
            {/* Header com Voltar */}
            <div className="w-full max-w-md mb-8 flex items-center">
                <Link href="/student/dashboard" className="text-[var(--primary-color)] flex items-center gap-2 font-medium">
                    ← Voltar
                </Link>
                <h1 className="flex-1 text-center font-bold text-slate-800 text-lg mr-8">
                    Carteira Digital
                </h1>
            </div>

            {/* Card do QR Code */}
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col items-center p-8 relative">

                {/* Status Bar Superior */}
                <div className="w-full flex justify-between items-center mb-6">
                    <span className="text-sm text-slate-400 font-medium">Token de Acesso</span>
                    {loading ? (
                        <span className="text-xs text-slate-400 animate-pulse">Gerando...</span>
                    ) : (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {isExpired ? 'EXPIRADO' : 'VÁLIDO'}
                        </span>
                    )}
                </div>

                {/* Área do QR Code */}
                <div className="relative w-64 h-64 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-500 text-sm px-4">
                            <p className="font-bold mb-2">Erro</p>
                            {error}
                            <button onClick={loadToken} className="mt-4 text-xs underline">Tentar novamente</button>
                        </div>
                    )}

                    {!loading && !error && token && !isExpired && (
                        <QRCode
                            value={token}
                            size={220}
                            viewBox={`0 0 256 256`}
                            fgColor="#1e293b" // slate-800
                        />
                    )}

                    {isExpired && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-20 text-center">
                            <p className="text-slate-400 font-bold mb-2">Token Expirado</p>
                            <button
                                onClick={loadToken}
                                className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
                            >
                                Gerar Novo
                            </button>
                        </div>
                    )}
                </div>

                {/* Timer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm mb-1">Este código expira em</p>
                    <p className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            {/* Instrução */}
            <p className="mt-8 text-center text-slate-400 text-sm max-w-xs mx-auto">
                Apresente este QR Code ao parceiro para validar seu benefício ou entrada.
            </p>
        </div>
    )
}

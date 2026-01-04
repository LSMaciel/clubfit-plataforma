
'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

interface VoucherModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  expiresAt: string
  title: string
  primaryColor: string
  onRegenerate?: () => void
}

export function VoucherModal({ isOpen, onClose, token, expiresAt, title, primaryColor, onRegenerate }: VoucherModalProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  // Lógica do Timer
  useEffect(() => {
    if (!isOpen || !expiresAt) return

    // Reset expire state when expiresAt changes
    setIsExpired(false)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(expiresAt).getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(interval)
        if (onRegenerate) {
          onRegenerate() // Auto-refresh
        } else {
          setIsExpired(true)
          setTimeLeft('00:00')
        }
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, expiresAt, onRegenerate])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">

        {/* Header */}
        <div
          className="p-6 text-center text-white relative"
          style={{ backgroundColor: primaryColor }}
        >
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-xs opacity-90 mt-1">Apresente este código ao parceiro</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        {/* Corpo */}
        <div className="p-8 flex flex-col items-center">

          {isExpired ? (
            <div className="h-64 w-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <span className="text-4xl mb-2">⏳</span>
              <p className="text-slate-500 font-bold">Voucher Expirado</p>
              <p className="text-xs text-slate-400 text-center px-4 mt-1">Feche e gere um novo código se ainda estiver no estabelecimento.</p>
            </div>
          ) : (
            <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
              <QRCode
                value={token}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
          )}

          {/* Token Manual */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Código do Voucher</p>
            <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
              {token.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Timer */}
          {!isExpired && (
            <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-700 font-mono">
                Válido por {timeLeft}
              </span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  )
}

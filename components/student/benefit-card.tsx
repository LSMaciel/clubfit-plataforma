
'use client'

import React, { useState } from 'react'
import { generateToken } from '@/app/[slug]/benefits/generate-action'
import { VoucherModal } from './voucher-modal'

interface BenefitCardProps {
  id: string
  title: string
  rules?: string
  partnerName: string
  partnerAddress?: string
  validityEnd?: string
  primaryColor: string
}

export function BenefitCard({ 
  id,
  title, 
  rules, 
  partnerName, 
  partnerAddress, 
  validityEnd, 
  primaryColor 
}: BenefitCardProps) {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [tokenData, setTokenData] = useState<{ token: string, expiresAt: string } | null>(null)

  async function handleGenerate() {
    setLoading(true)
    const result = await generateToken(id)
    setLoading(false)

    if (result.error) {
        alert(result.error)
        return
    }

    if (result.token && result.expiresAt) {
        setTokenData({ token: result.token, expiresAt: result.expiresAt })
        setModalOpen(true)
    }
  }

  return (
    <>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full active:scale-[0.99] transition-transform duration-100">
        
        {/* Header do Card (Parceiro) */}
        <div className="p-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {partnerName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{partnerName}</h4>
                    {partnerAddress && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{partnerAddress}</p>
                    )}
                </div>
            </div>
        </div>

        {/* Corpo (Oferta) */}
        <div className="px-4 py-2 flex-1">
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-2">
                {title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
                {rules || 'Consulte regras no estabelecimento.'}
            </p>
        </div>

        {/* Footer (Ação) */}
        <div className="p-4 pt-2 mt-auto">
            <div className="flex items-center justify-between mb-3">
                {validityEnd ? (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        Válido até {new Date(validityEnd).toLocaleDateString('pt-BR')}
                    </span>
                ) : (
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded">
                        Validade Indeterminada
                    </span>
                )}
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
            >
                {loading ? (
                    <span className="animate-pulse">Gerando...</span>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2"/>
                            <path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/>
                        </svg>
                        Gerar Voucher
                    </>
                )}
            </button>
        </div>
        </div>

        {/* Modal */}
        {modalOpen && tokenData && (
            <VoucherModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                token={tokenData.token}
                expiresAt={tokenData.expiresAt}
                title={title}
                primaryColor={primaryColor}
            />
        )}
    </>
  )
}

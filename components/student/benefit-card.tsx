'use client'

import React, { useState } from 'react'
import { generateToken } from '@/app/[slug]/benefits/generate-action'
import { VoucherModal } from './voucher-modal'
import { getBenefitBadge, calculateFinalPrice, formatCurrency } from './utils/promotion-visuals'

interface BenefitCardProps {
    id: string
    title: string
    rules?: string
    partnerName: string
    partnerAddress?: string
    validityEnd?: string
    primaryColor: string
    // New props for Smart Cards
    type?: string | null
    main_image_url?: string | null
    cover_image_url?: string | null
    configuration?: any
    constraints?: any
    description?: string
}

import { useBenefitAvailability } from './hooks/use-benefit-availability'

import { BenefitDetailsModal } from './benefit-details-modal'

export function BenefitCard(props: BenefitCardProps) {
    const {
        id,
        title,
        rules,
        partnerName,
        validityEnd,
        primaryColor
    } = props

    const [loading, setLoading] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false) // New state for details
    const [modalOpen, setModalOpen] = useState(false) // Voucher modal
    const [tokenData, setTokenData] = useState<{ token: string, expiresAt: string } | null>(null)

    const badge = getBenefitBadge(props.type || null, props.configuration)
    const price = calculateFinalPrice(props.type || null, props.configuration)

    // Client Side Validation
    const { isAvailable, reason } = useBenefitAvailability(validityEnd, props.constraints)

    async function handleGenerate() {
        if (!isAvailable) return

        setLoading(true)
        const result = await generateToken(id)
        setLoading(false)

        if (result.error) {
            alert(result.error)
            return
        }

        if (result.token && result.expiresAt) {
            setTokenData({ token: result.token, expiresAt: result.expiresAt })
            setDetailsOpen(false) // Close details
            setModalOpen(true) // Open voucher
        }
    }

    // New Handler: Just open the details
    const handleCardClick = () => {
        setDetailsOpen(true)
    }

    const displayImage = props.main_image_url || props.cover_image_url

    return (
        <>
            <div
                onClick={handleCardClick}
                className={`
                    bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full 
                    active:scale-[0.99] transition-all duration-200 hover:shadow-xl relative group cursor-pointer
                    ${!isAvailable ? 'grayscale opacity-75' : ''}
                `}
            >

                {/* Cover Image & Badge */}
                <div className="relative h-36 bg-slate-200 overflow-hidden">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <span className="text-xs font-medium opacity-60">Sem Imagem</span>
                        </div>
                    )}

                    {/* Dynamic Badge */}
                    <div className={`
                absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm 
                uppercase tracking-wide flex items-center gap-1.5 backdrop-blur-sm
                ${isAvailable ? `bg-${badge.color}-600/90` : 'bg-slate-500/90'}
            `}>
                        <badge.icon size={12} strokeWidth={3} />
                        {badge.label}
                    </div>
                </div>

                {/* Corpo (Oferta) */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                {partnerName.substring(0, 2).toUpperCase()}
                            </div>
                        </div>

                        {/* Price Display */}
                        {price && (
                            <div className="text-right">
                                <span className="block text-[10px] text-slate-400 line-through Decoration-slate-300">
                                    {formatCurrency(price.original)}
                                </span>
                                <span className="block text-sm font-extrabold text-green-600">
                                    {formatCurrency(price.final)}
                                </span>
                            </div>
                        )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {rules || 'Consulte regras no estabelecimento.'}
                    </p>

                    {/* Address & Validity */}
                    <div className="mt-auto space-y-2 border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="font-semibold text-slate-600 truncate max-w-[150px]">{partnerName}</span>
                            {props.partnerAddress && (
                                <>
                                    <span>•</span>
                                    <span className="truncate max-w-[120px]">{props.partnerAddress}</span>
                                </>
                            )}
                        </div>

                        {validityEnd && (
                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 text-[10px] text-slate-500 font-medium">
                                ⏰ Válido até {new Date(validityEnd).toLocaleDateString('pt-BR')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer (Ação) */}
                <div className="px-4 pb-4">
                    <button
                        // onClick={handleGenerate} removed to let card click handle it
                        type="button"
                        disabled={loading || !isAvailable}
                        className={`
                    w-full py-3 rounded-xl font-bold text-white shadow-md text-sm 
                    flex items-center justify-center gap-2 
                    disabled:opacity-70 disabled:cursor-not-allowed 
                    transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                    ${!isAvailable ? '!bg-slate-400 !cursor-not-allowed !transform-none' : ''}
                `}
                        style={{ backgroundColor: isAvailable ? (primaryColor || '#4F46E5') : '' }}
                    >
                        {isAvailable ? 'Ver Detalhes' : (reason || 'Indisponível')}
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            <BenefitDetailsModal
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                onGenerate={handleGenerate}
                loading={loading}
                isAvailable={isAvailable}
                reason={reason}
                {...props}
            />

            {/* Voucher Modal */}
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

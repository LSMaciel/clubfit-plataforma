'use client'

import React, { useState } from 'react'
import { FavoriteButton } from '@/components/student/favorite-button'
import { BenefitDetailsModal } from '@/components/student/benefit-details-modal'
import { VoucherModal } from '@/components/student/voucher-modal'
import { generateBenefitVoucher } from '../wallet/actions'

interface PromotionCardProps {
    promo: {
        id: string
        title: string
        description: string
        type?: string
        main_image_url?: string | null
        cover_image_url?: string | null
        discountValue?: string
        partner: {
            id: string
            name: string
            logoUrl?: string
        }
    }
    academySlug: string
    isFavorite: boolean
}

export function PromotionCard({ promo, academySlug, isFavorite }: PromotionCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [showVoucher, setShowVoucher] = useState(false)

    // Voucher State
    const [loading, setLoading] = useState(false)
    const [voucherData, setVoucherData] = useState<{ token: string, expiresAt: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleGenerate() {
        setLoading(true)
        setError(null)

        try {
            const result = await generateBenefitVoucher(promo.id)

            if (result.error) {
                setError(result.error)
                return
            }

            if (result.success && result.token) {
                setVoucherData({
                    token: result.token,
                    expiresAt: result.expiresAt
                })
                setShowDetails(false) // Close details
                setShowVoucher(true)  // Open voucher
            }

        } catch (e) {
            setError('Erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    // Image Priority: Main > Cover > Partner Logo
    const displayImage = promo.main_image_url || promo.cover_image_url || promo.partner.logoUrl

    return (
        <>
            <div
                className="relative block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden active:scale-[98%] transition-transform cursor-pointer"
                onClick={() => setShowDetails(true)}
            >
                {/* Favorite Button */}
                <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton
                        itemId={promo.partner.id}
                        itemType="PARTNER"
                        initialIsFavorite={isFavorite}
                    />
                </div>

                <div className="p-4 flex gap-4 relative z-10 pointer-events-none pr-10">
                    {/* Imagem Placeholder */}
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden relative">
                        {displayImage ? (
                            <img src={displayImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span>🏷️</span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Nome do Parceiro */}
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 truncate">
                            {promo.partner.name}
                        </p>

                        {/* Título da Promoção */}
                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                            {promo.title}
                        </h3>

                        {/* Descrição Curta */}
                        <p className="text-sm text-slate-600 line-clamp-1">
                            {promo.description || 'Confira os detalhes desta oferta.'}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">
                                Ver Detalhes
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <BenefitDetailsModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                onGenerate={handleGenerate}
                loading={loading}
                isAvailable={!error}
                reason={error}

                title={promo.title}
                description={promo.description}
                partnerName={promo.partner.name}
                type={promo.type}
                cover_image_url={promo.cover_image_url}
                primaryColor="#4F46E5" // Could be dynamic
                configuration={{ discount_value: promo.discountValue }}
            />

            {voucherData && (
                <VoucherModal
                    isOpen={showVoucher}
                    onClose={() => setShowVoucher(false)}
                    token={voucherData.token}
                    expiresAt={voucherData.expiresAt}
                    title={promo.title}
                    primaryColor="#4F46E5"
                    onRegenerate={handleGenerate}
                />
            )}
        </>
    )
}

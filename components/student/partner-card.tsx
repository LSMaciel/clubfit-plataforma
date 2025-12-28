'use client'

import Link from 'next/link'
import { FavoriteButton } from './favorite-button'
import { calculateDistance, formatDistance } from '@/utils/geolocation'

interface PartnerCardProps {
    partner: {
        id: string
        name: string
        description: string | null
        address: string | null
        mainBenefit: string
        logoUrl?: string | null
        lat?: number | null // DB field might be null or undefined
        lng?: number | null
    }
    academySlug: string
    isFavorite?: boolean
    userLocation?: { lat: number, lng: number } | null
}

export function PartnerCard({ partner, academySlug, isFavorite = false, userLocation }: PartnerCardProps) {
    // Calcular Distância se tivermos localização do user e do parceiro
    let distanceLabel = null
    if (userLocation && partner.lat && partner.lng) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, partner.lat, partner.lng)
        distanceLabel = formatDistance(dist)
    }
    // Gerar link do Google Maps
    const mapsLink = partner.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.address)}`
        : '#'

    // Link para ofertas (Redireciona para página do parceiro no App do Aluno)
    // Antes estava apontando para /benefits (rota pública inexistente ou errada)
    const offersLink = `/student/${academySlug}/partner/${partner.id}`

    return (
        <div
            className="bg-[var(--color-surface)] p-5 shadow-sm flex flex-col gap-3 transition-colors hover:shadow-md group relative"
            style={{ borderRadius: 'var(--border-radius)' }}
        >

            {/* Clickable Area Overlay */}
            <Link href={offersLink} className="absolute inset-0 z-0" aria-label={`Ver ofertas de ${partner.name}`} />

            {/* Favorite Button (Z-Index high to be clickable over the Link) */}
            <div className="absolute top-4 right-4 z-20">
                <FavoriteButton
                    itemId={partner.id}
                    itemType="PARTNER"
                    initialIsFavorite={isFavorite}
                />
            </div>

            <div className="flex items-start justify-between relative z-10 pointer-events-none pr-10">
                <div className="flex items-center gap-3">
                    {/* Logo Image or Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[var(--primary-color)]/10 group-hover:text-[var(--primary-color)] transition-colors overflow-hidden border border-slate-100">
                        {partner.logoUrl ? (
                            <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75Z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-900 group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">{partner.name}</h3>
                            {distanceLabel && (
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded ml-2">
                                    📍 {distanceLabel}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{partner.description || 'Parceiro ClubFit'}</p>
                    </div>
                </div>
            </div>

            {/* Benefit Badge */}
            <div className="bg-[var(--primary-color)]/5 border border-[var(--primary-color)]/10 rounded-lg p-3 relative z-10 pointer-events-none">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Benefício</p>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[var(--primary-color)] text-sm">{partner.mainBenefit}</p>
                    <span className="text-xs text-[var(--primary-color)] font-medium">Ver ➜</span>
                </div>
            </div>

            {/* Actions */}
            <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors relative z-20 ${!partner.address ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Como Chegar
            </a>
        </div>
    )
}

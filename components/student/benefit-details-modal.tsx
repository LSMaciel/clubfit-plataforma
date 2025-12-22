'use client'

import React, { useRef, useEffect } from 'react'
import { getBenefitBadge, calculateFinalPrice, formatCurrency } from './utils/promotion-visuals'

interface BenefitDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    onGenerate: () => void
    isAvailable: boolean
    reason: string | null
    loading: boolean

    // Data
    title: string
    description?: string
    rules?: string
    partnerName: string
    validityEnd?: string
    primaryColor: string

    type?: string | null
    cover_image_url?: string | null
    configuration?: any
}

export function BenefitDetailsModal(props: BenefitDetailsModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (props.isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => { document.body.style.overflow = 'auto' }
    }, [props.isOpen])

    if (!props.isOpen) return null

    const badge = getBenefitBadge(props.type || null, props.configuration)
    const price = calculateFinalPrice(props.type || null, props.configuration)

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={props.onClose}
            />

            {/* Modal Content - Drawer on Mobile, Center Modal on Desktop */}
            <div
                ref={dialogRef}
                className="
                    relative w-full max-w-md bg-white 
                    rounded-t-3xl sm:rounded-2xl 
                    shadow-2xl flex flex-col max-h-[90vh] 
                    animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300
                "
            >
                {/* Close Handle (Mobile) */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* Close Button (Desktop/Hybrid) */}
                <button
                    onClick={props.onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                {/* Cover Image */}
                <div className="relative h-48 sm:h-56 bg-slate-200 shrink-0">
                    {props.cover_image_url ? (
                        <img
                            src={props.cover_image_url}
                            alt={props.title}
                            className="w-full h-full object-cover rounded-t-3xl sm:rounded-t-2xl"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-t-3xl sm:rounded-t-2xl">
                            <span className="text-sm font-medium opacity-60">Sem Imagem</span>
                        </div>
                    )}

                    {/* Badge Overlay */}
                    <div className={`
                        absolute bottom-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg 
                        uppercase tracking-wide flex items-center gap-2 backdrop-blur-md
                        bg-${badge.color}-600/90
                    `}>
                        <badge.icon size={14} strokeWidth={3} />
                        {badge.label}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{props.partnerName}</h4>
                            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{props.title}</h2>
                        </div>
                        {/* Price Display Large */}
                        {price && (
                            <div className="text-right">
                                <span className="block text-xs text-slate-400 line-through Decoration-slate-300">
                                    {formatCurrency(price.original)}
                                </span>
                                <span className="block text-xl font-black text-green-600">
                                    {formatCurrency(price.final)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {props.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-2">Sobre a oferta</h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {props.description}
                            </p>
                        </div>
                    )}

                    {/* Rules */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                            Regras de Utilização
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-wrap">
                            {props.rules || 'Consulte regras no estabelecimento.'}
                        </p>

                        {props.validityEnd && (
                            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-orange-600 font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                Válido até {new Date(props.validityEnd).toLocaleDateString('pt-BR')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-2xl">
                    <button
                        onClick={props.onGenerate}
                        disabled={props.loading || !props.isAvailable}
                        className={`
                            w-full py-3.5 rounded-xl font-bold text-white shadow-lg text-base 
                            flex items-center justify-center gap-2 
                            disabled:opacity-70 disabled:cursor-not-allowed 
                            transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                            ${!props.isAvailable ? '!bg-slate-400 !cursor-not-allowed !transform-none' : ''}
                        `}
                        style={{ backgroundColor: props.isAvailable ? (props.primaryColor || '#4F46E5') : '' }}
                    >
                        {props.loading ? (
                            <span className="animate-pulse">Gerando Voucher...</span>
                        ) : (
                            <>
                                {props.isAvailable ? 'Resgatar Oferta Agora' : (props.reason || 'Indisponível')}
                            </>
                        )}
                    </button>
                    {/* Helper text */}
                    {props.isAvailable && (
                        <p className="text-center text-[10px] text-slate-400 mt-2">
                            Ao resgatar, você concorda com os termos de uso.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

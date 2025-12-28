import Link from 'next/link'
import { FavoriteButton } from '@/components/student/favorite-button'

interface Promotion {
    id: string
    title: string
    description: string
    discountValue?: string
    partner: {
        id: string
        name: string
        address: string
        lat?: number
        lng?: number
    }
}

export function PromotionsFeed({ promotions, academySlug, favoriteIds = [] }: { promotions: Promotion[], academySlug: string, favoriteIds?: string[] }) {
    if (promotions.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <p>Nenhuma promoção encontrada nesta categoria.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {promotions.map((promo) => {
                const isFavorite = favoriteIds.includes(promo.partner.id)

                return (
                    <div
                        key={promo.id}
                        className="relative block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden active:scale-[98%] transition-transform"
                    >
                        {/* Link Wrapper (Absolute to allow Button click) */}
                        <Link
                            href={`/student/${academySlug}/partner/${promo.partner.id}`}
                            className="absolute inset-0 z-0"
                            aria-label={`Ver oferta de ${promo.partner.name}`}
                        />

                        {/* Favorite Button */}
                        <div className="absolute top-4 right-4 z-20">
                            <FavoriteButton
                                itemId={promo.partner.id}
                                itemType="PARTNER"
                                initialIsFavorite={isFavorite}
                            />
                        </div>

                        <div className="p-4 flex gap-4 relative z-10 pointer-events-none pr-10">
                            {/* Imagem Placeholder (ou Logo real se tiver) */}
                            <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                                🏷️
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Nome do Parceiro */}
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 truncate">
                                    {promo.partner.name}
                                </p>

                                {/* Título da Promoção com Destaque */}
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                                    {promo.title}
                                </h3>

                                {/* Descrição Curta */}
                                <p className="text-sm text-slate-600 line-clamp-1">
                                    {promo.description || 'Confira os detalhes desta oferta exclusivo.'}
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">
                                        Disponível Agora
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

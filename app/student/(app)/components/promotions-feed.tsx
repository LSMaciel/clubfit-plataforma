import Link from 'next/link'
import { FavoriteButton } from '@/components/student/favorite-button'
import { PromotionCard } from './promotion-card'

interface Promotion {
    id: string
    title: string
    description: string
    main_image_url?: string | null
    cover_image_url?: string | null
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
                    <PromotionCard
                        key={promo.id}
                        promo={promo}
                        academySlug={academySlug}
                        isFavorite={isFavorite}
                    />
                )
            })}
        </div>
    )
}

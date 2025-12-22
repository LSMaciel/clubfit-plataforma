
import { Percent, DollarSign, Gift, Package, Bike } from 'lucide-react'

// Same types from admin side, duplicated for decoupling or could be shared if we move to a shared folder
export enum PromotionType {
    DISCOUNT_PERCENTAGE = 'DISCOUNT_PERCENTAGE',
    DISCOUNT_FIXED = 'DISCOUNT_FIXED',
    DEAL_BOGO = 'DEAL_BOGO',
    FREE_SHIPPING = 'FREE_SHIPPING',
    GIFT = 'GIFT'
}

interface BadgeConfig {
    label: string
    color: string // Tailwind color class backbone (e.g. 'red', 'blue')
    icon: any
}

export function getBenefitBadge(type: string | null, config: any): BadgeConfig {
    switch (type) {
        case PromotionType.DISCOUNT_PERCENTAGE:
            return {
                label: `${config?.value || 0}% OFF`,
                color: 'red',
                icon: Percent
            }
        case PromotionType.DISCOUNT_FIXED:
            return {
                label: `R$ ${config?.value || 0} OFF`,
                color: 'green',
                icon: DollarSign
            }
        case PromotionType.DEAL_BOGO:
            return {
                label: `LEVE ${config?.get_qty || 1} PAGUE ${config?.buy_qty || 1}`,
                color: 'purple',
                icon: Package
            }
        case PromotionType.FREE_SHIPPING:
            return {
                label: 'FRETE GRÁTIS',
                color: 'blue',
                icon: Bike
            }
        case PromotionType.GIFT:
            return {
                label: 'BRINDE GRÁTIS',
                color: 'pink',
                icon: Gift
            }
        default:
            return {
                label: 'PROMOÇÃO',
                color: 'slate',
                icon: DollarSign
            }
    }
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function calculateFinalPrice(type: string | null, config: any): { original: number, final: number } | null {
    if (!config || !config.original_price) return null

    const original = Number(config.original_price)
    let final = original

    if (type === PromotionType.DISCOUNT_PERCENTAGE && config.value) {
        final = original - (original * (Number(config.value) / 100))
    } else if (type === PromotionType.DISCOUNT_FIXED && config.value) {
        final = Math.max(0, original - Number(config.value))
    } else {
        return null // Other types don't change price directly or we don't show "DE/POR"
    }

    return { original, final }
}

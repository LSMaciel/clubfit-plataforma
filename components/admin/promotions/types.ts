export enum PromotionType {
    STANDARD = 'STANDARD',
    DISCOUNT_PERCENTAGE = 'DISCOUNT_PERCENTAGE',
    DISCOUNT_FIXED = 'DISCOUNT_FIXED',
    DEAL_BOGO = 'DEAL_BOGO',
    GIFT = 'GIFT',
    FREE_SHIPPING = 'FREE_SHIPPING'
}

export interface PromotionDraft {
    type: PromotionType | null
    title: string
    description?: string
    cover_image_url?: string
    // We will type these more strictly in future steps
    configuration: Record<string, any>
    constraints: Record<string, any>
}

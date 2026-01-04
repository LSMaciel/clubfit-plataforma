import { z } from 'zod'
import { PromotionType } from './types'

// --- Base Config Schemas ---

const percentConfig = z.object({
    value: z.coerce.number().min(1, 'Mínimo 1%').max(100, 'Máximo 100%'),
    original_price: z.coerce.number().min(0.01, 'Informe o valor original do produto'),
    mode: z.literal('PERCENT').default('PERCENT')
})

const fixedConfig = z.object({
    value: z.coerce.number().min(0.01, 'Valor inválido'),
    original_price: z.coerce.number().min(0.01, 'Informe o valor original do produto').optional(), // Optional for fixed? Maybe mandatory for context. Let's make it mandatory for consistency if user wants to show "DE/POR"
    mode: z.literal('FIXED').default('FIXED')
})

const bogoConfig = z.object({
    buy_qty: z.coerce.number().min(1, 'Mínimo 1'),
    get_qty: z.coerce.number().min(1, 'Mínimo 1')
})

const freeShippingConfig = z.object({}) // No config needed

const giftConfig = z.object({
    gift_name: z.string().min(3, 'Descreva o brinde (ex: Coca-Cola 2L)')
})


// --- Main Form Schema ---

export const baseFormSchema = z.object({
    title: z.string().min(5, 'O título deve ter pelo menos 5 letras').max(60, 'Máximo 60 caracteres'),
    description: z.string().max(200, 'Máximo 200 caracteres').optional(),
    main_image_url: z.string().optional(),
    cover_image_url: z.string().optional(),

    // Constraints
    min_spend: z.coerce.number().optional(),
    channel: z.enum(['BOTH', 'DELIVERY', 'STORE']).default('BOTH')
})

// We create a discriminated union based on the Active Type
// Logic: The form will validate "config" differently depending on "type"
export const getValidationSchema = (type: PromotionType) => {
    let configSchema: z.ZodTypeAny = z.object({})

    switch (type) {
        case PromotionType.DISCOUNT_PERCENTAGE: configSchema = percentConfig; break;
        case PromotionType.DISCOUNT_FIXED: configSchema = fixedConfig; break;
        case PromotionType.DEAL_BOGO: configSchema = bogoConfig; break;
        case PromotionType.FREE_SHIPPING: configSchema = freeShippingConfig; break;
        case PromotionType.GIFT: configSchema = giftConfig; break;
    }

    return baseFormSchema.extend({
        config: configSchema
    })
}

export type DiscountFormValues = z.infer<ReturnType<typeof getValidationSchema>>

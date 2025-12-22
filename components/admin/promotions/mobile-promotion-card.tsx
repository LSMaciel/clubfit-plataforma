import { PromotionDraft, PromotionType } from './types'
import { Clock, MapPin } from 'lucide-react'

interface MobilePromotionCardProps {
    data: PromotionDraft
}

export function MobilePromotionCard({ data }: MobilePromotionCardProps) {

    // Helper to format currency
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

    // Helper to display discount badge logic
    const renderBadge = () => {
        if (!data.configuration) return null

        switch (data.type) {
            case PromotionType.DISCOUNT_PERCENTAGE:
                return data.configuration.value ? `${data.configuration.value}% OFF` : null
            case PromotionType.DISCOUNT_FIXED:
                return data.configuration.value ? `-${formatCurrency(data.configuration.value)}` : null
            case PromotionType.DEAL_BOGO:
                return 'LEVE+ PAGUE-'
            case PromotionType.GIFT:
                return 'BRINDE GRÁTIS'
            default:
                return 'OFERTA'
        }
    }

    // Helper for Price Display
    const renderPrice = () => {
        const original = data.configuration?.original_price
        const value = data.configuration?.value

        if (!original) return null

        let final = original
        if (data.type === PromotionType.DISCOUNT_PERCENTAGE && value) {
            final = original - (original * (value / 100))
        } else if (data.type === PromotionType.DISCOUNT_FIXED && value) {
            final = Math.max(0, original - value)
        }

        return (
            <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 line-through">{formatCurrency(original)}</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(final)}</span>
            </div>
        )
    }

    return (
        <div className="w-[300px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 font-sans mx-auto transform scale-100 md:scale-110 origin-top">
            {/* Header / StatusBar Fake */}
            <div className="bg-slate-900 h-6 w-full flex items-center justify-between px-4">
                <div className="text-[10px] text-white font-medium">9:41</div>
                <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-white opacity-20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white opacity-20"></div>
                    <div className="w-4 h-2.5 rounded-sm bg-white opacity-80"></div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="relative h-40 bg-slate-200">
                {data.cover_image_url ? (
                    <img src={data.cover_image_url} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Sem Imagem
                    </div>
                )}

                {/* Badge Overlay */}
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
                    {renderBadge() || 'Promoção'}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{data.title || 'Título da Promoção'}</h3>
                    {renderPrice()}
                </div>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2 min-h-[2.5em]">
                    {data.description || 'Descrição curta da oferta para atrair o cliente...'}
                </p>

                {/* Footer Meta */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Válido por 30 dias</span>
                    </div>
                    {data.constraints?.channel && (
                        <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                            <MapPin size={10} />
                            <span>
                                {data.constraints.channel === 'DELIVERY' && 'Só Delivery'}
                                {data.constraints.channel === 'STORE' && 'Só Loja'}
                                {data.constraints.channel === 'BOTH' && 'Loja & Delivery'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Fake Button */}
            <div className="p-3 bg-slate-50 border-t border-slate-100">
                <div className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-lg text-center opacity-90">
                    Resgatar Oferta
                </div>
            </div>
        </div>
    )
}

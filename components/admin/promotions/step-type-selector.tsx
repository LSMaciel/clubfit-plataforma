import { PromotionType } from './types'
import { Percent, DollarSign, Gift, Truck, Copy, Tag } from 'lucide-react'

interface StepTypeSelectorProps {
    selectedType: PromotionType | null
    onSelect: (type: PromotionType) => void
}

export function StepTypeSelector({ selectedType, onSelect }: StepTypeSelectorProps) {

    const options = [
        {
            type: PromotionType.DISCOUNT_PERCENTAGE,
            title: '% de Desconto',
            description: 'Redução percentual no valor (ex: 15% OFF)',
            icon: Percent,
            color: 'bg-blue-50 text-blue-600 border-blue-200'
        },
        {
            type: PromotionType.DISCOUNT_FIXED,
            title: 'Valor Fixo (R$)',
            description: 'Desconto em dinheiro (ex: R$ 10,00)',
            icon: DollarSign,
            color: 'bg-green-50 text-green-600 border-green-200'
        },
        {
            type: PromotionType.DEAL_BOGO,
            title: 'Leve + Pague -',
            description: 'Compre 1 Leve 2, ou compre 3 pague 2.',
            icon: Copy, // Or Layers
            color: 'bg-purple-50 text-purple-600 border-purple-200'
        },
        {
            type: PromotionType.FREE_SHIPPING,
            title: 'Entrega Grátis',
            description: 'Isenção de taxa para Delivery.',
            icon: Truck,
            color: 'bg-orange-50 text-orange-600 border-orange-200'
        },
        {
            type: PromotionType.GIFT,
            title: 'Brinde Grátis',
            description: 'Ganhe um item na compra de outro.',
            icon: Gift,
            color: 'bg-pink-50 text-pink-600 border-pink-200'
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">Qual o tipo da promoção?</h2>
                <p className="text-slate-500 text-sm mt-1">Escolha a estratégia que melhor se adapta ao seu objetivo agora.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => {
                    const Icon = option.icon
                    const isSelected = selectedType === option.type

                    return (
                        <button
                            key={option.type}
                            onClick={() => onSelect(option.type)}
                            className={`
                                relative p-6 rounded-xl border-2 text-left transition-all duration-200 group
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]'
                                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors
                                ${isSelected ? 'bg-indigo-600 text-white' : option.color}
                            `}>
                                <Icon size={24} />
                            </div>

                            <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {option.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                                {option.description}
                            </p>

                            {isSelected && (
                                <div className="absolute top-4 right-4 text-indigo-600">
                                    <div className="bg-indigo-600 text-white rounded-full p-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

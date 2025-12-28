
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PromotionType } from './types'
import { getValidationSchema } from './schemas'
import { ImageUploader } from '@/components/ui/image-uploader'
import { Store, Truck, Store as StoreIcon, Layers } from 'lucide-react'

interface StepConfigurationProps {
    type: PromotionType
    initialData: any
    onHtmlSubmit: (data: any) => void
    onCancel: () => void
}

export function StepConfiguration({ type, initialData, onHtmlSubmit, onCancel }: StepConfigurationProps) {

    const schema = getValidationSchema(type)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            cover_image_url: initialData.cover_image_url || '',
            min_spend: initialData.constraints?.min_spend || '',
            channel: initialData.constraints?.channel || 'BOTH',
            config: initialData.configuration || {}
        }
    })

    const coverImage = watch('cover_image_url')
    // Safe casting for dynamic union paths
    const configValue = Number(watch('config.value' as any) || 0)
    const originalPrice = Number(watch('config.original_price' as any) || 0)

    // Price Calculation Logic
    const finalPrice = (() => {
        if (!originalPrice) return null
        if (type === PromotionType.DISCOUNT_PERCENTAGE && configValue) {
            return originalPrice - (originalPrice * (configValue / 100))
        }
        if (type === PromotionType.DISCOUNT_FIXED && configValue) {
            return Math.max(0, originalPrice - configValue)
        }
        return null
    })()

    const onSubmit = (data: any) => {
        const formattedData = {
            title: data.title,
            description: data.description,
            cover_image_url: data.cover_image_url,
            configuration: data.config,
            constraints: {
                ...(data.min_spend ? { min_spend: Number(data.min_spend) } : {}),
                channel: data.channel
            }
        }
        onHtmlSubmit(formattedData)
    }

    const renderConfigFields = () => {
        const configErrors = errors.config as any

        switch (type) {
            case PromotionType.DISCOUNT_PERCENTAGE:
                return (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-blue-900 mb-1">Preço Original (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    {...register('config.original_price' as any)}
                                    className="w-full p-2 rounded border border-blue-200 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                                {configErrors?.original_price && <p className="text-red-500 text-xs mt-1">{String(configErrors.original_price.message)}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-blue-900 mb-1">Desconto (%)</label>
                                <input
                                    type="number"
                                    {...register('config.value' as any)}
                                    className="w-full p-2 rounded border border-blue-200 focus:ring-blue-500"
                                    placeholder="Ex: 20"
                                />
                                {configErrors?.value && <p className="text-red-500 text-xs mt-1">{String(configErrors.value.message)}</p>}
                            </div>
                        </div>

                        {finalPrice !== null && (
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                                <span className="text-sm text-blue-700">Preço Final para o Cliente:</span>
                                <span className="text-lg font-bold text-blue-700">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPrice)}
                                </span>
                            </div>
                        )}
                    </div>
                )
            case PromotionType.DISCOUNT_FIXED:
                return (
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-green-900 mb-1">Preço Original (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    {...register('config.original_price' as any)}
                                    className="w-full p-2 rounded border border-green-200 focus:ring-green-500"
                                    placeholder="0.00"
                                />
                                {configErrors?.original_price && <p className="text-red-500 text-xs mt-1">{String(configErrors.original_price.message)}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-green-900 mb-1">Valor do Desconto (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    {...register('config.value' as any)}
                                    className="w-full p-2 rounded border border-green-200 focus:ring-green-500"
                                    placeholder="10.00"
                                />
                                {configErrors?.value && <p className="text-red-500 text-xs mt-1">{String(configErrors.value.message)}</p>}
                            </div>
                        </div>
                        {finalPrice !== null && (
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-100">
                                <span className="text-sm text-green-700">Preço Final para o Cliente:</span>
                                <span className="text-lg font-bold text-green-700">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPrice)}
                                </span>
                            </div>
                        )}
                    </div>
                )
            case PromotionType.DEAL_BOGO:
                return (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-purple-900 mb-1">Compre (Qtd)</label>
                            <input type="number" {...register('config.buy_qty' as any)} className="w-full p-2 rounded border border-purple-200" placeholder="1" />
                            {configErrors?.buy_qty && <p className="text-red-500 text-xs mt-1">{String(configErrors.buy_qty.message)}</p>}
                        </div>
                        <div className="flex items-center pt-6 text-purple-400 font-bold">LEVE</div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-purple-900 mb-1">Ganhe (Qtd)</label>
                            <input type="number" {...register('config.get_qty' as any)} className="w-full p-2 rounded border border-purple-200" placeholder="1" />
                            {configErrors?.get_qty && <p className="text-red-500 text-xs mt-1">{String(configErrors.get_qty.message)}</p>}
                        </div>
                    </div>
                )
            case PromotionType.GIFT:
                return (
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                        <label className="block text-sm font-bold text-pink-900 mb-1">Nome do Brinde</label>
                        <input
                            type="text"
                            {...register('config.gift_name' as any)}
                            className="w-full p-2 rounded border border-pink-200 focus:ring-pink-500"
                            placeholder="Ex: Garrafinha Exclusiva"
                        />
                        {configErrors?.gift_name && <p className="text-red-500 text-xs mt-1">{String(configErrors.gift_name.message)}</p>}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in slide-in-from-right-8 duration-500">

            <div className="space-y-4">
                <input type="hidden" {...register('cover_image_url')} />
                <ImageUploader
                    value={coverImage}
                    onChange={(url) => setValue('cover_image_url', url)}
                />

                <h2 className="text-xl font-bold text-slate-900">Configuração da Oferta</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título da Promoção</label>
                        <input
                            {...register('title')}
                            className="w-full p-2 rounded border border-slate-300"
                            placeholder="Ex: Happy Hour Especial"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Curta (Opcional)</label>
                        <textarea
                            {...register('description')}
                            rows={2}
                            className="w-full p-2 rounded border border-slate-300"
                            placeholder="Regras adicionais para o cliente ver..."
                        />
                    </div>
                </div>

                {renderConfigFields()}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Regras de Validação</h3>

                <div className="grid grid-cols-1 gap-6">

                    {/* Channel Selector - Radio Group */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Canal de Venda</label>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="cursor-pointer relative">
                                <input type="radio" value="BOTH" {...register('channel')} className="peer sr-only" />
                                <div className="p-3 border rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 text-center transition-all">
                                    <Layers className="mx-auto mb-1" size={20} />
                                    <span className="text-xs font-medium">Todos</span>
                                </div>
                            </label>
                            <label className="cursor-pointer relative">
                                <input type="radio" value="DELIVERY" {...register('channel')} className="peer sr-only" />
                                <div className="p-3 border rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 text-center transition-all">
                                    <Truck className="mx-auto mb-1" size={20} />
                                    <span className="text-xs font-medium">Delivery</span>
                                </div>
                            </label>
                            <label className="cursor-pointer relative">
                                <input type="radio" value="STORE" {...register('channel')} className="peer sr-only" />
                                <div className="p-3 border rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 text-center transition-all">
                                    <StoreIcon className="mx-auto mb-1" size={20} />
                                    <span className="text-xs font-medium">Loja Física</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Valor Mínimo do Pedido (R$)</label>
                        <input
                            type="number"
                            {...register('min_spend')}
                            className="w-full md:w-1/3 p-2 rounded border border-slate-300"
                            placeholder="0,00"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-500 hover:text-slate-800">Voltar</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md">
                    Revisar Promoção →
                </button>
            </div>

        </form>
    )
}

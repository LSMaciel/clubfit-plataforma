import { PromotionDraft } from './types'
import { MobilePromotionCard } from './mobile-promotion-card'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

interface StepPreviewProps {
    draft: PromotionDraft
    isSubmitting: boolean
    onPublish: () => void
    onBack: () => void
}

export function StepPreview({ draft, isSubmitting, onPublish, onBack }: StepPreviewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">É assim que o aluno vai ver</h2>
                <p className="text-slate-500">Confira se está tudo certo antes de publicar.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start justify-center">

                {/* Visual Preview */}
                <div className="flex-1 w-full flex justify-center bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <MobilePromotionCard data={draft} />
                </div>

                {/* Data Summary & Actions */}
                <div className="flex-1 space-y-6 w-full max-w-md">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Resumo da Configuração</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tipo</span>
                                <span className="font-medium text-slate-900">{draft.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Canal</span>
                                <span className="font-medium text-slate-900">
                                    {!draft.constraints?.channel || draft.constraints?.channel === 'BOTH' ? 'Todos' : draft.constraints?.channel}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Título</span>
                                <span className="font-medium text-slate-900 text-right truncate max-w-[200px]">{draft.title}</span>
                            </div>
                        </div>

                        {!draft.cover_image_url && (
                            <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2">
                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                <span>Você não enviou uma imagem de capa. O card ficará com a cor padrão.</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={onPublish}
                            disabled={isSubmitting}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all
                                ${isSubmitting
                                    ? 'bg-slate-100 text-slate-400 cursor-wait'
                                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200 hover:-translate-y-1'
                                }
                            `}
                        >
                            {isSubmitting ? 'Publicando...' : 'Publicar Agora'}
                            {!isSubmitting && <CheckCircle size={20} />}
                        </button>

                        <button
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="w-full py-3 text-slate-500 hover:text-slate-800 font-medium text-sm"
                        >
                            Voltar e Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

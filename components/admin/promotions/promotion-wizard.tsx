'use client'

import { useState, useTransition } from 'react'
import { PromotionDraft, PromotionType } from './types'
import { StepTypeSelector } from './step-type-selector'
import { StepConfiguration } from './step-configuration'
import { StepPreview } from './step-preview'
import { createBenefit, updateBenefit } from '@/app/admin/benefits/actions'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PromotionWizardProps {
    initialData?: PromotionDraft
    benefitId?: string
}

export function PromotionWizard({ initialData, benefitId }: PromotionWizardProps) {
    // If editing, start at step 2 (Config), otherwise Step 1 (Type)
    const [step, setStep] = useState(initialData ? 2 : 1)
    const [isPending, startTransition] = useTransition()
    const [draft, setDraft] = useState<PromotionDraft>(initialData || {
        type: null,
        title: '',
        configuration: {},
        constraints: {}
    })

    const handleTypeSelect = (type: PromotionType) => {
        setDraft(prev => ({ ...prev, type }))
    }

    const handleNext = () => {
        if (step === 1 && draft.type) {
            setStep(2)
        }
    }

    const handleConfigSubmit = (data: any) => {
        setDraft(prev => ({
            ...prev,
            title: data.title,
            description: data.description,
            main_image_url: data.main_image_url,
            cover_image_url: data.cover_image_url,
            configuration: data.configuration,
            constraints: data.constraints
        }))
        setStep(3) // Move to Preview
    }

    const handlePublish = () => {
        startTransition(async () => {
            let result;
            if (benefitId) {
                // Edit Mode
                result = await updateBenefit(benefitId, draft)
            } else {
                // Create Mode
                result = await createBenefit(draft)
            }

            if (result?.error) {
                alert(result.error)
            } else {
                // Redirect happens on server
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Wizard Header / Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
                    <span className={step >= 1 ? 'text-indigo-600' : ''}>1. Tipo</span>
                    <span className={step >= 2 ? 'text-indigo-600' : ''}>2. Configuração</span>
                    <span className={step >= 3 ? 'text-indigo-600' : ''}>3. Revisão</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                {step === 1 && (
                    <StepTypeSelector
                        selectedType={draft.type}
                        onSelect={handleTypeSelect}
                    />
                )}

                {step === 2 && draft.type && (
                    <StepConfiguration
                        type={draft.type}
                        initialData={draft}
                        onHtmlSubmit={handleConfigSubmit}
                        onCancel={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <StepPreview
                        draft={draft}
                        isSubmitting={isPending}
                        onPublish={handlePublish}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>

            {/* Footer Actions - Only for Step 1 */}
            {step === 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <Link
                        href="/admin/benefits"
                        className="px-6 py-3 text-slate-500 font-medium hover:text-slate-900 transition-colors"
                    >
                        Cancelar
                    </Link>

                    <button
                        onClick={handleNext}
                        disabled={step === 1 && !draft.type}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all
                            ${step === 1 && !draft.type
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1'
                            }
                        `}
                    >
                        Continuar
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}

'use client'

import { PromotionWizard } from '@/components/admin/promotions/promotion-wizard'

export default function NewBenefitPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <h1 className="font-bold text-xl text-slate-900">Nova Promoção</h1>
                </div>
            </nav>

            <main className="flex-1 p-8">
                <PromotionWizard />
            </main>
        </div>
    )
}
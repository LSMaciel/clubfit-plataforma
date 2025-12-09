import { createClient } from '@/utils/supabase/server'
import { BenefitCard } from '@/components/student/benefit-card'
import React from 'react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BenefitsPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Resolver ID da Academia
  const { data: academy } = await supabase
    .from('academies')
    .select('id, primary_color')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!academy) return <div>Academia não encontrada</div>

  // 2. Buscar Benefícios Ativos + Parceiro
  const { data: benefits } = await supabase
    .from('benefits')
    .select(`
        *,
        partners (
            name,
            address
        )
    `)
    .eq('academy_id', academy.id)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Benefícios</h1>
        <p className="text-sm text-slate-500">Explore as ofertas exclusivas para você.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {benefits?.map((benefit: any) => (
          <React.Fragment key={benefit.id}>
            <BenefitCard
              id={benefit.id}
              title={benefit.title}
              rules={benefit.rules}
              partnerName={benefit.partners?.name || 'Parceiro'}
              partnerAddress={benefit.partners?.address}
              validityEnd={benefit.validity_end}
              primaryColor={academy.primary_color || '#000000'}
            />
          </React.Fragment>
        ))}

        {benefits?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl grayscale mb-4">
              🎁
            </div>
            <h3 className="text-lg font-bold text-slate-700">Sem ofertas no momento</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
              Estamos negociando novos descontos para você. Volte em breve!
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
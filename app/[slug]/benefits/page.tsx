import { createAdminClient } from '@/utils/supabase/admin'
import { BenefitCard } from '@/components/student/benefit-card'
import React from 'react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BenefitsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const partnerId = typeof resolvedSearchParams.partner_id === 'string' ? resolvedSearchParams.partner_id : undefined

  const supabase = createAdminClient()

  // 1. Resolver ID da Academia
  const { data: academy } = await supabase
    .from('academies')
    .select('id, primary_color')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!academy) return <div>Academia não encontrada</div>

  // 1.1 (Opcional) Buscar nome do parceiro se estiver filtrando
  let filterTitle = 'Benefícios'
  let filterSubtitle = 'Explore as ofertas exclusivas para você.'

  if (partnerId) {
    const { data: partner } = await supabase.from('partners').select('name').eq('id', partnerId).single()
    if (partner) {
      filterTitle = partner.name
      filterSubtitle = 'Ofertas exclusivas deste parceiro.'
    }
  }

  // 2. Buscar Benefícios Ativos + Parceiro
  // FIX: Benefits don't have academy_id directly. We must ensure the partner is linked.

  let validPartnerIds: string[] = []

  if (partnerId) {
    // 2a. Single Partner Mode: Verify Link
    const { data: link } = await supabase
      .from('academy_partners')
      .select('partner_id')
      .eq('academy_id', academy.id)
      .eq('partner_id', partnerId)
      .eq('status', 'ACTIVE')
      .single()

    if (link) validPartnerIds = [partnerId]
  } else {
    // 2b. All Partners Mode: Get all linked
    const { data: links } = await supabase
      .from('academy_partners')
      .select('partner_id')
      .eq('academy_id', academy.id)
      .eq('status', 'ACTIVE')

    if (links) validPartnerIds = links.map(l => l.partner_id)
  }

  // If no valid partners (either not linked or none exist), return empty
  if (validPartnerIds.length === 0) {
    return (
      <div className="space-y-6">
        {/* Reset Header */}
        <Link
          href="/student/partners"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar para Parceiros
        </Link>
        <div className="text-center py-12">Nenhuma oferta disponível no momento.</div>
      </div>
    )
  }

  const { data: benefits } = await supabase
    .from('benefits')
    .select(`
        *,
        partners (
            name,
            address
        )
    `)
    .in('partner_id', validPartnerIds)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  // ... existing imports

  // ... inside component

  return (
    <div className="space-y-6">

      {/* Botão Voltar */}
      <Link
        href="/student/partners"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Voltar para Parceiros
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">{filterTitle}</h1>
        <p className="text-sm text-slate-500">{filterSubtitle}</p>
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
              // Smart Card Props
              type={benefit.type}
              cover_image_url={benefit.cover_image_url}
              configuration={benefit.configuration}
              constraints={benefit.constraints}
              description={benefit.description}
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
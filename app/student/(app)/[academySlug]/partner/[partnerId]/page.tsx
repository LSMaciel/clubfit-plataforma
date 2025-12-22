import { notFound } from 'next/navigation'
import { getPartnerProfile } from '@/app/student/actions'
import { PartnerHeader } from '@/components/student/partner/partner-header'
import { PartnerInfo } from '@/components/student/partner/partner-info'
import { PartnerActions } from '@/components/student/partner/partner-actions'
import { Ticket } from 'lucide-react'

// Page Params
interface PageProps {
    params: {
        academySlug: string
        partnerId: string
    }
}

export default async function PartnerProfilePage({ params }: PageProps) {
    const { academySlug, partnerId } = params

    // PROJ-011: Optimized Single Query (Removes Waterfall)
    const partner = await getPartnerProfile(academySlug, partnerId)

    if (!partner) return notFound()

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header (Capa + Nome) */}
            <PartnerHeader
                name={partner.name}
                logoUrl={partner.logo_url}
                galleryUrls={partner.gallery_urls}
                academySlug={academySlug}
            />

            {/* Actions Grid */}
            <PartnerActions
                whatsapp={partner.whatsapp}
                instagram={partner.instagram}
                phone={partner.phone}
                menuUrl={partner.menu_url}
            />

            {/* Info Section */}
            <PartnerInfo
                description={partner.description}
                address={partner.address}
                amenities={partner.amenities}
            />

            {/* Benefits Section */}
            <div className="px-5 mt-8">
                <div className="flex items-center gap-2 mb-4">
                    <Ticket className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="text-xl font-bold text-slate-900">Ofertas Disponíveis</h2>
                </div>

                <div className="space-y-4">
                    {partner.benefits && partner.benefits.length > 0 ? (
                        partner.benefits.map((benefit: any) => (
                            <div key={benefit.id} className="p-4 border border-[var(--color-border)] rounded-[var(--border-radius)] bg-[var(--color-surface)] shadow-sm">
                                <h4 className="font-bold text-[var(--color-text-primary)]">{benefit.title}</h4>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{benefit.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic">Nenhuma oferta ativa no momento.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

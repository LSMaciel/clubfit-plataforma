import { Suspense } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/admin/page-shell'
import { PartnersListConnections } from '@/components/admin/partners/partners-list'
import { PartnersListSkeleton } from '@/components/admin/partners/partners-list-skeleton'

export default async function PartnersListPage() {
  const PageActions = (
    <div className="flex gap-3">
      <Link href="/admin/partners/explore">
        <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
          🔍 Explorar Rede
        </button>
      </Link>
      <Link href="/admin/partners/new">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
          + Novo Parceiro
        </button>
      </Link>
    </div>
  )

  return (
    <PageShell
      title="Parceiros Comerciais"
      subtitle="Gerencie os estabelecimentos parceiros vinculados à sua academia."
      actions={PageActions}
    >
      <Suspense fallback={<PartnersListSkeleton />}>
        <PartnersListConnections />
      </Suspense>
    </PageShell>
  )
}

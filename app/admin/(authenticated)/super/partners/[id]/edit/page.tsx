import { getPartnerDetails } from '../../actions'
import EditGlobalPartnerPage from './edit-form'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params
    const { partner, allCategories, allTags, error } = await getPartnerDetails(id)

    if (error || !partner) {
        return <div>Erro: {error || 'Partner not found'}</div>
    }

    return (
        <EditGlobalPartnerPage
            partner={partner}
            allCategories={allCategories || []}
            allTags={allTags || []}
        />
    )
}

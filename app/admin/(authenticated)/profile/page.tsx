import { getMyPartnerProfile, getProfileMetadata, updatePartnerProfile } from './actions'
import { ProfileForm } from './profile-form'

export default async function PartnerProfilePage() {
    const partner = await getMyPartnerProfile()
    const metadata = await getProfileMetadata()

    if (!partner) {
        return (
            <div className="p-8 text-center text-slate-500">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Perfil não encontrado.</h1>
                <p>O seu usuário não parece estar vinculado a uma loja ativa.</p>
                <p className="text-xs mt-4 opacity-70">Se você é um Administrador sem loja, ignore esta página.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Meu Negócio 🏪</h1>
                <p className="text-slate-500 mt-1">
                    Mantenha as informações da sua loja atualizadas.
                </p>
            </header>

            <ProfileForm
                partner={partner}
                allCategories={metadata.categories}
                allTags={metadata.tags}
                updateAction={updatePartnerProfile}
            />
        </div>
    )
}

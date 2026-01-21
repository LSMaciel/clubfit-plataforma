'use client'

import { updateGlobalPartner } from '../../actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import { ImageUploader } from '@/components/ui/image-uploader'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useActionState, useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
            {pending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
    )
}

const initialState = {
    message: '',
    error: ''
}

interface EditGlobalPartnerPageProps {
    partner: any
    allCategories: any[]
    allTags: any[]
}

export default function EditGlobalPartnerPage({ partner, allCategories, allTags }: EditGlobalPartnerPageProps) {
    const [state, formAction] = useActionState(updateGlobalPartner, initialState)

    // Initial State for Multi-Selects (Visual Feedback)
    const [selectedCats, setSelectedCats] = useState<string[]>(partner.categoryIds || [])
    const [selectedTags, setSelectedTags] = useState<string[]>(partner.tagIds || [])

    const toggleCat = (id: string) => {
        setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const toggleTag = (id: string) => {
        setSelectedTags(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link href={`/admin/super/partners/${partner.id}`} className="text-slate-400 hover:text-slate-600">← Voltar</Link>
                <h1 className="text-2xl font-bold text-slate-900">Editar Parceiro: {partner.name}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {state?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-8">
                    <input type="hidden" name="id" value={partner.id} />

                    {/* Seção 1: Identidade Visual */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Identidade Visual</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <ImageUploader
                                    label="Logo da Loja"
                                    value={partner.logo_url}
                                    onChange={(url) => {
                                        const input = document.getElementById('input-logo-url') as HTMLInputElement
                                        if (input) input.value = url
                                    }}
                                />
                                <input type="hidden" id="input-logo-url" name="logo_url" defaultValue={partner.logo_url} />
                            </div>
                            <div>
                                <ImageUploader
                                    label="Capa da Loja"
                                    value={partner.cover_url}
                                    onChange={(url) => {
                                        const input = document.getElementById('input-cover-url') as HTMLInputElement
                                        if (input) input.value = url
                                    }}
                                />
                                <input type="hidden" id="input-cover-url" name="cover_url" defaultValue={partner.cover_url} />
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Dados Cadastrais */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Dados do Estabelecimento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Nome Fantasia" name="name" required defaultValue={partner.name} />
                            <FormInput label="CNPJ" name="cnpj" required defaultValue={partner.cnpj} />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={partner.description}
                                className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    {/* Seção 3: Segmento e Diferenciais */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Segmento e Diferenciais</h2>

                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Categoria</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            {allCategories?.map(cat => (
                                <label key={cat.id} className={`
                                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                    ${selectedCats.includes(cat.id) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:border-slate-300'}
                                `}>
                                    <input
                                        type="checkbox"
                                        name="categories"
                                        value={cat.id}
                                        checked={selectedCats.includes(cat.id)}
                                        onChange={() => toggleCat(cat.id)}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium leading-none">{cat.name}</span>
                                </label>
                            ))}
                        </div>

                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Diferenciais</h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags?.map(tag => (
                                <label key={tag.id} className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-xs font-semibold
                                    ${selectedTags.includes(tag.id) ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}
                                `}>
                                    <input
                                        type="checkbox"
                                        name="tags"
                                        value={tag.id}
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={() => toggleTag(tag.id)}
                                        className="sr-only"
                                    />
                                    <span>{selectedTags.includes(tag.id) ? '✓ ' : '+ '}{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Seção 4: Contatos */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">4. Contatos e Redes Sociais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput label="WhatsApp" name="whatsapp" placeholder="5511999999999" defaultValue={partner.whatsapp} />
                            <FormInput label="Instagram" name="instagram" placeholder="@usuario" defaultValue={partner.instagram} />
                            <FormInput label="Website" name="website" placeholder="https://..." defaultValue={partner.website} />
                        </div>
                    </div>

                    {/* Seção 5: Endereço */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">5. Localização</h2>
                        <AddressForm initialData={{
                            zipCode: partner.zip_code,
                            street: partner.street,
                            number: partner.number,
                            neighborhood: partner.neighborhood,
                            city: partner.city,
                            state: partner.state
                        }} />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link href={`/admin/super/partners/${partner.id}`} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md border border-slate-300">Cancelar</Link>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { FormInput } from '@/components/ui/form-input'
import { ImageUploader } from '@/components/ui/image-uploader'

interface ProfileFormProps {
    partner: any
    allCategories: any[]
    allTags: any[]
    updateAction: (id: string, fd: FormData) => Promise<any>
}

export function ProfileForm({ partner, allCategories, allTags, updateAction }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    // Initial State for Multi-Selects
    const [selectedCats, setSelectedCats] = useState<string[]>(partner.categoryIds || [])
    const [selectedTags, setSelectedTags] = useState<string[]>(partner.tagIds || [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)

        // Append Arrays manually because unchecked checkboxes don't send anything
        // And we want to send specific selected IDs
        // Note: FormData get/getAll only works if inputs exist.
        // Easier way: Append them programmatically before submit? 
        // Or just let hidden inputs handle it.

        // Let's use the formData directly but we need to ensure inputs exist for arrays
        // The checkboxes below will have name="categories" value={id}, so they will be in formData.

        try {
            const result = await updateAction(partner.id, formData)
            if (result.error) {
                setMessage({ text: result.error, type: 'error' })
            } else {
                setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' })
            }
        } catch (err) {
            setMessage({ text: 'Erro inesperado.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const toggleCat = (id: string) => {
        setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const toggleTag = (id: string) => {
        setSelectedTags(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">

            {/* Mensagens */}
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Imagens */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Identidade Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visual identity inputs are handled below */}
                </div>

                {/* Better Approach: Controlled Inputs for Images handled by parent or internal state 
                    But since we have props 'partner', let's use internal state for visual feedback 
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <ImageUploader
                            label="Logo da Loja"
                            value={partner.logo_url}
                            onChange={(url) => {
                                // We can't easily update the 'partner' prop, nor the hidden input cleanly without state.
                                // Let's use a hidden input with ID and update it, or state.
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

            {/* Dados Básicos */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Dados da Loja</h3>
                <div className="space-y-4">
                    <FormInput
                        label="Nome Fantasia"
                        name="name"
                        defaultValue={partner.name}
                        placeholder="Ex: Pizzaria do João"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                            defaultValue={partner.description}
                            placeholder="Conte um pouco sobre seu negócio..."
                        />
                    </div>

                    <FormInput
                        label="Endereço Completo"
                        name="address"
                        defaultValue={partner.address}
                        placeholder="Rua Exemplo, 123 - Centro"
                    />
                </div>
            </div>

            {/* Categorias */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Segmento (Categoria)</h3>
                <p className="text-sm text-slate-500 mb-3">Selecione onde sua loja se encaixa.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allCategories.map(cat => (
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
            </div>

            {/* Tags / Diferenciais */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Diferenciais</h3>
                <p className="text-sm text-slate-500 mb-3">Marque o que sua loja oferece.</p>
                <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
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
                                className="sr-only" // Hidden native checkbox
                            />
                            <span>{selectedTags.includes(tag.id) ? '✓ ' : '+ '}{tag.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    )
}

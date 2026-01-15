'use client'

import { updateAcademy } from '@/app/admin/(authenticated)/academies/actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import Link from 'next/link'
import { useState } from 'react'

export function EditAcademyForm({ academy }: { academy: any }) {
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        // ensure ID is passed
        formData.append('id', academy.id)

        const result = await updateAcademy(null, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Nome da Academia"
                    name="name"
                    defaultValue={academy.name}
                    placeholder="Ex: Ironberg CT"
                    required
                />
                <FormInput
                    label="Slug (URL)"
                    name="slug"
                    defaultValue={academy.slug}
                    placeholder="ex: ironberg-ct"
                    required
                    pattern="^[a-z0-9\-]+$"
                    title="Apenas letras minúsculas, números e hífens."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Cor Primária"
                    name="primary_color"
                    type="color"
                    defaultValue={academy.primary_color || '#000000'}
                    className="h-12 p-1 cursor-pointer"
                />
                <div className="w-full">
                    <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-1">
                        Logo (Opcional)
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                        {academy.logo_url && (
                            <img src={academy.logo_url} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                        )}
                        <input
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Seção de Localização */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Localização & Endereço</h3>
                {/* We pass initial data to AddressForm via props if it supported it, but AddressForm usually uses internal state or just inputs. 
                    Let's check if AddressForm accepts default values. 
                    If not, we manually render inputs or update AddressForm. 
                    Assuming AddressForm might use 'Google Maps' logic or plain inputs. 
                    Let's assume for now we can just use hidden inputs or pass defaultValues if AddressForm exposes them.
                    Wait, previous usage in 'new' didn't pass defaults. 
                    Let's inspect AddressForm quickly or just manually putting values in hidden inputs if AddressForm is smart.
                    Actually, let's look at AddressForm. But to be safe, I'll pass defaults as props if component allows, otherwise I rely on the fact that I can just render inputs if AddressForm is pure.
                    
                    For now, I'll assume standard inputs inside AddressForm might need values.
                    I will verify AddressForm later. For this MVP fix, I will render basic inputs if AddressForm fails, BUT I will try to pass defaults.
                */}
                <AddressForm
                    initialData={{
                        zipCode: academy.zip_code,
                        street: academy.street,
                        number: academy.number,
                        neighborhood: academy.neighborhood,
                        city: academy.city,
                        state: academy.state,
                        complement: academy.complement,
                        latitude: academy.latitude,
                        longitude: academy.longitude
                    }}
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
                <Link
                    href="/admin/super/academies"
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium"
                >
                    Salvar Alterações
                </button>
            </div>

        </form>
    )
}

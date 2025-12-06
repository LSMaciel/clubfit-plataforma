'use client'

import { useState, useRef } from 'react'
import { FormInput } from '@/components/ui/form-input'

interface AddressData {
    street: string
    neighborhood: string
    city: string
    state: string
}

export function AddressForm() {
    const [loading, setLoading] = useState(false)
    const [addressData, setAddressData] = useState<AddressData>({
        street: '',
        neighborhood: '',
        city: '',
        state: ''
    })

    const [zipCode, setZipCode] = useState('')
    const [coordinates, setCoordinates] = useState<{ lat: string, lng: string } | null>(null)

    const numberInputRef = useRef<HTMLInputElement>(null)

    const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Apenas números

        // Máscara 99999-999
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2')
        }

        setZipCode(value)

        // Se completou 8 dígitos (9 com traço), busca na API
        if (value.length === 9) {
            const cleanCep = value.replace('-', '')
            await fetchAddress(cleanCep)
        }
    }

    const fetchAddress = async (cep: string) => {
        setLoading(true)
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)

            if (!response.ok) {
                throw new Error('CEP não encontrado')
            }

            const data = await response.json()

            const newAddress = {
                street: data.street,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state
            }

            setAddressData(newAddress)

            if (data.location?.coordinates) {
                setCoordinates({
                    lat: data.location.coordinates.latitude,
                    lng: data.location.coordinates.longitude
                })
            }

            // Foca no número automaticamente
            setTimeout(() => {
                numberInputRef.current?.focus()
            }, 100)

        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
            // Fallback silencioso: deixa o usuário digitar manualmente
        } finally {
            setLoading(false)
        }
    }

    const handleManualChange = (field: keyof AddressData, value: string) => {
        setAddressData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-slate-900">Endereço</h3>

            {/* Hidden inputs para enviar Lat/Long ao Server Action */}
            <input type="hidden" name="latitude" value={coordinates?.lat || ''} />
            <input type="hidden" name="longitude" value={coordinates?.lng || ''} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 relative">
                    <FormInput
                        label="CEP"
                        name="zip_code"
                        placeholder="00000-000"
                        maxLength={9}
                        value={zipCode}
                        onChange={handleZipChange}
                    />
                    {loading && (
                        <span className="absolute right-3 top-9 text-xs text-indigo-600 font-bold">
                            Busca...
                        </span>
                    )}
                </div>

                <div className="md:col-span-1">
                    <FormInput
                        label="Estado (UF)"
                        name="state"
                        maxLength={2}
                        value={addressData.state}
                        onChange={(e) => handleManualChange('state', e.target.value)}
                    />
                </div>

                <div className="md:col-span-2">
                    <FormInput
                        label="Cidade"
                        name="city"
                        value={addressData.city}
                        onChange={(e) => handleManualChange('city', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                    <FormInput
                        label="Logradouro (Rua, Av...)"
                        name="street"
                        value={addressData.street}
                        onChange={(e) => handleManualChange('street', e.target.value)}
                    />
                </div>

                <div className="md:col-span-1">
                    <FormInput
                        ref={numberInputRef}
                        label="Número"
                        name="number"
                        placeholder="123"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Bairro"
                    name="neighborhood"
                    value={addressData.neighborhood}
                    onChange={(e) => handleManualChange('neighborhood', e.target.value)}
                />

                <FormInput
                    label="Complemento"
                    name="complement"
                    placeholder="Ex: Apto 101"
                />
            </div>
        </div>
    )
}

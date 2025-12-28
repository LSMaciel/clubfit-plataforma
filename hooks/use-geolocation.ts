'use client'

import { useState, useEffect } from 'react'

interface LocationState {
    latitude: number | null
    longitude: number | null
    error: string | null
    loading: boolean
}

export function useGeolocation() {
    const [state, setState] = useState<LocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: false,
    })

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setState(s => ({ ...s, error: 'Geolocalização não suportada pelo navegador.', loading: false }))
            return
        }

        setState(s => ({ ...s, loading: true, error: null }))

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false
                })
            },
            (error) => {
                let msg = 'Erro ao obter localização.'
                if (error.code === 1) msg = 'Permissão de localização negada.'
                else if (error.code === 2) msg = 'Localização indisponível.'
                else if (error.code === 3) msg = 'Tempo esgotado ao buscar localização.'

                setState({
                    latitude: null,
                    longitude: null,
                    error: msg,
                    loading: false
                })
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    return { ...state, requestLocation }
}

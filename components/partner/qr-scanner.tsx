
'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void
}

export function QrScanner({ onScanSuccess }: QrScannerProps) {
  const [scanError, setScanError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    // Configuração do Scanner
    // Usamos um ID único para evitar conflitos de DOM
    const scannerId = "reader"
    
    // Iniciar apenas se ainda não existir
    if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
            scannerId,
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
                rememberLastUsedCamera: true
            },
            /* verbose= */ false
        )
        
        scanner.render(
            (decodedText) => {
                // Ao detectar sucesso, limpar e chamar callback
                scanner.clear().catch(console.error)
                onScanSuccess(decodedText)
            },
            (errorMessage) => {
                // Erros de leitura frequentes são comuns enquanto procura o QR, ignorar log excessivo
            }
        )
        
        scannerRef.current = scanner
    }

    // Cleanup ao desmontar
    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error)
        }
    }
  }, [onScanSuccess])

  return (
    <div className="w-full max-w-sm mx-auto">
      <div id="reader" className="overflow-hidden rounded-xl border-2 border-slate-200"></div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Aponte a câmera para o QR Code do aluno
      </p>
    </div>
  )
}

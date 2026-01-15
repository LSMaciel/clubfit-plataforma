'use client'

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { UploadCloud, FileSpreadsheet, AlertCircle, Check, X, Loader2 } from 'lucide-react'

// Tipos locais para SRP
export interface StudentRow {
    name: string
    cpf: string
    email: string
    phone: string
}

interface CsvUploaderProps {
    onDataParsed: (data: StudentRow[]) => void
    onClear: () => void
}

export function CsvUploader({ onDataParsed, onClear }: CsvUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const parseFile = (file: File) => {
        setIsLoading(true)
        setError(null)
        setFileName(file.name)

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Formato inválido. Apenas arquivos .csv são aceitos.')
            setIsLoading(false)
            return
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            encoding: 'UTF-8',
            complete: (results) => {
                setIsLoading(false)
                const rows = results.data as StudentRow[]

                // 1. Validação Básica de Colunas
                const firstRow = rows[0]
                if (!firstRow || (!('cpf' in firstRow) && !('CPF' in firstRow))) {
                    setError('Coluna CPF não encontrada. Verifique o cabeçalho do CSV.')
                    return
                }

                // 2. Limite de 500 linhas
                if (rows.length > 500) {
                    setError(`Limite excedido. O arquivo contém ${rows.length} registros (Máximo: 500).`)
                    return
                }

                // Normalização de chaves (lowercase)
                const normalized = rows.map(r => ({
                    name: r.name || (r as any).Nome || '',
                    cpf: r.cpf || (r as any).CPF || '',
                    email: r.email || (r as any).Email || '',
                    phone: r.phone || (r as any).Telefone || ''
                }))

                onDataParsed(normalized)
            },
            error: (err) => {
                setIsLoading(false)
                setError(`Erro ao ler arquivo: ${err.message}`)
            }
        })
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) parseFile(file)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) parseFile(file)
    }

    return (
        <div className="w-full">
            {!fileName ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
                >
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="csv-input"
                    />
                    <label htmlFor="csv-input" className="cursor-pointer flex flex-col items-center">
                        {isLoading ? (
                            <Loader2 className="h-10 w-10 text-slate-400 animate-spin mb-3" />
                        ) : (
                            <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
                        )}
                        <p className="text-sm font-medium text-slate-700">
                            Clique para selecionar ou arraste seu CSV
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Máximo 500 alunos. Colunas: Nome, CPF, Email, Telefone.
                        </p>
                    </label>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-md">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{fileName}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <Check className="h-3 w-3" /> Arquivo carregado
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setFileName(null); onClear(); setError(null) }}
                        className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

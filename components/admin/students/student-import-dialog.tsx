'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, Upload, Check } from 'lucide-react'
import { CsvUploader, StudentRow } from './csv-uploader'
import { ImportPreviewTable } from './import-preview-table'

export function StudentImportDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [parsedData, setParsedData] = useState<StudentRow[]>([])
    const [isImporting, setIsImporting] = useState(false)
    const [result, setResult] = useState<{ inserted: number, skipped: number } | null>(null)

    const handleDataParsed = (data: StudentRow[]) => {
        setParsedData(data)
        setResult(null)
    }

    const handleClear = () => {
        setParsedData([])
        setResult(null)
    }

    const handleImport = async () => {
        if (!parsedData.length) return
        setIsImporting(true)

        try {
            const { importStudents } = await import('@/app/admin/(authenticated)/students/actions')
            const response = await importStudents(parsedData)

            if ('error' in response) {
                alert(response.error)
            } else {
                setResult({ inserted: response.inserted, skipped: response.skipped })
                setParsedData([]) // Clear data to show result screen
            }
        } catch (err) {
            console.error(err)
            alert('Erro inesperado na importação.')
        } finally {
            setIsImporting(false)
        }
    }

    if (!isOpen) {
        return (
            <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV
            </Button>
        )
    }

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV
            </Button>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                                Importação em Massa
                            </h2>
                            <p className="text-sm text-slate-500">Cadastre múltiplos alunos de uma vez.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {result ? (
                            <div className="text-center p-8 bg-green-50 rounded-lg border border-green-100">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">Importação Concluída!</h3>
                                <p className="text-green-700 mb-6">
                                    O processo foi finalizado com sucesso.
                                </p>
                                <div className="flex justify-center gap-8 text-sm">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-slate-900">{result.inserted}</span>
                                        <span className="text-slate-500">Inseridos</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-slate-500">{result.skipped}</span>
                                        <span className="text-slate-500">Duplicados (Pualdos)</span>
                                    </div>
                                </div>
                            </div>
                        ) : !parsedData.length ? (
                            <CsvUploader onDataParsed={handleDataParsed} onClear={handleClear} />
                        ) : (
                            <div className="space-y-4">
                                <ImportPreviewTable data={parsedData} />
                                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                                    <span>{parsedData.length} registros prontos para importação.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        {result ? (
                            <Button variant="primary" onClick={() => { setIsOpen(false); setResult(null); }}>
                                Fechar
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => { setIsOpen(false); handleClear(); }} disabled={isImporting}>
                                    Cancelar
                                </Button>

                                {parsedData.length > 0 && (
                                    <Button variant="outline" onClick={handleClear} disabled={isImporting}>
                                        Reiniciar
                                    </Button>
                                )}

                                <Button
                                    disabled={!parsedData.length || isImporting}
                                    variant="primary"
                                    onClick={handleImport}
                                >
                                    {isImporting ? 'Processando...' : 'Confirmar Importação'}
                                </Button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

'use client'

import { StudentRow } from './csv-uploader'

interface ImportPreviewTableProps {
    data: StudentRow[]
}

export function ImportPreviewTable({ data }: ImportPreviewTableProps) {
    if (data.length === 0) return null

    return (
        <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pré-visualização ({data.length} registros)
                </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-900">Nome</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-900">CPF</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-900">Email</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.slice(0, 50).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                                    {row.name || <span className="text-red-400 italic">Vazio</span>}
                                </td>
                                <td className="px-4 py-2 text-sm text-slate-600 font-mono whitespace-nowrap">
                                    {row.cpf || <span className="text-red-400 italic">Vazio</span>}
                                </td>
                                <td className="px-4 py-2 text-sm text-slate-500 whitespace-nowrap">
                                    {row.email || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length > 50 && (
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-500">
                        E mais {data.length - 50} linhas...
                    </p>
                </div>
            )}
        </div>
    )
}

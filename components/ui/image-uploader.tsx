import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
    value?: string
    onChange: (url: string) => void
    label?: string
    className?: string
}

export function ImageUploader({ value, onChange, label = 'Imagem de Capa', className = '' }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | undefined>(value)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Basic Client-Side Validation (Size < 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB')
            return
        }

        // Create Object URL for Preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Simulating Upload for MVP: 
        // In a real scenario, we would upload to Supabase Storage here and get the public URL.
        // For now, we pass the local Object URL effectively treating it as "uploaded" for the session.
        onChange(objectUrl)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(undefined)
        onChange('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className={className}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative group cursor-pointer 
                    w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center
                    ${preview
                        ? 'border-indigo-200 bg-slate-50'
                        : 'border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400'}
                `}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                onClick={handleRemove}
                                type="button"
                                className="bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                Alterar Imagem
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <h3 className="font-medium text-slate-900">Clique para enviar</h3>
                        <p className="text-sm text-slate-500 mt-1">PG, PNG ou WebP (Max 5MB)</p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    )
}

import { LucideIcon } from 'lucide-react'

interface KPICardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
}

export function KPICard({ title, value, icon: Icon, description, trend, trendValue }: KPICardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">{title}</span>
                <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {(description || trendValue) && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        {trend && trendValue && (
                            <span className={`font-medium ${trend === 'up' ? 'text-green-600' :
                                    trend === 'down' ? 'text-red-500' : 'text-slate-500'
                                }`}>
                                {trendValue}
                            </span>
                        )}
                        <span>{description}</span>
                    </p>
                )}
            </div>
        </div>
    )
}

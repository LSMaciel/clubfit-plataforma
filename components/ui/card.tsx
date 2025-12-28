import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm", // Simpler, flatter, sharper
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

export { Card }

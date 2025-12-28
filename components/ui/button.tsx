import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {

    const variants = {
        primary: 'bg-slate-900 text-white hover:bg-slate-800 border border-transparent', // Solid Black/Dark Slate
        gradient: 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent', // Replaced gradient with solid Indigo
        secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        outline: 'bg-transparent text-slate-600 border border-slate-300 hover:text-slate-900 hover:border-slate-400',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]', // rounded-md, sharper active scale
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
})

Button.displayName = 'Button'

export { Button }

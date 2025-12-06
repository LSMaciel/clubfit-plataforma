import React, { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className={`
            block w-full rounded-md border-slate-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            border p-2
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
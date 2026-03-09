import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    required?: boolean
    error?: string
    hint?: string
    prefix?: string
}

export default function Input({
    label,
    required,
    error,
    hint,
    prefix,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label} {required && <span className="req">*</span>}
                </label>
            )}

            <div className={prefix ? 'relative' : ''}>
                {prefix && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input
                    id={inputId}
                    className={`form-input ${prefix ? 'pl-11' : ''} ${error ? 'border-danger-500 focus:border-danger-500' : ''} ${className}`}
                    {...props}
                />
            </div>

            {error && <p className="text-danger-500 text-xs mt-1">{error}</p>}
            {!error && hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
        </div>
    )
}

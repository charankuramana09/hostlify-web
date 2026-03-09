import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
    label: string
    value: string | number
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    required?: boolean
    error?: string
    hint?: string
    options: SelectOption[]
    placeholder?: string
}

export default function Select({
    label,
    required,
    error,
    hint,
    options,
    placeholder,
    className = '',
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={selectId} className="form-label">
                    {label} {required && <span className="req">*</span>}
                </label>
            )}

            <select
                id={selectId}
                className={`form-select ${error ? 'border-danger-500 focus:border-danger-500' : ''} ${className}`}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-danger-500 text-xs mt-1">{error}</p>}
            {!error && hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
        </div>
    )
}

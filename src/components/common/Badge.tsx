import type { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'gray'
    dot?: boolean
    className?: string
}

export default function Badge({
    children,
    variant = 'gray',
    dot = false,
    className = ''
}: BadgeProps) {
    const variantClass = `badge-${variant}`
    const dotClass = dot ? 'badge-dot' : ''

    return (
        <span className={`badge ${variantClass} ${dotClass} ${className}`}>
            {children}
        </span>
    )
}

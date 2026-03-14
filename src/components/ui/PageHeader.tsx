import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  count?: number
}

export default function PageHeader({ title, subtitle, action, count }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {count !== undefined && (
            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

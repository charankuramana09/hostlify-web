import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  iconBg: string
}

export default function StatCard({ label, value, sub, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${iconBg} shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

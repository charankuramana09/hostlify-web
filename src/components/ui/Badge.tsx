const STYLES: Record<string, string> = {
  OPEN: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-red-100 text-red-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  ALLOCATED: 'bg-indigo-100 text-indigo-700',
}

export default function Badge({ status }: { status: string }) {
  const cls = STYLES[status] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

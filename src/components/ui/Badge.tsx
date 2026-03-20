const CONFIG: Record<string, { bg: string; dot: string; text: string; label?: string }> = {
  OPEN:        { bg: 'bg-amber-50',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  IN_PROGRESS: { bg: 'bg-blue-50',    dot: 'bg-blue-400',    text: 'text-blue-700',    label: 'In Progress' },
  RESOLVED:    { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  CLOSED:      { bg: 'bg-gray-100',   dot: 'bg-gray-400',    text: 'text-gray-500' },
  PENDING:     { bg: 'bg-amber-50',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  PAID:        { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  OVERDUE:     { bg: 'bg-red-50',     dot: 'bg-red-500',     text: 'text-red-600' },
  ACTIVE:      { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  INACTIVE:    { bg: 'bg-gray-100',   dot: 'bg-gray-400',    text: 'text-gray-500' },
  APPROVED:    { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  REJECTED:    { bg: 'bg-red-50',     dot: 'bg-red-500',     text: 'text-red-600' },
  ALLOCATED:   { bg: 'bg-indigo-50',  dot: 'bg-indigo-500',  text: 'text-indigo-700' },
}

const DEFAULT = { bg: 'bg-gray-100', dot: 'bg-gray-400', text: 'text-gray-500' }

export default function Badge({ status }: { status?: string | null }) {
  if (!status) return null
  const cfg = CONFIG[status] ?? DEFAULT
  const label = cfg.label ?? status.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {label}
    </span>
  )
}

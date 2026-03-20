import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToastStore, type Toast } from '../../store/toastStore'

const CONFIG = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 border-emerald-200',
    icon_color: 'text-emerald-600',
    title_color: 'text-emerald-900',
    msg_color: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-200',
    icon_color: 'text-red-600',
    title_color: 'text-red-900',
    msg_color: 'text-red-700',
    bar: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-200',
    icon_color: 'text-amber-600',
    title_color: 'text-amber-900',
    msg_color: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    icon_color: 'text-blue-600',
    title_color: 'text-blue-900',
    msg_color: 'text-blue-700',
    bar: 'bg-blue-500',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => setVisible(false), 3600)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
    }
  }, [])

  const cfg = CONFIG[toast.type]
  const Icon = cfg.icon

  return (
    <div
      className={`relative w-80 border rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${cfg.bg} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      {/* Progress bar */}
      <div
        className={`absolute top-0 left-0 h-1 ${cfg.bar} animate-[shrink_4s_linear_forwards]`}
        style={{ width: '100%', animationName: 'toast-shrink' }}
      />

      <div className="flex items-start gap-3 p-4 pt-5">
        <Icon size={18} className={`shrink-0 mt-0.5 ${cfg.icon_color}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-tight ${cfg.title_color}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-xs mt-0.5 leading-relaxed ${cfg.msg_color}`}>{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => remove(toast.id)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <>
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </div>
    </>
  )
}

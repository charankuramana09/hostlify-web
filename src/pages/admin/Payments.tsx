import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IndianRupee, X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { getPendingDues, recordCashPayment } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500',   'bg-amber-500',   'bg-teal-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Payments() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'dues' | 'history'>('dues')
  const [confirmRecord, setConfirmRecord] = useState<any | null>(null)

  const { data: dues = [], isLoading } = useQuery({
    queryKey: ['dues', activeHostelId],
    queryFn: () => getPendingDues(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const recordMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => recordCashPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues', activeHostelId] })
      setConfirmRecord(null)
    },
  })

  function handleRecordPayment() {
    if (!confirmRecord) return
    recordMut.mutate({ dueId: confirmRecord.id, amount: confirmRecord.amount })
  }

  const pendingDues = dues.filter((d: any) => d.status !== 'PAID')
  const paidDues    = dues.filter((d: any) => d.status === 'PAID')
  const overdueDues = dues.filter((d: any) => d.status === 'OVERDUE')

  const totalDue     = pendingDues.reduce((s: number, d: any) => s + (d.amount ?? 0), 0)
  const totalPaid    = paidDues.reduce((s: number, d: any) => s + (d.amount ?? 0), 0)
  const totalOverdue = overdueDues.reduce((s: number, d: any) => s + (d.amount ?? 0), 0)

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Manage dues and record cash payments" />

      {/* Confirm modal */}
      {confirmRecord && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <IndianRupee size={15} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Record Cash Payment</h3>
              </div>
              <button
                onClick={() => setConfirmRecord(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {getInitials(confirmRecord.hostellerName ?? confirmRecord.memberName ?? '??')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{confirmRecord.hostellerName ?? confirmRecord.memberName}</p>
                  <p className="text-xs text-gray-400">Room {confirmRecord.roomNumber}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="text-xs text-gray-400 font-medium">Amount to record</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5 tracking-tight">
                  ₹{(confirmRecord.amount ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-5">Confirm cash payment receipt from this member?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRecord(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={recordMut.isPending}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {recordMut.isPending ? 'Processing…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Due"
          value={`₹${totalDue.toLocaleString()}`}
          sub={`${pendingDues.length} members pending`}
          icon={<Clock size={20} className="text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Collected"
          value={`₹${totalPaid.toLocaleString()}`}
          sub={`${paidDues.length} members paid`}
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Overdue"
          value={`₹${totalOverdue.toLocaleString()}`}
          sub={`${overdueDues.length} members overdue`}
          icon={<AlertTriangle size={20} className="text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Pill tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['dues', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'dues' ? `Pending Dues (${pendingDues.length})` : `Payment History (${paidDues.length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Room</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Due Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                {tab === 'dues' && (
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(tab === 'dues' ? pendingDues : paidDues).map((d: any, i: number) => (
                <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(d.hostellerName ?? d.memberName ?? '??')}
                      </div>
                      <p className="font-semibold text-gray-800">{d.hostellerName ?? d.memberName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                      {d.roomNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold text-sm ${tab === 'history' ? 'text-emerald-600' : d.status === 'OVERDUE' ? 'text-red-600' : 'text-gray-900'}`}>
                      ₹{(d.amount ?? 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={d.status} />
                  </td>
                  {tab === 'dues' && (
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setConfirmRecord(d)}
                        className="flex items-center gap-1.5 text-emerald-600 hover:text-white font-semibold text-xs border border-emerald-200 bg-emerald-50 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <IndianRupee size={12} /> Record Cash
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {(tab === 'dues' ? pendingDues : paidDues).length === 0 && (
                <tr>
                  <td colSpan={tab === 'dues' ? 6 : 5} className="px-5 py-12 text-center text-sm font-semibold text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

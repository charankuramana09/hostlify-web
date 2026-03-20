import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, ClipboardList } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { getPendingAllocations, allocateBed } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500',   'bg-amber-500',
]

const PREF_CHIP: Record<string, string> = {
  'AC':     'bg-sky-50 text-sky-700',
  'Non-AC': 'bg-gray-100 text-gray-600',
  'Any':    'bg-emerald-50 text-emerald-700',
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function PendingAllocations() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<any | null>(null)
  const [bedId, setBedId] = useState('')

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['pendingAllocations', activeHostelId],
    queryFn: () => getPendingAllocations(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const allocateMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => allocateBed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAllocations', activeHostelId] })
      setSelected(null)
      setBedId('')
    },
  })

  function handleAllocate(e: React.FormEvent) {
    e.preventDefault()
    allocateMut.mutate({
      bookingId: selected.id,
      bedId: bedId ? Number(bedId) : undefined,
    })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Allocations"
        subtitle="Review and assign rooms to new applicants"
        count={pending.length}
      />

      {/* Allocate room modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ClipboardList size={15} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Allocate Bed</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Applicant info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {getInitials(selected.applicantName ?? selected.name ?? '??')}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{selected.applicantName ?? selected.name}</p>
                  <p className="text-xs text-gray-500">{selected.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Gender</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{selected.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Preference</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{selected.roomPreference ?? selected.preference ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Applied</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {selected.appliedDate ?? (selected.appliedAt ? new Date(selected.appliedAt).toLocaleDateString('en-IN') : '—')}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bed ID</label>
                <input
                  required
                  type="number"
                  value={bedId}
                  onChange={(e) => setBedId(e.target.value)}
                  placeholder="Enter bed ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocateMut.isPending}
                  className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
                >
                  {allocateMut.isPending ? 'Allocating…' : 'Allocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Applicant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Preference</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Applied</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pending.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <ClipboardList size={18} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-400 text-sm">No pending allocations</p>
                  </td>
                </tr>
              )}
              {pending.map((p: any, i: number) => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(p.applicantName ?? p.name ?? '??')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{p.applicantName ?? p.name}</p>
                        <p className="text-xs text-gray-400">{p.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-700 text-sm">{p.email}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PREF_CHIP[p.roomPreference ?? p.preference ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                      {p.roomPreference ?? p.preference ?? 'Any'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {p.appliedDate ?? (p.appliedAt ? new Date(p.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={p.status ?? 'PENDING'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(p)}
                      className="flex items-center gap-1.5 text-emerald-600 hover:text-white font-semibold text-xs border border-emerald-200 bg-emerald-50 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Allocate Room
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

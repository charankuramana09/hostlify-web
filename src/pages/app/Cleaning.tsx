import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, SprayCan, Calendar } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { getMyCleaning, requestCleaning } from '../../api/hosteller'

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TIME_SLOTS = ['Morning 9–11 AM', 'Afternoon 1–3 PM', 'Evening 4–6 PM']

const SLOT_COLORS: Record<string, string> = {
  'Morning 9–11 AM': 'bg-amber-50 text-amber-700',
  'Afternoon 1–3 PM': 'bg-blue-50 text-blue-700',
  'Evening 4–6 PM': 'bg-purple-50 text-purple-700',
}

export default function Cleaning() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ preferredDate: '', slot: '', notes: '' })

  const { data: cleaningData, isLoading, error } = useQuery({
    queryKey: ['my-cleaning'],
    queryFn: getMyCleaning,
  })

  const requestMutation = useMutation({
    mutationFn: requestCleaning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cleaning'] })
      setShowForm(false)
      setForm({ preferredDate: '', slot: '', notes: '' })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    requestMutation.mutate({
      preferredDate: form.preferredDate,
      timeSlot: form.slot,
      notes: form.notes,
    })
  }

  const cleaningList = cleaningData ?? []

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  if (error) return <div className="text-center py-20 text-gray-400">Failed to load data</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cleaning Requests"
        subtitle="Request room cleaning service"
        count={cleaningList.length}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            <Plus size={16} /> New Request
          </button>
        }
      />

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <SprayCan size={14} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">New Cleaning Request</h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={form.preferredDate}
                  onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  required
                  value={form.slot}
                  onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select time slot</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Notes (optional)
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any specific instructions…"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
              >
                {requestMutation.isPending ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Requests Cards */}
      <div className="space-y-3">
        {cleaningList.map((r: any) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{fmtDate(r.preferredDate)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Requested on {fmtDate(r.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge status={r.status} />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${SLOT_COLORS[r.timeSlot] ?? SLOT_COLORS[r.slot] ?? 'bg-gray-100 text-gray-600'}`}>
                {r.timeSlot ?? r.slot ?? '—'}
              </span>
              {r.notes && (
                <p className="text-sm text-gray-500 flex-1">{r.notes}</p>
              )}
            </div>
            {r.status === 'PENDING' && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  Cancel Request
                </button>
              </div>
            )}
          </div>
        ))}
        {cleaningList.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <SprayCan size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 text-sm">No cleaning requests yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "New Request" to schedule a cleaning</p>
          </div>
        )}
      </div>
    </div>
  )
}

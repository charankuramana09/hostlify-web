import { useState } from 'react'
import { Plus, X, CalendarCheck, CalendarX, Clock, CalendarClock } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

const MOCK_LEAVES = [
  { id: 1, fromDate: 'Mar 15, 2026', toDate: 'Mar 18, 2026', reason: 'Family function at hometown', status: 'APPROVED', appliedAt: 'Mar 8, 2026' },
  { id: 2, fromDate: 'Feb 10, 2026', toDate: 'Feb 12, 2026', reason: 'Medical appointment', status: 'APPROVED', appliedAt: 'Feb 5, 2026' },
  { id: 3, fromDate: 'Jan 24, 2026', toDate: 'Jan 26, 2026', reason: 'Personal work', status: 'REJECTED', appliedAt: 'Jan 20, 2026' },
]

export default function Leave() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call applyLeave() API
    setShowForm(false)
    setForm({ fromDate: '', toDate: '', reason: '' })
  }

  const approved = MOCK_LEAVES.filter((l) => l.status === 'APPROVED').length
  const pending = MOCK_LEAVES.filter((l) => l.status === 'PENDING').length
  const rejected = MOCK_LEAVES.filter((l) => l.status === 'REJECTED').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        subtitle="Apply for leave and track approvals"
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            <Plus size={16} /> Apply Leave
          </button>
        }
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Approved"
          value={approved}
          sub="Leave requests approved"
          icon={<CalendarCheck size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Pending"
          value={pending}
          sub="Awaiting approval"
          icon={<Clock size={20} className="text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Rejected"
          value={rejected}
          sub="Leave requests rejected"
          icon={<CalendarX size={20} className="text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* New leave request form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #e0e7ff' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CalendarClock size={14} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">New Leave Request</h3>
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From Date</label>
                <input
                  type="date"
                  required
                  value={form.fromDate}
                  onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To Date</label>
                <input
                  type="date"
                  required
                  value={form.toDate}
                  onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reason</label>
              <textarea
                required
                rows={3}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50 focus:bg-white transition-colors"
                placeholder="Reason for leave…"
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
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave history cards */}
      <div className="space-y-3">
        {MOCK_LEAVES.map((l) => (
          <div
            key={l.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{l.reason}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                    <CalendarClock size={12} className="text-gray-400" />
                    {l.fromDate} — {l.toDate}
                  </span>
                </div>
              </div>
              <Badge status={l.status} />
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium">Applied {l.appliedAt}</p>
          </div>
        ))}
        {MOCK_LEAVES.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <CalendarClock size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 text-sm">No leave requests yet</p>
            <p className="text-xs text-gray-400 mt-1">Apply for leave using the button above</p>
          </div>
        )}
      </div>
    </div>
  )
}

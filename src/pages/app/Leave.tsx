import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        subtitle="Apply for leave and track approvals"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <Plus size={16} /> Apply Leave
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">New Leave Request</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
                <input
                  type="date"
                  required
                  value={form.fromDate}
                  onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
                <input
                  type="date"
                  required
                  value={form.toDate}
                  onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
              <textarea
                required
                rows={3}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Reason for leave…"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">From</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">To</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Reason</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Applied</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LEAVES.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-gray-700">{l.fromDate}</td>
                  <td className="px-5 py-3.5 text-gray-700">{l.toDate}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{l.reason}</td>
                  <td className="px-5 py-3.5 text-gray-500">{l.appliedAt}</td>
                  <td className="px-5 py-3.5"><Badge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

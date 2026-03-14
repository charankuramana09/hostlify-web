import { useState } from 'react'
import { Plus, X, Wrench } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

const MAINTENANCE_CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'AC / Cooling', 'Painting', 'Other']

const MOCK_LOGS = [
  { id: 1, date: 'Mar 10, 2026', title: 'Leaking pipe in Block B bathroom',       category: 'Plumbing',     assignedTo: 'External Vendor',   estCost: 1500, actualCost: 1200, status: 'COMPLETED' },
  { id: 2, date: 'Mar 8, 2026',  title: 'AC unit servicing – Room F-02',           category: 'AC / Cooling', assignedTo: 'CoolAir Services',  estCost: 3000, actualCost: null, status: 'IN_PROGRESS' },
  { id: 3, date: 'Mar 5, 2026',  title: 'Broken bed frame in Room A-101',          category: 'Carpentry',    assignedTo: 'In-house',          estCost: 800,  actualCost: 900,  status: 'COMPLETED' },
  { id: 4, date: 'Mar 1, 2026',  title: 'Electrical wiring check – Ground floor',  category: 'Electrical',   assignedTo: 'Spark Electricals', estCost: 5000, actualCost: null, status: 'OPEN' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Plumbing: 'bg-teal-50 text-teal-700',
  Electrical: 'bg-yellow-50 text-yellow-700',
  Carpentry: 'bg-amber-50 text-amber-700',
  'AC / Cooling': 'bg-blue-50 text-blue-700',
  Painting: 'bg-purple-50 text-purple-700',
  Other: 'bg-gray-100 text-gray-600',
}

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'COMPLETED']

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', title: '', assignedTo: '', estCost: '', status: 'OPEN' })

  const openCount = MOCK_LOGS.filter((l) => l.status === 'OPEN').length
  const inProgressCount = MOCK_LOGS.filter((l) => l.status === 'IN_PROGRESS').length
  const completedCount = MOCK_LOGS.filter((l) => l.status === 'COMPLETED').length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call addMaintenanceLog API
    setShowForm(false)
    setForm({ category: '', title: '', assignedTo: '', estCost: '', status: 'OPEN' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        subtitle="Track and manage maintenance tasks"
        count={MOCK_LOGS.length}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
          >
            <Plus size={16} /> Add Log
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Open"
          value={openCount}
          sub="Awaiting action"
          icon={<Wrench size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          sub="Currently being worked on"
          icon={<Wrench size={20} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          sub="Resolved this month"
          icon={<Wrench size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wrench size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Add Maintenance Log</h3>
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select category</option>
                  {MAINTENANCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Brief description"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Assigned To</label>
                <input
                  required
                  value={form.assignedTo}
                  onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                  placeholder="Vendor or In-house"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={form.estCost}
                  onChange={(e) => setForm((f) => ({ ...f, estCost: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
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
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                Add Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Assigned To</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Est. Cost</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actual Cost</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LOGS.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{l.date}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{l.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${CATEGORY_COLORS[l.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {l.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{l.assignedTo}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-700">₹{l.estCost.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-700">
                    {l.actualCost != null ? `₹${l.actualCost.toLocaleString()}` : '—'}
                  </td>
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

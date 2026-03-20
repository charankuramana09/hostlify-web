import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, Wrench } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { getMaintenanceLogs, createMaintenance, updateMaintenanceStatus } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

const MAINTENANCE_CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'AC / Cooling', 'Painting', 'Other']

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
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', title: '', description: '', assignedTo: '', estCost: '', status: 'OPEN' })

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['maintenance', activeHostelId],
    queryFn: () => getMaintenanceLogs(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const createMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => createMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', activeHostelId] })
      setShowForm(false)
      setForm({ category: '', title: '', description: '', assignedTo: '', estCost: '', status: 'OPEN' })
      show('success', 'Log added', 'Maintenance log has been created.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Please check the details and try again.'
      show('error', 'Failed to add log', msg)
    },
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateMaintenanceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', activeHostelId] })
      show('success', 'Status updated', 'Maintenance status has been updated.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to update status.'
      show('error', 'Update failed', msg)
    },
  })

  const openCount = logs.filter((l: any) => l.status === 'OPEN').length
  const inProgressCount = logs.filter((l: any) => l.status === 'IN_PROGRESS').length
  const completedCount = logs.filter((l: any) => l.status === 'COMPLETED').length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeHostelId) { show('error', 'No hostel selected', 'Please select a hostel first.'); return }
    createMut.mutate({
      hostelId: activeHostelId,
      category: form.category,
      title: form.title,
      description: form.description || form.title,
      vendor: form.assignedTo,
      assignedTo: form.assignedTo,
      estimatedCost: form.estCost ? Number(form.estCost) : undefined,
      status: form.status,
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
        title="Maintenance"
        subtitle="Track and manage maintenance tasks"
        count={logs.length}
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
                  placeholder="e.g. Leaking pipe in Room 201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Additional details about the issue"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors resize-none"
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
                disabled={createMut.isPending}
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                {createMut.isPending ? 'Adding…' : 'Add Log'}
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm font-semibold text-gray-400">
                    No maintenance logs yet
                  </td>
                </tr>
              )}
              {logs.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (l.date ?? '—')}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{l.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${CATEGORY_COLORS[l.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {l.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{l.vendor ?? l.assignedTo ?? '—'}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-700">
                    {l.estimatedCost != null ? `₹${(l.estimatedCost).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-700">
                    {l.actualCost != null ? `₹${l.actualCost.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5"><Badge status={l.status} /></td>
                  <td className="px-5 py-3.5">
                    <select
                      value={l.status}
                      onChange={(e) => statusMut.mutate({ id: l.id, status: e.target.value })}
                      disabled={statusMut.isPending}
                      className="text-xs font-semibold border border-gray-200 bg-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
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

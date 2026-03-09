import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const SERVICE_CATEGORIES = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'AC / Cooling', 'Other']

const MOCK_SERVICES = [
  { id: 1, category: 'Electrical', description: 'Room light not working', status: 'RESOLVED', createdAt: 'Mar 5, 2026' },
  { id: 2, category: 'Plumbing', description: 'Water tap leaking', status: 'IN_PROGRESS', createdAt: 'Mar 8, 2026' },
  { id: 3, category: 'AC / Cooling', description: 'AC remote missing', status: 'OPEN', createdAt: 'Mar 9, 2026' },
]

export default function Service() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', description: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call createServiceRequest() API
    setShowForm(false)
    setForm({ category: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        subtitle="Request maintenance and other services"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <Plus size={16} /> New Request
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">New Service Request</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select category</option>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Describe the issue…"
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
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SERVICES.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{s.category}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{s.description}</td>
                  <td className="px-5 py-3.5 text-gray-500">{s.createdAt}</td>
                  <td className="px-5 py-3.5"><Badge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

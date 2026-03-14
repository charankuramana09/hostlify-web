import { useState } from 'react'
import { Plus, X, MessageSquare } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const CATEGORIES = ['Maintenance', 'Cleanliness', 'Food', 'Noise', 'Security', 'Other']

const MOCK_COMPLAINTS = [
  { id: 1, title: 'AC not working in room', category: 'Maintenance', status: 'IN_PROGRESS', createdAt: 'Mar 7, 2026', description: 'The AC in my room has stopped working since last week. It shows error code E3.' },
  { id: 2, title: 'Washroom not clean', category: 'Cleanliness', status: 'RESOLVED', createdAt: 'Mar 2, 2026', description: 'The common washroom on floor 1 was not cleaned for 2 days.' },
  { id: 3, title: 'Food quality issue in dinner', category: 'Food', status: 'OPEN', createdAt: 'Feb 28, 2026', description: 'The dinner on Feb 27 had stale vegetables. Please improve quality.' },
  { id: 4, title: 'Noisy neighbours after 11 PM', category: 'Noise', status: 'CLOSED', createdAt: 'Feb 20, 2026', description: 'Room B-203 residents make loud noise after 11 PM on weekends.' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Cleanliness: 'bg-teal-50 text-teal-700',
  Food: 'bg-orange-50 text-orange-700',
  Noise: 'bg-purple-50 text-purple-700',
  Security: 'bg-red-50 text-red-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function Complaints() {
  const [showForm, setShowForm] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [form, setForm] = useState({ title: '', category: '', description: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call createComplaint() API
    setShowForm(false)
    setForm({ title: '', category: '', description: '' })
  }

  const filtered = activeCategory === 'All'
    ? MOCK_COMPLAINTS
    : MOCK_COMPLAINTS.filter((c) => c.category === activeCategory)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaints"
        subtitle="Raise and track your complaints"
        count={MOCK_COMPLAINTS.length}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            <Plus size={16} /> Raise Complaint
          </button>
        }
      />

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* New complaint form card */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #e0e7ff' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <MessageSquare size={14} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">New Complaint</h3>
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Brief title of the issue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50 focus:bg-white transition-colors"
                placeholder="Describe the issue in detail…"
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

      {/* Complaints cards */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {c.category}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge status={c.status} />
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{c.description}</p>
            <p className="text-xs text-gray-400 mt-2.5 font-medium">Submitted {c.createdAt}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 text-sm">No complaints in this category</p>
            <p className="text-xs text-gray-400 mt-1">Try a different filter or raise a new complaint</p>
          </div>
        )}
      </div>
    </div>
  )
}

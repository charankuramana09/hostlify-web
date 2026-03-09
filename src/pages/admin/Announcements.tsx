import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const CATEGORIES = ['General', 'Maintenance', 'Event', 'Fee', 'Emergency']

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026', content: 'Annual hostel fest scheduled for March 20th. Food stalls, cultural programs, and games. All residents invited.', category: 'Event', publishedAt: 'Mar 5, 2026', publishedBy: 'Staff A' },
  { id: 2, title: 'Water Supply Interruption', content: 'Water supply will be interrupted on March 10th from 10 AM to 2 PM.', category: 'Maintenance', publishedAt: 'Mar 3, 2026', publishedBy: 'Staff B' },
  { id: 3, title: 'April Fee Reminder', content: 'April fee deadline is April 1st. Pay on time to avoid late charges.', category: 'Fee', publishedAt: 'Mar 1, 2026', publishedBy: 'Staff A' },
]

const CATEGORY_COLORS: Record<string, string> = {
  General: 'bg-gray-100 text-gray-600',
  Maintenance: 'bg-amber-100 text-amber-700',
  Event: 'bg-purple-100 text-purple-700',
  Fee: 'bg-red-100 text-red-700',
  Emergency: 'bg-red-200 text-red-800',
}

export default function AdminAnnouncements() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call createAnnouncement() API
    setShowForm(false)
    setForm({ title: '', content: '', category: '' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Post updates to all residents"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            <Plus size={16} /> New Announcement
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">New Announcement</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Announcement details…"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Publish</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[a.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {a.category}
                </span>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{a.publishedAt}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
            <p className="text-xs text-gray-400 mt-2">Published by {a.publishedBy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, X, Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const CATEGORIES = ['General', 'Maintenance', 'Event', 'Fee', 'Emergency']

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026',          content: 'Annual hostel fest scheduled for March 20th. Food stalls, cultural programs, and games. All residents invited.', category: 'Event',       publishedAt: 'Mar 5, 2026', publishedBy: 'Staff A' },
  { id: 2, title: 'Water Supply Interruption',  content: 'Water supply will be interrupted on March 10th from 10 AM to 2 PM.',                                             category: 'Maintenance', publishedAt: 'Mar 3, 2026', publishedBy: 'Staff B' },
  { id: 3, title: 'April Fee Reminder',          content: 'April fee deadline is April 1st. Pay on time to avoid late charges.',                                             category: 'Fee',         publishedAt: 'Mar 1, 2026', publishedBy: 'Staff A' },
]

const CATEGORY_CONFIG: Record<string, { badge: string; border: string; dot: string }> = {
  General:     { badge: 'bg-gray-100 text-gray-600',     border: 'border-l-gray-300',    dot: 'bg-gray-400' },
  Maintenance: { badge: 'bg-amber-100 text-amber-700',   border: 'border-l-amber-400',   dot: 'bg-amber-400' },
  Event:       { badge: 'bg-purple-100 text-purple-700', border: 'border-l-purple-400',  dot: 'bg-purple-400' },
  Fee:         { badge: 'bg-red-100 text-red-700',       border: 'border-l-red-400',     dot: 'bg-red-400' },
  Emergency:   { badge: 'bg-red-200 text-red-800',       border: 'border-l-red-600',     dot: 'bg-red-600' },
}

const DEFAULT_CONFIG = { badge: 'bg-gray-100 text-gray-600', border: 'border-l-gray-300', dot: 'bg-gray-400' }

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
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
          >
            <Plus size={16} /> New Announcement
          </button>
        }
      />

      {/* New announcement form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #d1fae5' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Megaphone size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">New Announcement</h3>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Content</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-gray-50 focus:bg-white transition-colors"
                placeholder="Announcement details…"
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
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcement cards */}
      <div className="space-y-3">
        {MOCK_ANNOUNCEMENTS.map((a) => {
          const cfg = CATEGORY_CONFIG[a.category] ?? DEFAULT_CONFIG
          return (
            <div
              key={a.id}
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 shadow-sm p-5 hover:shadow-md transition-all duration-200 ${cfg.border}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
                    {a.category}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {a.publishedAt}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-3.5">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2 pl-3.5 font-medium">Published by {a.publishedBy}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

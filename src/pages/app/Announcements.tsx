import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const CATEGORIES = ['All', 'General', 'Maintenance', 'Event', 'Fee']

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026',         category: 'Event',       content: 'Annual hostel fest scheduled for March 20th. Food stalls, cultural programs, and games. All residents are invited. Register by March 15th.', publishedAt: 'Mar 5, 2026' },
  { id: 2, title: 'Water Supply Interruption', category: 'Maintenance', content: 'Water supply will be interrupted on March 10th from 10 AM to 2 PM due to pipeline maintenance. Please store water in advance.',             publishedAt: 'Mar 3, 2026' },
  { id: 3, title: 'April Fee Reminder',         category: 'Fee',         content: 'April fee payment deadline is April 1st. A late charge of ₹200 will be applied after the deadline. Pay online or at the office.',              publishedAt: 'Mar 1, 2026' },
  { id: 4, title: 'New Mess Timings',           category: 'General',     content: 'Effective March 15th, dinner will be served from 7:00 PM to 9:00 PM (previously 6:30 PM to 8:30 PM). Breakfast and lunch timings remain unchanged.', publishedAt: 'Feb 28, 2026' },
  { id: 5, title: 'Gym Hours Extended',         category: 'General',     content: 'The hostel gym will now be open from 5:00 AM to 10:00 PM on weekdays. Weekend hours remain 6:00 AM to 9:00 PM.',                              publishedAt: 'Feb 20, 2026' },
]

const CATEGORY_CONFIG: Record<string, { badge: string; border: string; dot: string }> = {
  General:     { badge: 'bg-gray-100 text-gray-600',    border: 'border-l-gray-300',   dot: 'bg-gray-400' },
  Maintenance: { badge: 'bg-amber-100 text-amber-700',  border: 'border-l-amber-400',  dot: 'bg-amber-400' },
  Event:       { badge: 'bg-purple-100 text-purple-700',border: 'border-l-purple-400', dot: 'bg-purple-400' },
  Fee:         { badge: 'bg-red-100 text-red-700',      border: 'border-l-red-400',    dot: 'bg-red-400' },
}

const DEFAULT_CONFIG = { badge: 'bg-gray-100 text-gray-600', border: 'border-l-gray-300', dot: 'bg-gray-400' }

export default function Announcements() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? MOCK_ANNOUNCEMENTS
    : MOCK_ANNOUNCEMENTS.filter((a) => a.category === activeCategory)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Stay updated with the latest from management"
        count={filtered.length}
      />

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
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

      {/* Announcement cards */}
      <div className="space-y-3">
        {filtered.map((a) => {
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
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Megaphone size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 text-sm">No announcements in this category</p>
            <p className="text-xs text-gray-400 mt-1">Check back later or try a different filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

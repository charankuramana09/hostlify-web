import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'

const CATEGORIES = ['All', 'General', 'Maintenance', 'Event', 'Fee']

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026', category: 'Event', content: 'Annual hostel fest scheduled for March 20th. Food stalls, cultural programs, and games. All residents are invited. Register by March 15th.', publishedAt: 'Mar 5, 2026' },
  { id: 2, title: 'Water Supply Interruption', category: 'Maintenance', content: 'Water supply will be interrupted on March 10th from 10 AM to 2 PM due to pipeline maintenance. Please store water in advance.', publishedAt: 'Mar 3, 2026' },
  { id: 3, title: 'April Fee Reminder', category: 'Fee', content: 'April fee payment deadline is April 1st. A late charge of ₹200 will be applied after the deadline. Pay online or at the office.', publishedAt: 'Mar 1, 2026' },
  { id: 4, title: 'New Mess Timings', category: 'General', content: 'Effective March 15th, dinner will be served from 7:00 PM to 9:00 PM (previously 6:30 PM to 8:30 PM). Breakfast and lunch timings remain unchanged.', publishedAt: 'Feb 28, 2026' },
  { id: 5, title: 'Gym Hours Extended', category: 'General', content: 'The hostel gym will now be open from 5:00 AM to 10:00 PM on weekdays. Weekend hours remain 6:00 AM to 9:00 PM.', publishedAt: 'Feb 20, 2026' },
]

const CATEGORY_COLORS: Record<string, string> = {
  General: 'bg-gray-100 text-gray-600',
  Maintenance: 'bg-amber-100 text-amber-700',
  Event: 'bg-purple-100 text-purple-700',
  Fee: 'bg-red-100 text-red-700',
}

export default function Announcements() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? MOCK_ANNOUNCEMENTS
    : MOCK_ANNOUNCEMENTS.filter((a) => a.category === activeCategory)

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" subtitle="Stay updated with the latest from management" />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[a.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {a.category}
                </span>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.publishedAt}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm">No announcements in this category.</p>
        )}
      </div>
    </div>
  )
}

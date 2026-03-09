import { Link } from 'react-router-dom'
import { CreditCard, Home, Building2, Bell, ChevronRight } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026', date: 'Mar 5, 2026', preview: 'Annual hostel fest scheduled for March 20th. All residents are invited.' },
  { id: 2, title: 'Water Supply Interruption', date: 'Mar 3, 2026', preview: 'Water supply will be interrupted on March 10th from 10 AM to 2 PM.' },
  { id: 3, title: 'Fee Reminder', date: 'Mar 1, 2026', preview: 'April fee payment deadline is April 1st. Please pay on time to avoid late charges.' },
]

const QUICK_LINKS = [
  { label: 'My Dues', to: '/app/dues', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
  { label: 'Complaints', to: '/app/complaints', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { label: 'Leave', to: '/app/leave', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { label: 'Menu', to: '/app/menu', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { label: 'Service', to: '/app/service', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
  { label: 'Referral', to: '/app/referral', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your hostel at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Due"
          value="₹5,000"
          sub="Due in 23 days · Apr 1, 2026"
          icon={<CreditCard size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="My Room"
          value="A-101"
          sub="Block A, Floor 1"
          icon={<Home size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Hostel"
          value="Sunrise Hostel"
          sub="Active Resident"
          icon={<Building2 size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Dues hero card */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm font-medium">Current Outstanding</p>
        <p className="text-4xl font-bold mt-1">₹5,000</p>
        <p className="text-indigo-200 text-sm mt-1">Due by April 1, 2026 · 23 days left</p>
        <Link
          to="/app/dues"
          className="inline-flex items-center gap-1.5 mt-4 bg-white text-indigo-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
        >
          Pay Now <ChevronRight size={15} />
        </Link>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Bell size={16} />
            <h2 className="font-semibold">Recent Announcements</h2>
          </div>
          <Link to="/app/announcements" className="text-indigo-600 text-sm hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_ANNOUNCEMENTS.map((a) => (
            <div key={a.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{a.preview}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className={`${q.color} rounded-xl p-4 text-sm font-medium text-center transition-colors`}
            >
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

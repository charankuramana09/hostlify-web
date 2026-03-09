import { Users, Home, ClipboardList, MessageSquare, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'

const RECENT_ACTIVITY = [
  { id: 1, text: 'Ravi Kumar allocated to room B-204', time: '2h ago', type: 'ALLOCATED' },
  { id: 2, text: 'Complaint #12 marked IN_PROGRESS', time: '4h ago', type: 'IN_PROGRESS' },
  { id: 3, text: 'Cash payment recorded for Priya Singh', time: '5h ago', type: 'PAID' },
  { id: 4, text: 'New leave request from Anil Mehta', time: '6h ago', type: 'PENDING' },
  { id: 5, text: 'Expense ₹2,400 added – Cleaning supplies', time: '1d ago', type: 'OPEN' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Hostel operations overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Occupancy"
          value="98 / 120"
          sub="22 rooms available"
          icon={<Home size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Pending Allocations"
          value="5"
          sub="Awaiting room assignment"
          icon={<ClipboardList size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Open Complaints"
          value="8"
          sub="3 in progress"
          icon={<MessageSquare size={20} className="text-red-500" />}
          iconBg="bg-red-50"
        />
        <StatCard
          label="Monthly Revenue"
          value="₹4,90,000"
          sub="April 2026"
          icon={<TrendingUp size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
      </div>

      {/* Occupancy bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Occupancy Rate</h2>
          <span className="text-sm font-medium text-emerald-600">81.7%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: '81.7%' }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0</span>
          <span>98 occupied · 22 available · 120 total</span>
          <span>120</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Pending Allocations', to: '/admin/allocations', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
              { label: 'Record Payment', to: '/admin/payments', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              { label: 'View Complaints', to: '/admin/complaints', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
              { label: 'Post Announcement', to: '/admin/announcements', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
            ].map((q) => (
              <a key={q.to} href={q.to} className={`${q.color} rounded-lg px-4 py-3 text-sm font-medium text-center transition-colors`}>
                {q.label}
              </a>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Users size={16} className="text-gray-500" />
            <h2 className="font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge status={a.type} />
                  <p className="text-sm text-gray-700">{a.text}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

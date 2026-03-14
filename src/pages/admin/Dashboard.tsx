import { Link } from 'react-router-dom'
import { Users, Home, ClipboardList, MessageSquare, TrendingUp, ChevronRight } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'

const RECENT_ACTIVITY = [
  { id: 1, text: 'Ravi Kumar allocated to room B-204',       time: '2h ago', type: 'ALLOCATED' },
  { id: 2, text: 'Complaint #12 marked IN_PROGRESS',         time: '4h ago', type: 'IN_PROGRESS' },
  { id: 3, text: 'Cash payment recorded for Priya Singh',    time: '5h ago', type: 'PAID' },
  { id: 4, text: 'New leave request from Anil Mehta',        time: '6h ago', type: 'PENDING' },
  { id: 5, text: 'Expense ₹2,400 added – Cleaning supplies', time: '1d ago', type: 'OPEN' },
]

const QUICK_ACTIONS = [
  { label: 'Pending Allocations', to: '/admin/allocations', bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700',   icon: ClipboardList },
  { label: 'Record Payment',      to: '/admin/payments',    bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: TrendingUp },
  { label: 'View Complaints',     to: '/admin/complaints',  bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-600',     icon: MessageSquare },
  { label: 'Post Announcement',   to: '/admin/announcements',bg: 'bg-indigo-50', border: 'border-indigo-100',  text: 'text-indigo-700',  icon: Users },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Staff Portal 👋</p>
        <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Hostel Operations Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Sunrise Hostel · Today's summary</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Occupancy"
          value="98 / 120"
          sub="22 rooms available"
          icon={<Home size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend={{ value: '81.7%', up: true }}
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
          trend={{ value: '+4.2%', up: true }}
        />
      </div>

      {/* Occupancy bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Home size={14} className="text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Occupancy Rate</h2>
          </div>
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">81.7%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: '81.7%', background: 'linear-gradient(90deg, #059669, #34d399)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span className="font-medium">0 beds</span>
          <span className="text-gray-500 font-medium">98 occupied · 22 available · 120 total</span>
          <span className="font-medium">120 beds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
              <ChevronRight size={14} className="text-gray-500" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm ${q.bg} ${q.border}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm shrink-0 ${q.text}`}>
                  <q.icon size={15} />
                </div>
                <span className={`text-xs font-semibold leading-tight ${q.text}`}>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users size={13} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/70 transition-colors">
                <Badge status={a.type} />
                <p className="text-sm text-gray-700 flex-1 truncate">{a.text}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { CreditCard, Home, Building2, Bell, ChevronRight, UtensilsCrossed, Megaphone, Wrench, Gift, CalendarClock, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Hostel Fest 2026', date: 'Mar 5', preview: 'Annual fest on March 20th. Food stalls, cultural programs and games.', category: 'Event' },
  { id: 2, title: 'Water Supply Interruption', date: 'Mar 3', preview: 'Water supply interrupted on March 10th, 10 AM – 2 PM.', category: 'Maintenance' },
  { id: 3, title: 'April Fee Reminder', date: 'Mar 1', preview: 'Fee deadline is April 1st. Late charge of ₹200 applies after.', category: 'Fee' },
]

const CATEGORY_DOT: Record<string, string> = {
  Event: 'bg-purple-400',
  Maintenance: 'bg-amber-400',
  Fee: 'bg-red-400',
  General: 'bg-blue-400',
}

const QUICK_LINKS = [
  { label: 'My Dues',    to: '/app/dues',       icon: CreditCard,      bg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  border: 'border-indigo-100' },
  { label: 'Complaints', to: '/app/complaints', icon: AlertCircle,     bg: 'bg-amber-50',   iconColor: 'text-amber-600',   border: 'border-amber-100' },
  { label: 'Leave',      to: '/app/leave',      icon: CalendarClock,   bg: 'bg-rose-50',    iconColor: 'text-rose-600',    border: 'border-rose-100' },
  { label: 'Menu',       to: '/app/menu',       icon: UtensilsCrossed, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
  { label: 'Service',    to: '/app/service',    icon: Wrench,          bg: 'bg-sky-50',     iconColor: 'text-sky-600',     border: 'border-sky-100' },
  { label: 'Referral',   to: '/app/referral',   icon: Gift,            bg: 'bg-violet-50',  iconColor: 'text-violet-600',  border: 'border-violet-100' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3aaee8, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Welcome back, Arjun 👋</p>
        <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Your Hostel at a Glance</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Sunrise Hostel · Room A-101 · Active Resident</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Due"
          value="₹5,000"
          sub="Due in 23 days · Apr 1, 2026"
          icon={<CreditCard size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          trend={{ value: 'On time', up: true }}
        />
        <StatCard
          label="My Room"
          value="A-101"
          sub="Block A · Floor 1"
          icon={<Home size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Hostel"
          value="Sunrise"
          sub="Active Resident · Sep 2025"
          icon={<Building2 size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Upcoming payment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ background: '#fffbf0', borderBottom: '1px solid #fef3c7' }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
          <p className="text-sm font-semibold text-amber-800">Upcoming Payment</p>
          <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            23 days left
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Hostel Fee – April 2026</p>
            <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">₹5,000</p>
          </div>
          <Link
            to="/app/dues"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            <CreditCard size={15} /> Pay Now <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Announcements + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Announcements */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Megaphone size={13} className="text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-800 text-sm">Announcements</h2>
            </div>
            <Link
              to="/app/announcements"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                <div className="flex items-start gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${CATEGORY_DOT[a.category] ?? 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-800 text-sm truncate">{a.title}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                <Bell size={13} className="text-gray-500" />
              </div>
              <h2 className="font-semibold text-gray-800 text-sm">Quick Access</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm ${q.bg} ${q.border}`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm ${q.iconColor}`}>
                    <q.icon size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

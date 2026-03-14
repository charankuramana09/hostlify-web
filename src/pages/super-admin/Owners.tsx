import { useNavigate } from 'react-router-dom'
import { Users, Plus } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'

const MOCK_OWNERS = [
  { id: 1, name: 'Vikram Mehta',  email: 'vikram@sunrise.com',  phone: '9876500001', hostels: 2, members: 170, plan: 'PROFESSIONAL', status: 'ACTIVE',    since: 'Jan 2025', revenue: 1125000 },
  { id: 2, name: 'Priya Nair',    email: 'priya@greenval.com',  phone: '9876500002', hostels: 1, members: 72,  plan: 'STARTER',      status: 'ACTIVE',    since: 'Mar 2025', revenue: 360000 },
  { id: 3, name: 'Arun Krishnan', email: 'arun@blueridge.com',  phone: '9876500003', hostels: 1, members: 55,  plan: 'STARTER',      status: 'SUSPENDED', since: 'Jun 2024', revenue: 275000 },
  { id: 4, name: 'Deepa Shetty',  email: 'deepa@cozyrooms.com', phone: '9876500004', hostels: 3, members: 240, plan: 'ENTERPRISE',   status: 'ACTIVE',    since: 'Aug 2024', revenue: 1800000 },
]

const PLAN_CHIP: Record<string, string> = {
  STARTER: 'bg-gray-100 text-gray-600',
  PROFESSIONAL: 'bg-indigo-50 text-indigo-700',
  ENTERPRISE: 'bg-violet-50 text-violet-700',
}

const AVATAR_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Owners() {
  const navigate = useNavigate()
  const totalActive = MOCK_OWNERS.filter((o) => o.status === 'ACTIVE').length
  const totalSuspended = MOCK_OWNERS.filter((o) => o.status === 'SUSPENDED').length

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Super Admin</p>
            <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Owners</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {MOCK_OWNERS.length} registered owners across {new Set(MOCK_OWNERS.map(() => 'platform')).size} platform
            </p>
          </div>
          <button
            onClick={() => navigate('/super-admin/owners/create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/20 text-white transition-colors border border-white/20 shrink-0"
          >
            <Plus size={15} /> Create Owner
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Owners"
          value={MOCK_OWNERS.length}
          sub="Registered on platform"
          icon={<Users size={20} className="text-violet-600" />}
          iconBg="bg-violet-50"
        />
        <StatCard
          label="Active"
          value={totalActive}
          sub="Accounts in good standing"
          icon={<Users size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Suspended"
          value={totalSuspended}
          sub="Accounts on hold"
          icon={<Users size={20} className="text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Owners Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <Users size={14} className="text-violet-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">All Owners</h2>
          <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {MOCK_OWNERS.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hostels</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Members</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_OWNERS.map((o, i) => (
                <tr
                  key={o.id}
                  className={`hover:bg-gray-50/70 transition-colors ${o.status === 'SUSPENDED' ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {getInitials(o.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{o.name}</p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PLAN_CHIP[o.plan] ?? 'bg-gray-100 text-gray-600'}`}>
                      {o.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{o.hostels}</td>
                  <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{o.members}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-gray-900">
                    ₹{(o.revenue / 100000).toFixed(2)}L
                  </td>
                  <td className="px-5 py-3.5"><Badge status={o.status} /></td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/super-admin/owners/${o.id}`)}
                      className="px-3 py-1.5 text-xs font-semibold text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

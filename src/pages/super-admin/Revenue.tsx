import { Download, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

const MOCK_OWNER_REVENUE = [
  { owner: 'Deepa Shetty',  plan: 'ENTERPRISE',   hostels: 3, members: 240, collected: 1620000, outstanding: 180000, rate: 90 },
  { owner: 'Vikram Mehta',  plan: 'PROFESSIONAL', hostels: 2, members: 170, collected: 1012500, outstanding: 112500, rate: 90 },
  { owner: 'Priya Nair',    plan: 'STARTER',       hostels: 1, members: 72,  collected: 338400,  outstanding: 21600,  rate: 94 },
  { owner: 'Arun Krishnan', plan: 'STARTER',       hostels: 1, members: 55,  collected: 220000,  outstanding: 55000,  rate: 80 },
]

const MONTHLY = [
  { month: 'Oct', amount: 2400000 },
  { month: 'Nov', amount: 2650000 },
  { month: 'Dec', amount: 2580000 },
  { month: 'Jan', amount: 3020000 },
  { month: 'Feb', amount: 2980000 },
  { month: 'Mar', amount: 3190900, current: true },
]

const PLAN_CHIP: Record<string, string> = {
  STARTER: 'bg-gray-100 text-gray-600',
  PROFESSIONAL: 'bg-indigo-50 text-indigo-700',
  ENTERPRISE: 'bg-violet-50 text-violet-700',
}

const maxAmount = Math.max(...MONTHLY.map((m) => m.amount))

export default function Revenue() {
  const currentMonth = MONTHLY.find((m) => m.current)
  const totalCollected = MOCK_OWNER_REVENUE.reduce((s, r) => s + r.collected, 0)
  const avgRate = Math.round(MOCK_OWNER_REVENUE.reduce((s, r) => s + r.rate, 0) / MOCK_OWNER_REVENUE.length)
  const activeOwners = MOCK_OWNER_REVENUE.length

  return (
    <div className="space-y-6">
      {/* Gradient Banner */}
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
            <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Revenue</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Platform-wide revenue overview · March 2026
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/20 text-white transition-colors border border-white/20 shrink-0">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Platform Revenue"
          value={`₹${((currentMonth?.amount ?? 0) / 100000).toFixed(2)}L`}
          sub="March 2026 · all hostels"
          icon={<TrendingUp size={20} className="text-violet-600" />}
          iconBg="bg-violet-50"
          trend={{ value: '+7.1%', up: true }}
        />
        <StatCard
          label="Collection Rate"
          value={`${avgRate}%`}
          sub="Average across all owners"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Active Owners"
          value={activeOwners}
          sub="Contributing to revenue"
          icon={<TrendingUp size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
      </div>

      {/* Owner Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <TrendingUp size={14} className="text-violet-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Owner Revenue Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Owner</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hostels</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Members</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Collected</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Outstanding</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_OWNER_REVENUE.map((r) => (
                <tr key={r.owner} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800">{r.owner}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PLAN_CHIP[r.plan] ?? 'bg-gray-100 text-gray-600'}`}>
                      {r.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-medium text-gray-700">{r.hostels}</td>
                  <td className="px-5 py-3.5 text-center font-medium text-gray-700">{r.members}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-700">
                    ₹{(r.collected / 100000).toFixed(2)}L
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-red-500">
                    ₹{(r.outstanding / 100000).toFixed(2)}L
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${r.rate}%`,
                            background: r.rate >= 90
                              ? 'linear-gradient(90deg, #059669, #34d399)'
                              : r.rate >= 80
                                ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                                : 'linear-gradient(90deg, #d97706, #fbbf24)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{r.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={3} className="px-5 py-3.5 font-bold text-gray-700">Platform Total</td>
                <td className="px-5 py-3.5 text-right font-bold text-emerald-700 text-base">
                  ₹{(totalCollected / 100000).toFixed(2)}L
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-red-500">
                  ₹{(MOCK_OWNER_REVENUE.reduce((s, r) => s + r.outstanding, 0) / 100000).toFixed(2)}L
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-bold text-violet-700">{avgRate}% avg</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Monthly Trend Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <TrendingUp size={14} className="text-violet-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Monthly Revenue Trend</h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">Oct 2025 – Mar 2026</span>
        </div>
        <div className="flex items-end gap-3 h-36">
          {MONTHLY.map((m) => {
            const heightPct = Math.round((m.amount / maxAmount) * 100)
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-500">
                  ₹{(m.amount / 100000).toFixed(1)}L
                </span>
                <div className="w-full flex items-end" style={{ height: '80px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${heightPct}%`,
                      background: (m as { current?: boolean }).current
                        ? 'linear-gradient(180deg, #7c3aed, #a78bfa)'
                        : 'linear-gradient(180deg, #e0e7ff, #c7d2fe)',
                    }}
                  />
                </div>
                <span className={`text-xs font-semibold ${(m as { current?: boolean }).current ? 'text-violet-700' : 'text-gray-400'}`}>
                  {m.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

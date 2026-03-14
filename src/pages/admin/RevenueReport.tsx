import { TrendingUp, Download, IndianRupee, Users, BarChart3 } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

interface HostelBreakdown {
  hostel: string
  city: string
  members: number
  totalDue: number
  collected: number
  outstanding: number
  rate: number
}

interface MonthlyData {
  month: string
  amount: number
  current?: boolean
}

const MOCK_HOSTEL_BREAKDOWN: HostelBreakdown[] = [
  { hostel: 'Sunrise Hostel', city: 'Bangalore', members: 98, totalDue: 490000, collected: 441000, outstanding: 49000, rate: 90 },
  { hostel: 'Green Valley Hostel', city: 'Hyderabad', members: 72, totalDue: 360000, collected: 338400, outstanding: 21600, rate: 94 },
  { hostel: 'Blue Ridge Hostel', city: 'Chennai', members: 55, totalDue: 275000, collected: 244750, outstanding: 30250, rate: 89 },
]

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Oct', amount: 850000 },
  { month: 'Nov', amount: 920000 },
  { month: 'Dec', amount: 880000 },
  { month: 'Jan', amount: 1020000 },
  { month: 'Feb', amount: 980000 },
  { month: 'Mar', amount: 1125000, current: true },
]

function formatINR(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function RevenueReport() {
  const maxAmount = Math.max(...MONTHLY_DATA.map((d) => d.amount))
  const totalCollected = MOCK_HOSTEL_BREAKDOWN.reduce((s, h) => s + h.collected, 0)
  const totalMembers = MOCK_HOSTEL_BREAKDOWN.reduce((s, h) => s + h.members, 0)
  const avgCollectionRate = Math.round(
    MOCK_HOSTEL_BREAKDOWN.reduce((s, h) => s + h.rate, 0) / MOCK_HOSTEL_BREAKDOWN.length
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Report"
        subtitle="Collection analytics across all hostels"
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Download size={14} />
            Export PDF
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatINR(totalCollected)}
          sub="Mar 2026"
          icon={<IndianRupee size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend={{ value: '+14.8%', up: true }}
        />
        <StatCard
          label="Collection Rate"
          value={`${avgCollectionRate}%`}
          sub="Across all hostels"
          icon={<TrendingUp size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          trend={{ value: '+2.1%', up: true }}
        />
        <StatCard
          label="Avg per Member"
          value="₹5,000"
          sub={`${totalMembers} active members`}
          icon={<Users size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostel Breakdown Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <IndianRupee size={13} className="text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Hostel Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hostel</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Members</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Collected</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Outstanding</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_HOSTEL_BREAKDOWN.map((h) => (
                  <tr key={h.hostel} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-xs leading-tight">{h.hostel}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{h.city}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs font-medium text-gray-600">{h.members}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs font-bold text-emerald-600">{formatINR(h.collected)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs font-bold text-red-500">{formatINR(h.outstanding)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${h.rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{h.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart3 size={13} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Monthly Revenue Trend</h2>
          </div>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_DATA.map((d) => {
              const heightPct = (d.amount / maxAmount) * 100
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all group-hover:opacity-80 ${
                        d.current
                          ? 'opacity-100'
                          : 'opacity-70'
                      }`}
                      style={{
                        height: `${heightPct}%`,
                        background: d.current
                          ? 'linear-gradient(180deg, #059669, #34d399)'
                          : 'linear-gradient(180deg, #6366f1, #818cf8)',
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {formatINR(d.amount)}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${d.current ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Hover bars to see amounts · Current month highlighted in green</p>
        </div>
      </div>
    </div>
  )
}

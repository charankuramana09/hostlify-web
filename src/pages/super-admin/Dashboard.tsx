import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

const MOCK_HOSTELS = [
  { id: 1, name: 'Sunrise Hostel',      city: 'Bangalore', total: 120, occupied: 98,  revenue: 490000 },
  { id: 2, name: 'Green Valley Hostel', city: 'Hyderabad', total: 80,  occupied: 72,  revenue: 360000 },
  { id: 3, name: 'Blue Ridge Hostel',   city: 'Chennai',   total: 60,  occupied: 55,  revenue: 275000 },
]

const totalOccupied  = MOCK_HOSTELS.reduce((s, h) => s + h.occupied, 0)
const totalCapacity  = MOCK_HOSTELS.reduce((s, h) => s + h.total, 0)
const totalRevenue   = MOCK_HOSTELS.reduce((s, h) => s + h.revenue, 0)

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #7c3aed 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Super Admin 👋</p>
        <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Network Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {MOCK_HOSTELS.length} hostels across {new Set(MOCK_HOSTELS.map(h => h.city)).size} cities
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Hostels"
          value={MOCK_HOSTELS.length}
          sub="Across 3 cities"
          icon={<Building2 size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Total Residents"
          value={totalOccupied}
          sub={`${totalCapacity - totalOccupied} beds available`}
          icon={<Users size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          trend={{ value: `${Math.round((totalOccupied / totalCapacity) * 100)}% full`, up: true }}
        />
        <StatCard
          label="Monthly Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          sub="April 2026 · All hostels"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend={{ value: '+3.8%', up: true }}
        />
        <StatCard
          label="Open Complaints"
          value="21"
          sub="Across all hostels"
          icon={<AlertCircle size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Hostel breakdown table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Building2 size={14} className="text-purple-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Hostel Breakdown</h2>
          <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {MOCK_HOSTELS.length} hostels
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hostel</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Occupancy</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rate</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_HOSTELS.map((h) => {
                const rate = Math.round((h.occupied / h.total) * 100)
                return (
                  <tr key={h.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                        >
                          {h.name[0]}
                        </div>
                        <p className="font-semibold text-gray-800">{h.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-medium">{h.city}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${rate}%`,
                              background: rate >= 80
                                ? 'linear-gradient(90deg, #059669, #34d399)'
                                : 'linear-gradient(90deg, #d97706, #fbbf24)',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                          {h.occupied}/{h.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          rate >= 80
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-900">
                      ₹{h.revenue.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={2} className="px-5 py-3.5 font-bold text-gray-700">Total</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-28 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.round((totalOccupied / totalCapacity) * 100)}%`,
                          background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-semibold">
                      {totalOccupied}/{totalCapacity}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                    {Math.round((totalOccupied / totalCapacity) * 100)}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-gray-900 text-base">
                  ₹{totalRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

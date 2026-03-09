import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

const MOCK_HOSTELS = [
  { id: 1, name: 'Sunrise Hostel', city: 'Bangalore', total: 120, occupied: 98, revenue: 490000 },
  { id: 2, name: 'Green Valley Hostel', city: 'Hyderabad', total: 80, occupied: 72, revenue: 360000 },
  { id: 3, name: 'Blue Ridge Hostel', city: 'Chennai', total: 60, occupied: 55, revenue: 275000 },
]

const totalOccupied = MOCK_HOSTELS.reduce((s, h) => s + h.occupied, 0)
const totalCapacity = MOCK_HOSTELS.reduce((s, h) => s + h.total, 0)
const totalRevenue = MOCK_HOSTELS.reduce((s, h) => s + h.revenue, 0)

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview across all hostels.</p>
      </div>

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
        />
        <StatCard
          label="Monthly Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          sub="April 2026 · All hostels"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Open Complaints"
          value="21"
          sub="Across all hostels"
          icon={<AlertCircle size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Hostel-wise breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Hostel Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Hostel</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">City</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Occupancy</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Rate</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_HOSTELS.map((h) => {
                const rate = Math.round((h.occupied / h.total) * 100)
                return (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-800">{h.name}</td>
                    <td className="px-5 py-4 text-gray-600">{h.city}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-xs">{h.occupied}/{h.total}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${rate >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {rate}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">
                      ₹{h.revenue.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={4} className="px-5 py-3 font-semibold text-gray-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

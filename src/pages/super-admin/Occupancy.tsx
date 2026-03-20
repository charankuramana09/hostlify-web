import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { getOccupancyReport } from '../../api/superadmin'

function getRateColor(rate: number) {
  if (rate >= 80) return 'linear-gradient(90deg, #059669, #34d399)'
  if (rate >= 60) return 'linear-gradient(90deg, #d97706, #fbbf24)'
  return 'linear-gradient(90deg, #ef4444, #f87171)'
}

function getRateBadgeClass(rate: number) {
  if (rate >= 80) return 'bg-emerald-50 text-emerald-700'
  if (rate >= 60) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

export default function Occupancy() {
  const { data, isLoading } = useQuery({
    queryKey: ['sa-occupancy'],
    queryFn: getOccupancyReport,
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    )

  const occupancyList: Array<{
    hostel: string
    owner: string
    city: string
    occupied: number
    capacity: number
    rate: number
  }> = (data?.hostels ?? data ?? []).map((h: {
    hostelName?: string
    name?: string
    ownerName?: string
    owner?: string
    city?: string
    occupiedBeds?: number
    occupied?: number
    totalBeds?: number
    capacity?: number
    occupancyRate?: number
    rate?: number
  }) => ({
    hostel: h.hostelName ?? h.name ?? '',
    owner: h.ownerName ?? h.owner ?? '',
    city: h.city ?? '',
    occupied: h.occupiedBeds ?? h.occupied ?? 0,
    capacity: h.totalBeds ?? h.capacity ?? 0,
    rate: h.occupancyRate ?? h.rate ?? (h.totalBeds ?? h.capacity ?? 0) > 0
      ? Math.round(((h.occupiedBeds ?? h.occupied ?? 0) / (h.totalBeds ?? h.capacity ?? 1)) * 100 * 10) / 10
      : 0,
  }))

  const totalBeds = occupancyList.reduce((s, h) => s + h.capacity, 0)
  const totalOccupied = occupancyList.reduce((s, h) => s + h.occupied, 0)
  const avgRate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100 * 10) / 10 : 0

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
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Super Admin</p>
        <h1 className="text-2xl font-bold mt-0.5 tracking-tight">Occupancy</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {totalOccupied} occupied of {totalBeds} total beds · {occupancyList.length} hostels
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Hostels"
          value={occupancyList.length}
          sub="Across the platform"
          icon={<MapPin size={20} className="text-violet-600" />}
          iconBg="bg-violet-50"
        />
        <StatCard
          label="Total Beds"
          value={totalBeds}
          sub={`${totalBeds - totalOccupied} currently available`}
          icon={<MapPin size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Avg Occupancy"
          value={`${avgRate}%`}
          sub="Platform average"
          icon={<MapPin size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend={{ value: `${avgRate}%`, up: avgRate >= 80 }}
        />
      </div>

      {/* Occupancy Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {occupancyList.map((h) => (
          <div key={h.hostel} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{h.hostel}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{h.city} · {h.owner}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRateBadgeClass(h.rate)}`}>
                {h.rate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{ width: `${h.rate}%`, background: getRateColor(h.rate) }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{h.occupied} occupied</span>
              <span>{h.capacity - h.occupied} available · {h.capacity} total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <MapPin size={14} className="text-violet-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Occupancy Summary</h2>
          <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {occupancyList.length} hostels
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hostel</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Occupancy</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {occupancyList.map((h) => (
                <tr key={h.hostel} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{h.hostel}</td>
                  <td className="px-5 py-3.5 text-gray-600">{h.owner}</td>
                  <td className="px-5 py-3.5 text-gray-500">{h.city}</td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {h.occupied} / {h.capacity}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRateBadgeClass(h.rate)}`}>
                      {h.rate}%
                    </span>
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

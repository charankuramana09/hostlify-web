import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Car, X, Bike } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { getHostelParking, updateParkingSlot } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function VehicleTypeChip({ type }: { type: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Car: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    Bike: { bg: 'bg-amber-50', text: 'text-amber-700' },
    Scooter: { bg: 'bg-purple-50', text: 'text-purple-700' },
  }
  const cfg = map[type] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  const Icon = type === 'Car' ? Car : Bike
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon size={11} />
      {type}
    </span>
  )
}

export default function Parking() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newSlot, setNewSlot] = useState('')

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['parking', activeHostelId],
    queryFn: () => getHostelParking(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const updateMut = useMutation({
    mutationFn: ({ recordId, slotNumber }: { recordId: number; slotNumber: string }) =>
      updateParkingSlot(recordId, slotNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking', activeHostelId] })
      setEditingId(null)
      setNewSlot('')
    },
  })

  const occupied = vehicles.filter((v: any) => v.status === 'ACTIVE').length
  const totalSlots = vehicles.length
  const available = Math.max(0, totalSlots - occupied)

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parking Management"
        subtitle="Vehicle registration and slot allocation"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Registered"
          value={totalSlots}
          sub="Registered vehicles"
          icon={<Car size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Active"
          value={occupied}
          sub="Active vehicles"
          icon={<Car size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Inactive"
          value={available}
          sub="Inactive slots"
          icon={<Car size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Vehicle Number</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Slot</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((v: any, i: number) => (
                <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {getInitials(v.hostellerName ?? v.memberName ?? '??')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{v.hostellerName ?? v.memberName}</p>
                        <p className="text-xs text-gray-400 font-mono">{v.roomNumber ?? v.room ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                      {v.vehicleNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <VehicleTypeChip type={v.vehicleType ?? v.type ?? 'Other'} />
                  </td>
                  <td className="px-5 py-3.5">
                    {editingId === v.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="P-XX"
                        />
                        <button
                          onClick={() => updateMut.mutate({ recordId: v.id, slotNumber: newSlot })}
                          disabled={updateMut.isPending || !newSlot}
                          className="text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg transition-all disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setNewSlot('') }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                        {v.slotNumber ?? v.slot ?? '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={v.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => { setEditingId(v.id); setNewSlot(v.slotNumber ?? v.slot ?? '') }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Edit Slot
                    </button>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <Car size={18} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-400 text-sm">No vehicles registered</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

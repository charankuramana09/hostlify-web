import { useState } from 'react'
import { Car, Plus, X, Bike } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

interface Vehicle {
  id: number
  memberName: string
  room: string
  vehicleNumber: string
  type: string
  slot: string
  registeredDate: string
  status: string
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: 1, memberName: 'Arjun Sharma', room: 'A-101', vehicleNumber: 'KA-01-AB-1234', type: 'Car', slot: 'P-01', registeredDate: 'Sep 1, 2025', status: 'ACTIVE' },
  { id: 2, memberName: 'Priya Singh', room: 'A-102', vehicleNumber: 'KA-05-MN-5678', type: 'Scooter', slot: 'P-02', registeredDate: 'Sep 5, 2025', status: 'ACTIVE' },
  { id: 3, memberName: 'Ravi Kumar', room: 'B-201', vehicleNumber: 'KA-02-CD-9012', type: 'Bike', slot: 'P-03', registeredDate: 'Jan 15, 2026', status: 'ACTIVE' },
  { id: 4, memberName: 'Sneha Patel', room: 'B-202', vehicleNumber: 'MH-12-EF-3456', type: 'Car', slot: 'P-04', registeredDate: 'Feb 5, 2026', status: 'ACTIVE' },
  { id: 5, memberName: 'Mohit Verma', room: 'C-301', vehicleNumber: 'KA-03-GH-7890', type: 'Bike', slot: 'P-05', registeredDate: 'Jul 1, 2025', status: 'INACTIVE' },
]

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

interface RegisterForm {
  memberName: string
  vehicleNumber: string
  type: string
  slot: string
  paymentMode: string
}

export default function Parking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<RegisterForm>({
    memberName: '',
    vehicleNumber: '',
    type: 'Car',
    slot: '',
    paymentMode: 'Cash',
  })

  const totalSlots = 5
  const occupied = vehicles.filter((v) => v.status === 'ACTIVE').length
  const available = totalSlots - occupied

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newVehicle: Vehicle = {
      id: Date.now(),
      memberName: form.memberName,
      room: '—',
      vehicleNumber: form.vehicleNumber.toUpperCase(),
      type: form.type,
      slot: form.slot,
      registeredDate: 'Mar 15, 2026',
      status: 'ACTIVE',
    }
    setVehicles((prev) => [...prev, newVehicle])
    setForm({ memberName: '', vehicleNumber: '', type: 'Car', slot: '', paymentMode: 'Cash' })
    setShowForm(false)
  }

  function handleRemove(id: number) {
    setVehicles((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parking Management"
        subtitle="Vehicle registration and slot allocation"
        action={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancel' : 'Register Vehicle'}
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Slots"
          value={totalSlots}
          sub="Parking capacity"
          icon={<Car size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Occupied"
          value={occupied}
          sub="Active vehicles"
          icon={<Car size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Available"
          value={available}
          sub="Open slots"
          icon={<Car size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Register form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-4">Register New Vehicle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Member Name</label>
              <input
                required
                value={form.memberName}
                onChange={(e) => setForm((f) => ({ ...f, memberName: e.target.value }))}
                placeholder="e.g. Arjun Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Vehicle Number</label>
              <input
                required
                value={form.vehicleNumber}
                onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                placeholder="e.g. KA-01-AB-1234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Vehicle Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option>Car</option>
                <option>Bike</option>
                <option>Scooter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Slot Number</label>
              <input
                required
                value={form.slot}
                onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value }))}
                placeholder="e.g. P-06"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Payment Mode</label>
              <select
                value={form.paymentMode}
                onChange={(e) => setForm((f) => ({ ...f, paymentMode: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                Register Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

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
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Registered</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((v, i) => (
                <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {getInitials(v.memberName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{v.memberName}</p>
                        <p className="text-xs text-gray-400 font-mono">{v.room}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                      {v.vehicleNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <VehicleTypeChip type={v.type} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                      {v.slot}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{v.registeredDate}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={v.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleRemove(v.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <X size={12} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
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

import { useState } from 'react'
import { Settings, QrCode, Building2, Save, Plus, ChevronDown, ChevronRight, Pencil } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

interface HostelSettings {
  hostelName: string
  address: string
  city: string
  locality: string
  type: string
  contact: string
  defaultRent: number
  advanceMonths: number
}

interface RoomSetting {
  number: string
  type: string
  totalBeds: number
  occupiedBeds: number
}

interface FloorSetting {
  id: number
  name: string
  rooms: RoomSetting[]
}

const MOCK_SETTINGS: HostelSettings = {
  hostelName: 'Sunrise Hostel',
  address: '42, MG Road, Koramangala',
  city: 'Bangalore',
  locality: 'Koramangala',
  type: 'Gents Only',
  contact: '9876543000',
  defaultRent: 5000,
  advanceMonths: 2,
}

const MOCK_FLOORS: FloorSetting[] = [
  {
    id: 1,
    name: 'Ground Floor',
    rooms: [
      { number: 'G-01', type: 'Double', totalBeds: 2, occupiedBeds: 2 },
      { number: 'G-02', type: 'Triple', totalBeds: 3, occupiedBeds: 2 },
      { number: 'G-03', type: 'Single', totalBeds: 1, occupiedBeds: 1 },
    ],
  },
  {
    id: 2,
    name: 'First Floor',
    rooms: [
      { number: 'F-01', type: 'Double', totalBeds: 2, occupiedBeds: 2 },
      { number: 'F-02', type: 'Triple', totalBeds: 3, occupiedBeds: 1 },
    ],
  },
]

type TabType = 'general' | 'qr' | 'floors'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [settings, setSettings] = useState<HostelSettings>(MOCK_SETTINGS)
  const [floors, setFloors] = useState<FloorSetting[]>(MOCK_FLOORS)
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set([1]))
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleFloor(id: number) {
    setExpandedFloors((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddFloor() {
    const newFloor: FloorSetting = {
      id: Date.now(),
      name: `Floor ${floors.length + 1}`,
      rooms: [],
    }
    setFloors((prev) => [...prev, newFloor])
  }

  const tabs: { key: TabType; label: string; icon: typeof Settings }[] = [
    { key: 'general', label: 'General', icon: Settings },
    { key: 'qr', label: 'QR Code', icon: QrCode },
    { key: 'floors', label: 'Floors & Rooms', icon: Building2 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel Settings"
        subtitle="Configure your hostel details and structure"
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-sm mb-5">Hostel Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hostel Name</label>
                <input
                  value={settings.hostelName}
                  onChange={(e) => setSettings((s) => ({ ...s, hostelName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Address</label>
                <input
                  value={settings.address}
                  onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">City</label>
                <input
                  value={settings.city}
                  onChange={(e) => setSettings((s) => ({ ...s, city: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Locality</label>
                <input
                  value={settings.locality}
                  onChange={(e) => setSettings((s) => ({ ...s, locality: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hostel Type</label>
                <select
                  value={settings.type}
                  onChange={(e) => setSettings((s) => ({ ...s, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option>Gents Only</option>
                  <option>Ladies Only</option>
                  <option>Co-ed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Contact Number</label>
                <input
                  value={settings.contact}
                  onChange={(e) => setSettings((s) => ({ ...s, contact: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Default Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={settings.defaultRent}
                  onChange={(e) => setSettings((s) => ({ ...s, defaultRent: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Advance Months</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={settings.advanceMonths}
                  onChange={(e) => setSettings((s) => ({ ...s, advanceMonths: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                <Save size={14} />
                Save Changes
              </button>
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  Saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* QR Code Tab */}
      {activeTab === 'qr' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-sm mb-1">Registration QR Code</h3>
          <p className="text-xs text-gray-400 mb-6">Share this QR code with prospective members to register online.</p>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 bg-gray-50"
              >
                <QrCode size={56} className="text-gray-300" />
                <span className="text-xs text-gray-400 font-medium">QR Code</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Scan to Register</p>
              <p className="text-xs text-gray-400 text-center max-w-xs">
                Members can scan this code to start their hostel registration process online.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                Download QR
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floors & Rooms Tab */}
      {activeTab === 'floors' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddFloor}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
            >
              <Plus size={14} />
              Add Floor
            </button>
          </div>
          {floors.map((floor) => {
            const isExpanded = expandedFloors.has(floor.id)
            const totalBeds = floor.rooms.reduce((s, r) => s + r.totalBeds, 0)
            return (
              <div key={floor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFloor(floor.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Building2 size={14} className="text-emerald-600" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{floor.name}</span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {floor.rooms.length} rooms
                    </span>
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      {totalBeds} beds
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                </button>
                {isExpanded && floor.rooms.length > 0 && (
                  <div className="border-t border-gray-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Room</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Occupancy</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Beds</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {floor.rooms.map((room) => (
                          <tr key={room.number} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-5 py-3">
                              <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                                {room.number}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-xs font-medium text-gray-600">{room.type}</td>
                            <td className="px-5 py-3">
                              <span className="text-xs font-semibold text-gray-700">
                                {room.occupiedBeds}/{room.totalBeds}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex gap-1">
                                {Array.from({ length: room.totalBeds }).map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-4 h-4 rounded-sm ${idx < room.occupiedBeds ? 'bg-indigo-400' : 'bg-gray-200'}`}
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {isExpanded && floor.rooms.length === 0 && (
                  <div className="border-t border-gray-50 px-5 py-6 text-center text-xs text-gray-400">
                    No rooms added yet.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

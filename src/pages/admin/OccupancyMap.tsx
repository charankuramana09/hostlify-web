import { Building2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

interface Bed {
  id: number
  status: 'occupied' | 'available' | 'reserved'
  member?: string
}

interface Room {
  number: string
  type: string
  beds: Bed[]
}

interface Floor {
  id: number
  name: string
  rooms: Room[]
}

const FLOORS: Floor[] = [
  {
    id: 1,
    name: 'Ground Floor',
    rooms: [
      { number: 'G-01', type: 'Double', beds: [{ id: 1, status: 'occupied', member: 'Arjun S.' }, { id: 2, status: 'available' }] },
      { number: 'G-02', type: 'Triple', beds: [{ id: 3, status: 'occupied', member: 'Priya M.' }, { id: 4, status: 'occupied', member: 'Ravi K.' }, { id: 5, status: 'available' }] },
      { number: 'G-03', type: 'Single', beds: [{ id: 6, status: 'reserved' }] },
      { number: 'G-04', type: 'Double', beds: [{ id: 7, status: 'available' }, { id: 8, status: 'available' }] },
    ],
  },
  {
    id: 2,
    name: 'First Floor',
    rooms: [
      { number: 'F-01', type: 'Double', beds: [{ id: 9, status: 'occupied', member: 'Sneha P.' }, { id: 10, status: 'occupied', member: 'Ananya I.' }] },
      { number: 'F-02', type: 'Triple', beds: [{ id: 11, status: 'occupied', member: 'Mohit V.' }, { id: 12, status: 'available' }, { id: 13, status: 'available' }] },
      { number: 'F-03', type: 'Double', beds: [{ id: 14, status: 'occupied', member: 'Kavya R.' }, { id: 15, status: 'reserved' }] },
      { number: 'F-04', type: 'Single', beds: [{ id: 16, status: 'available' }] },
    ],
  },
  {
    id: 3,
    name: 'Second Floor',
    rooms: [
      { number: 'S-01', type: 'Triple', beds: [{ id: 17, status: 'occupied', member: 'Rahul D.' }, { id: 18, status: 'occupied', member: 'Nikhil T.' }, { id: 19, status: 'available' }] },
      { number: 'S-02', type: 'Double', beds: [{ id: 20, status: 'available' }, { id: 21, status: 'available' }] },
      { number: 'S-03', type: 'Double', beds: [{ id: 22, status: 'occupied', member: 'Pooja S.' }, { id: 23, status: 'occupied', member: 'Divya M.' }] },
    ],
  },
]

const STATUS_CONFIG = {
  occupied: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', label: 'Occupied' },
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Available' },
  reserved: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', label: 'Reserved' },
}

function FloorCard({ floor }: { floor: Floor }) {
  const allBeds = floor.rooms.flatMap((r) => r.beds)
  const totalBeds = allBeds.length
  const occupiedBeds = allBeds.filter((b) => b.status === 'occupied').length
  const availableBeds = allBeds.filter((b) => b.status === 'available').length
  const reservedBeds = allBeds.filter((b) => b.status === 'reserved').length
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Floor header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Building2 size={15} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">{floor.name}</h3>
            <p className="text-xs text-gray-400">{floor.rooms.length} rooms · {totalBeds} beds</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{occupiedBeds} Occupied</span>
          <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{availableBeds} Available</span>
          {reservedBeds > 0 && (
            <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{reservedBeds} Reserved</span>
          )}
        </div>
      </div>

      {/* Occupancy progress */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400 font-medium">Occupancy</span>
          <span className="text-xs font-bold text-emerald-600">{occupancyPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${occupancyPct}%`, background: 'linear-gradient(90deg, #059669, #34d399)' }}
          />
        </div>
      </div>

      {/* Room grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {floor.rooms.map((room) => (
          <div key={room.number} className="bg-gray-50 rounded-xl border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-lg tracking-wider">
                {room.number}
              </span>
              <span className="text-xs text-gray-400 font-medium bg-white border border-gray-100 px-1.5 py-0.5 rounded-md">
                {room.type}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {room.beds.map((bed) => {
                const cfg = STATUS_CONFIG[bed.status]
                return (
                  <div
                    key={bed.id}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                    <span className="truncate">{bed.member ?? 'Free'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OccupancyMap() {
  const totalBeds = FLOORS.flatMap((f) => f.rooms).flatMap((r) => r.beds).length
  const occupiedBeds = FLOORS.flatMap((f) => f.rooms).flatMap((r) => r.beds).filter((b) => b.status === 'occupied').length
  const availableBeds = FLOORS.flatMap((f) => f.rooms).flatMap((r) => r.beds).filter((b) => b.status === 'available').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Occupancy Map"
        subtitle={`${occupiedBeds} of ${totalBeds} beds occupied · ${availableBeds} available`}
      />

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Legend:</span>
        {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
          <div
            key={key}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Floor cards */}
      <div className="space-y-5">
        {FLOORS.map((floor) => (
          <FloorCard key={floor.id} floor={floor} />
        ))}
      </div>
    </div>
  )
}

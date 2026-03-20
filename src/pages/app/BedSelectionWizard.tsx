import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, BedDouble, Layers, DoorOpen, CheckCircle2, CalendarDays, AlignLeft } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import {
  getFloorsWithAvailability,
  getRoomsWithAvailability,
  getBedsByRoom,
  submitBookingRequest,
} from '../../api/hosteller'

const STEPS = ['Floor', 'Room', 'Bed', 'Confirm'] as const
type Step = 0 | 1 | 2 | 3

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )
}

function Stepper({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : active
                    ? 'bg-white border-indigo-600 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-semibold whitespace-nowrap ${active ? 'text-indigo-700' : done ? 'text-indigo-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${i < current ? 'bg-indigo-500' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Floor ────────────────────────────────────────────────────────────
function FloorStep({
  hostelId,
  onSelect,
}: {
  hostelId: number
  onSelect: (floor: any) => void
}) {
  const { data: floors = [], isLoading } = useQuery({
    queryKey: ['floors-availability', hostelId],
    queryFn: () => getFloorsWithAvailability(hostelId),
    enabled: !!hostelId,
  })

  if (isLoading) return <Spinner />

  const available = (floors as any[]).filter((f) => (f.availableBeds ?? 0) > 0)

  if (available.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Layers size={32} className="text-gray-200" />
        <p className="text-sm text-gray-400 font-medium">No floors with available beds</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {available.map((floor: any) => (
        <button
          key={floor.id}
          onClick={() => onSelect(floor)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
            <Layers size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{floor.floorName ?? floor.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <BedDouble size={12} className="text-gray-400" />
              <p className="text-xs text-gray-500">{floor.availableBeds} / {floor.totalBeds} beds available</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Step 2: Room ─────────────────────────────────────────────────────────────
function RoomStep({
  floorId,
  onSelect,
}: {
  floorId: number
  onSelect: (room: any) => void
}) {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms-availability', floorId],
    queryFn: () => getRoomsWithAvailability(floorId),
    enabled: !!floorId,
  })

  if (isLoading) return <Spinner />

  const available = (rooms as any[]).filter((r) => (r.availableBeds ?? 0) > 0)

  if (available.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <DoorOpen size={32} className="text-gray-200" />
        <p className="text-sm text-gray-400 font-medium">No rooms with available beds on this floor</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {available.map((room: any) => (
        <button
          key={room.id}
          onClick={() => onSelect(room)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left flex items-start gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <DoorOpen size={20} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-800">{room.roomName ?? room.roomNumber}</p>
              {room.roomType && <Badge status={room.roomType} />}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <BedDouble size={12} className="text-gray-400" />
                <p className="text-xs text-gray-500">{room.availableBeds} beds free</p>
              </div>
              {room.rentAmount != null && (
                <p className="text-xs font-semibold text-indigo-600">₹{room.rentAmount.toLocaleString()}/mo</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Step 3: Bed ──────────────────────────────────────────────────────────────
function BedStep({
  roomId,
  onSelect,
}: {
  roomId: number
  onSelect: (bed: any) => void
}) {
  const { data: beds = [], isLoading } = useQuery({
    queryKey: ['beds', roomId],
    queryFn: () => getBedsByRoom(roomId),
    enabled: !!roomId,
  })

  if (isLoading) return <Spinner />

  const available = (beds as any[]).filter((b) => b.status === 'AVAILABLE')

  if (available.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <BedDouble size={32} className="text-gray-200" />
        <p className="text-sm text-gray-400 font-medium">No available beds in this room</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {available.map((bed: any) => (
        <button
          key={bed.id}
          onClick={() => onSelect(bed)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left flex flex-col items-center gap-2 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
            <BedDouble size={20} className="text-sky-600" />
          </div>
          <p className="font-semibold text-gray-800 text-sm">{bed.bedName ?? bed.bedNumber}</p>
          <Badge status={bed.status} />
        </button>
      ))}
    </div>
  )
}

// ─── Step 4: Confirm ──────────────────────────────────────────────────────────
function ConfirmStep({
  hostelId,
  hostelName,
  selectedFloor,
  selectedRoom,
  selectedBed,
  onSuccess,
}: {
  hostelId: number
  hostelName: string
  selectedFloor: any
  selectedRoom: any
  selectedBed: any
  onSuccess: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [checkInDate, setCheckInDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      submitBookingRequest({
        hostelId,
        bedId: selectedBed.id,
        checkInDate,
        preferenceNotes: notes || undefined,
      }),
    onSuccess,
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Failed to submit booking request. Please try again.')
    },
  })

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Booking Summary</h3>
        <div className="divide-y divide-gray-50 text-sm">
          {[
            { label: 'Hostel', value: hostelName },
            { label: 'Floor', value: selectedFloor.floorName ?? selectedFloor.name },
            { label: 'Room', value: selectedRoom.roomName ?? selectedRoom.roomNumber },
            { label: 'Bed', value: selectedBed.bedName ?? selectedBed.bedNumber },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2.5">
              <span className="text-gray-400 font-medium">{label}</span>
              <span className="font-semibold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in date */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Check-in Date</span>
        </label>
        <input
          type="date"
          value={checkInDate}
          min={today}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
        />
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-1.5"><AlignLeft size={14} /> Preference Notes <span className="font-normal text-gray-400">(optional)</span></span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any preferences or special requirements..."
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
      >
        {mutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
      </button>
    </div>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export default function BedSelectionWizard() {
  const { hostelId } = useParams<{ hostelId: string }>()
  const navigate = useNavigate()
  const id = Number(hostelId)

  const [step, setStep] = useState<Step>(0)
  const [selectedFloor, setSelectedFloor] = useState<any>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [selectedBed, setSelectedBed] = useState<any>(null)

  function handleFloorSelect(floor: any) {
    setSelectedFloor(floor)
    setSelectedRoom(null)
    setSelectedBed(null)
    setStep(1)
  }

  function handleRoomSelect(room: any) {
    setSelectedRoom(room)
    setSelectedBed(null)
    setStep(2)
  }

  function handleBedSelect(bed: any) {
    setSelectedBed(bed)
    setStep(3)
  }

  function handleBack() {
    if (step === 0) navigate(-1)
    else setStep((s) => (s - 1) as Step)
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} /> {step === 0 ? 'Back to Hostel' : 'Previous Step'}
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Book a Bed</h1>
        <p className="text-sm text-gray-500 mt-0.5">Select your preferred floor, room, and bed</p>
      </div>

      <Stepper current={step} />

      {step === 0 && (
        <FloorStep hostelId={id} onSelect={handleFloorSelect} />
      )}

      {step === 1 && selectedFloor && (
        <RoomStep floorId={selectedFloor.id} onSelect={handleRoomSelect} />
      )}

      {step === 2 && selectedRoom && (
        <BedStep roomId={selectedRoom.id} onSelect={handleBedSelect} />
      )}

      {step === 3 && selectedFloor && selectedRoom && selectedBed && (
        <ConfirmStep
          hostelId={id}
          hostelName={`Hostel #${hostelId}`}
          selectedFloor={selectedFloor}
          selectedRoom={selectedRoom}
          selectedBed={selectedBed}
          onSuccess={() => navigate('/app/booking-status')}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, X, CheckCircle2, XCircle, RefreshCw, IndianRupee } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'
import {
  getBookingRequests,
  approveBookingRequest,
  rejectBookingRequest,
  reassignBookingRequest,
  getFloorsWithAvailability,
  getRoomsWithAvailability,
  getBedsByRoom,
} from '../../api/staff'

const STATUS_TABS = ['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const
type StatusTab = typeof STATUS_TABS[number]

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Approve Modal ────────────────────────────────────────────────────────────
function ApproveModal({
  requestId,
  onClose,
  onSuccess,
}: {
  requestId: number
  onClose: () => void
  onSuccess: () => void
}) {
  const [monthlyRent, setMonthlyRent] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('CASH')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      approveBookingRequest(requestId, {
        monthlyRent: Number(monthlyRent),
        advanceAmount: Number(advanceAmount),
        paymentMode,
      }),
    onSuccess,
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Failed to approve. Please try again.')
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h2 className="font-bold text-gray-900">Approve Booking</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Rent (₹)</label>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 8000"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Advance Amount (₹)</label>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                placeholder="e.g. 16000"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
            >
              <option value="CASH">Cash</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !monthlyRent}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            {mutation.isPending ? 'Approving...' : 'Confirm Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({
  requestId,
  onClose,
  onSuccess,
}: {
  requestId: number
  onClose: () => void
  onSuccess: () => void
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => rejectBookingRequest(requestId, reason),
    onSuccess,
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Failed to reject. Please try again.')
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-red-500" />
            <h2 className="font-bold text-gray-900">Reject Booking</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rejection Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Provide a reason for rejecting this request..."
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !reason.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {mutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Reassign Modal ───────────────────────────────────────────────────────────
function ReassignModal({
  hostelId,
  requestId,
  onClose,
  onSuccess,
}: {
  hostelId: number
  requestId: number
  onClose: () => void
  onSuccess: () => void
}) {
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: floors = [] } = useQuery({
    queryKey: ['floors-availability', hostelId],
    queryFn: () => getFloorsWithAvailability(hostelId),
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms-availability', selectedFloorId],
    queryFn: () => getRoomsWithAvailability(selectedFloorId!),
    enabled: !!selectedFloorId,
  })

  const { data: beds = [] } = useQuery({
    queryKey: ['beds', selectedRoomId],
    queryFn: () => getBedsByRoom(selectedRoomId!),
    enabled: !!selectedRoomId,
  })

  const availableBeds = (beds as any[]).filter((b) => b.status === 'AVAILABLE')

  const mutation = useMutation({
    mutationFn: () => reassignBookingRequest(requestId, selectedBedId!),
    onSuccess,
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Failed to reassign. Please try again.')
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-blue-500" />
            <h2 className="font-bold text-gray-900">Reassign Bed</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Floor</label>
            <select
              value={selectedFloorId ?? ''}
              onChange={(e) => { setSelectedFloorId(Number(e.target.value)); setSelectedRoomId(null); setSelectedBedId(null) }}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">Select floor...</option>
              {(floors as any[]).filter((f) => (f.availableBeds ?? 0) > 0).map((f: any) => (
                <option key={f.id} value={f.id}>{f.floorName ?? f.name}</option>
              ))}
            </select>
          </div>

          {selectedFloorId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Room</label>
              <select
                value={selectedRoomId ?? ''}
                onChange={(e) => { setSelectedRoomId(Number(e.target.value)); setSelectedBedId(null) }}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">Select room...</option>
                {(rooms as any[]).filter((r) => (r.availableBeds ?? 0) > 0).map((r: any) => (
                  <option key={r.id} value={r.id}>{r.roomName ?? r.roomNumber}</option>
                ))}
              </select>
            </div>
          )}

          {selectedRoomId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bed</label>
              <select
                value={selectedBedId ?? ''}
                onChange={(e) => setSelectedBedId(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">Select bed...</option>
                {availableBeds.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.bedName ?? b.bedNumber}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !selectedBedId}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            {mutation.isPending ? 'Reassigning...' : 'Confirm Reassign'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type ModalState =
  | { type: 'approve'; requestId: number }
  | { type: 'reject'; requestId: number }
  | { type: 'reassign'; requestId: number }
  | null

export default function BookingRequests() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
  const [modal, setModal] = useState<ModalState>(null)

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['booking-requests', activeHostelId, activeTab],
    queryFn: () => getBookingRequests(
      activeHostelId!,
      activeTab === 'ALL' ? undefined : activeTab,
    ),
    enabled: !!activeHostelId,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['booking-requests', activeHostelId] })
    setModal(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Requests"
        subtitle="Review and manage hostel booking requests"
        count={(requests as any[]).length}
      />

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Hosteller</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Bed / Room / Floor</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Check-in</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Expires</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(requests as any[]).map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800">#{req.hostellerProfileId}</p>
                    <p className="text-xs text-gray-400">Hostel #{req.hostelId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">Bed #{req.bedId}</p>
                    <p className="text-xs text-gray-400">Room #{req.roomId} · Floor #{req.floorId}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {req.checkInDate ? fmtDate(req.checkInDate) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {req.expiresAt ? fmtDate(req.expiresAt) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={req.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {req.status === 'PENDING_APPROVAL' ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setModal({ type: 'approve', requestId: req.id })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          onClick={() => setModal({ type: 'reject', requestId: req.id })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                        <button
                          onClick={() => setModal({ type: 'reassign', requestId: req.id })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          <RefreshCw size={12} /> Reassign
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(requests as any[]).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <ClipboardList size={18} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-400 text-sm">No booking requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'approve' && (
        <ApproveModal
          requestId={modal.requestId}
          onClose={() => setModal(null)}
          onSuccess={invalidate}
        />
      )}
      {modal?.type === 'reject' && (
        <RejectModal
          requestId={modal.requestId}
          onClose={() => setModal(null)}
          onSuccess={invalidate}
        />
      )}
      {modal?.type === 'reassign' && activeHostelId && (
        <ReassignModal
          hostelId={activeHostelId}
          requestId={modal.requestId}
          onClose={() => setModal(null)}
          onSuccess={invalidate}
        />
      )}
    </div>
  )
}

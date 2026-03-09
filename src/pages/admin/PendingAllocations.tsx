import { useState } from 'react'
import { X } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_PENDING = [
  { id: 1, applicantName: 'Ravi Kumar', email: 'ravi@example.com', phone: '9876500001', appliedDate: 'Mar 7, 2026', roomPreference: 'AC', gender: 'Male', status: 'PENDING' },
  { id: 2, applicantName: 'Sneha Patel', email: 'sneha@example.com', phone: '9876500002', appliedDate: 'Mar 6, 2026', roomPreference: 'Non-AC', gender: 'Female', status: 'PENDING' },
  { id: 3, applicantName: 'Karan Mehta', email: 'karan@example.com', phone: '9876500003', appliedDate: 'Mar 5, 2026', roomPreference: 'Any', gender: 'Male', status: 'PENDING' },
  { id: 4, applicantName: 'Divya Rao', email: 'divya@example.com', phone: '9876500004', appliedDate: 'Mar 4, 2026', roomPreference: 'AC', gender: 'Female', status: 'PENDING' },
  { id: 5, applicantName: 'Amit Joshi', email: 'amit@example.com', phone: '9876500005', appliedDate: 'Mar 3, 2026', roomPreference: 'Non-AC', gender: 'Male', status: 'PENDING' },
]

type Applicant = typeof MOCK_PENDING[number]

export default function PendingAllocations() {
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [roomNumber, setRoomNumber] = useState('')

  function handleAllocate(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call allocateRoom() API
    setSelected(null)
    setRoomNumber('')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Allocations"
        subtitle="Review and assign rooms to new applicants"
      />

      {/* Allocate modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900 text-lg">Allocate Room</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              <p className="font-medium text-gray-800">{selected.applicantName}</p>
              <p className="text-sm text-gray-500">{selected.email} · {selected.phone}</p>
              <p className="text-sm text-gray-500">Preference: {selected.roomPreference} · {selected.gender}</p>
              <p className="text-sm text-gray-400">Applied: {selected.appliedDate}</p>
            </div>
            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Number</label>
                <input
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g., B-204"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Allocate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Applicant</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Contact</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Preference</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Applied</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PENDING.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{p.applicantName}</p>
                    <p className="text-xs text-gray-400">{p.gender}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-700">{p.email}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{p.roomPreference}</td>
                  <td className="px-5 py-3.5 text-gray-500">{p.appliedDate}</td>
                  <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
                    >
                      Allocate Room
                    </button>
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

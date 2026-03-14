import { useState } from 'react'
import { Plus, X, Car, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_MY_SLOT = { vehicleNumber: 'KA-01-AB-1234', type: 'Car', slot: 'P-07', since: 'Mar 1, 2026', status: 'ACTIVE' }
const MOCK_REQUESTS = [
  { id: 1, vehicleNumber: 'KA-01-AB-1234', type: 'Car', slot: 'P-07', requestedDate: 'Feb 28, 2026', status: 'ACTIVE' },
]

const VEHICLE_TYPES = ['Car', 'Bike', 'Scooter']

export default function Parking() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ vehicleNumber: '', type: '', notes: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call requestParking API
    setShowForm(false)
    setForm({ vehicleNumber: '', type: '', notes: '' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parking"
        subtitle="Request a vehicle parking slot"
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
          >
            <Plus size={16} /> Request Parking
          </button>
        }
      />

      {/* Active Slot Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shrink-0">
              <CheckCircle2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">Active Slot</p>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{MOCK_MY_SLOT.slot}</h3>
            </div>
          </div>
          <Badge status={MOCK_MY_SLOT.status} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-100">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Vehicle Number</p>
            <p className="font-mono text-sm font-bold text-gray-800 mt-0.5">{MOCK_MY_SLOT.vehicleNumber}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium">Type</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{MOCK_MY_SLOT.type}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium">Since</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{MOCK_MY_SLOT.since}</p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-colors">
          Remove Slot
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Car size={14} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">New Parking Request</h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Vehicle Number
                </label>
                <input
                  required
                  value={form.vehicleNumber}
                  onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))}
                  placeholder="KA-01-AB-1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Vehicle Type
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select type</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Notes (optional)
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any additional details…"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Car size={14} className="text-indigo-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">My Parking Requests</h2>
          <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {MOCK_REQUESTS.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Vehicle Number</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Slot</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Requested Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_REQUESTS.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                      {r.vehicleNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{r.slot || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{r.requestedDate}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={r.status} />
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

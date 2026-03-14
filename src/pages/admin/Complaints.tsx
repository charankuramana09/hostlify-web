import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const MOCK_COMPLAINTS = [
  { id: 1, hostellerName: 'Arjun Sharma', roomNumber: 'A-101', title: 'AC not working',      category: 'Maintenance', status: 'IN_PROGRESS', createdAt: 'Mar 7, 2026' },
  { id: 2, hostellerName: 'Priya Singh',  roomNumber: 'A-102', title: 'Washroom not clean',  category: 'Cleanliness', status: 'RESOLVED',    createdAt: 'Mar 2, 2026' },
  { id: 3, hostellerName: 'Ravi Kumar',   roomNumber: 'B-201', title: 'Food quality issue',  category: 'Food',        status: 'OPEN',        createdAt: 'Feb 28, 2026' },
  { id: 4, hostellerName: 'Sneha Patel',  roomNumber: 'B-202', title: 'Noisy neighbours',    category: 'Noise',       status: 'CLOSED',      createdAt: 'Feb 20, 2026' },
  { id: 5, hostellerName: 'Ananya Iyer',  roomNumber: 'C-302', title: 'WiFi slow in room',   category: 'Other',       status: 'OPEN',        createdAt: 'Mar 9, 2026' },
]

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500',   'bg-teal-500',
]

const CATEGORY_CHIP: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Cleanliness: 'bg-teal-50 text-teal-700',
  Food:        'bg-orange-50 text-orange-700',
  Noise:       'bg-purple-50 text-purple-700',
  Security:    'bg-red-50 text-red-700',
  Other:       'bg-gray-100 text-gray-600',
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminComplaints() {
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = statusFilter === 'ALL'
    ? MOCK_COMPLAINTS
    : MOCK_COMPLAINTS.filter((c) => c.status === statusFilter)

  function updateStatus(id: number, status: string) {
    // TODO: call updateComplaintStatus() API
    console.log('Update complaint', id, 'to', status)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaints"
        subtitle="Manage and resolve resident complaints"
        count={filtered.length}
      />

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Resident</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Complaint</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(c.hostellerName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.hostellerName}</p>
                        <p className="text-xs text-gray-400">Room {c.roomNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800 truncate max-w-[180px]">{c.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${CATEGORY_CHIP[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{c.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 font-medium"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <MessageSquare size={18} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-400 text-sm">No complaints found</p>
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

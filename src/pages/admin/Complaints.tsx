import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const MOCK_COMPLAINTS = [
  { id: 1, hostellerName: 'Arjun Sharma', roomNumber: 'A-101', title: 'AC not working', category: 'Maintenance', status: 'IN_PROGRESS', createdAt: 'Mar 7, 2026' },
  { id: 2, hostellerName: 'Priya Singh', roomNumber: 'A-102', title: 'Washroom not clean', category: 'Cleanliness', status: 'RESOLVED', createdAt: 'Mar 2, 2026' },
  { id: 3, hostellerName: 'Ravi Kumar', roomNumber: 'B-201', title: 'Food quality issue', category: 'Food', status: 'OPEN', createdAt: 'Feb 28, 2026' },
  { id: 4, hostellerName: 'Sneha Patel', roomNumber: 'B-202', title: 'Noisy neighbours', category: 'Noise', status: 'CLOSED', createdAt: 'Feb 20, 2026' },
  { id: 5, hostellerName: 'Ananya Iyer', roomNumber: 'C-302', title: 'WiFi slow in room', category: 'Other', status: 'OPEN', createdAt: 'Mar 9, 2026' },
]

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
      <PageHeader title="Complaints" subtitle="Manage and resolve resident complaints" />

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Resident</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Complaint</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{c.hostellerName}</p>
                    <p className="text-xs text-gray-400">Room {c.roomNumber}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 max-w-xs truncate">{c.title}</td>
                  <td className="px-5 py-3.5 text-gray-600">{c.category}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.createdAt}</td>
                  <td className="px-5 py-3.5"><Badge status={c.status} /></td>
                  <td className="px-5 py-3.5">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
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

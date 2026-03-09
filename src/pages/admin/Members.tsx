import { useState } from 'react'
import { Search } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_MEMBERS = [
  { id: 1, name: 'Arjun Sharma', email: 'arjun@example.com', phone: '9876543210', roomNumber: 'A-101', status: 'ACTIVE', joinDate: 'Sep 1, 2025' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', roomNumber: 'A-102', status: 'ACTIVE', joinDate: 'Sep 1, 2025' },
  { id: 3, name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9876543212', roomNumber: 'B-201', status: 'ACTIVE', joinDate: 'Jan 15, 2026' },
  { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', phone: '9876543213', roomNumber: 'B-202', status: 'ACTIVE', joinDate: 'Feb 5, 2026' },
  { id: 5, name: 'Mohit Verma', email: 'mohit@example.com', phone: '9876543214', roomNumber: 'C-301', status: 'INACTIVE', joinDate: 'Jul 1, 2025' },
  { id: 6, name: 'Ananya Iyer', email: 'ananya@example.com', phone: '9876543215', roomNumber: 'C-302', status: 'ACTIVE', joinDate: 'Sep 1, 2025' },
]

export default function Members() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.roomNumber.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Members" subtitle={`${MOCK_MEMBERS.length} total residents`} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or room…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Member</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Room</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Join Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-gray-700">{m.roomNumber}</td>
                  <td className="px-5 py-3.5 text-gray-600">{m.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500">{m.joinDate}</td>
                  <td className="px-5 py-3.5"><Badge status={m.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No members found.
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

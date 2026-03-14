import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_MEMBERS = [
  { id: 1, name: 'Arjun Sharma',  email: 'arjun@example.com',  phone: '9876543210', roomNumber: 'A-101', status: 'ACTIVE',   joinDate: 'Sep 1, 2025' },
  { id: 2, name: 'Priya Singh',   email: 'priya@example.com',  phone: '9876543211', roomNumber: 'A-102', status: 'ACTIVE',   joinDate: 'Sep 1, 2025' },
  { id: 3, name: 'Ravi Kumar',    email: 'ravi@example.com',   phone: '9876543212', roomNumber: 'B-201', status: 'ACTIVE',   joinDate: 'Jan 15, 2026' },
  { id: 4, name: 'Sneha Patel',   email: 'sneha@example.com',  phone: '9876543213', roomNumber: 'B-202', status: 'ACTIVE',   joinDate: 'Feb 5, 2026' },
  { id: 5, name: 'Mohit Verma',   email: 'mohit@example.com',  phone: '9876543214', roomNumber: 'C-301', status: 'INACTIVE', joinDate: 'Jul 1, 2025' },
  { id: 6, name: 'Ananya Iyer',   email: 'ananya@example.com', phone: '9876543215', roomNumber: 'C-302', status: 'ACTIVE',   joinDate: 'Sep 1, 2025' },
]

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500',   'bg-amber-500',   'bg-teal-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Members() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.roomNumber.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        subtitle={`${MOCK_MEMBERS.length} total residents`}
        count={filtered.length}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or room…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s === 'ALL' ? 'All' : s[0] + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Room</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Join Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                      {m.roomNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-medium">{m.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500">{m.joinDate}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={m.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <Users size={18} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-400 text-sm">No members found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Try adjusting your search or filter</p>
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

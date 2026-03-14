import { useState } from 'react'
import { Plus, X, Shield, UserCheck } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  assignedHostels: string[]
  status: string
  since: string
}

const MOCK_STAFF: StaffMember[] = [
  { id: 1, name: 'Raj Patel', email: 'raj@sunrise.com', role: 'ADMIN', assignedHostels: ['Sunrise Hostel'], status: 'ACTIVE', since: 'Jan 2025' },
  { id: 2, name: 'Meera Nair', email: 'meera@sunrise.com', role: 'SUPERVISOR', assignedHostels: ['Sunrise Hostel'], status: 'ACTIVE', since: 'Mar 2025' },
  { id: 3, name: 'Kiran Rao', email: 'kiran@sunrise.com', role: 'ADMIN', assignedHostels: ['Sunrise Hostel', 'Green Valley'], status: 'INACTIVE', since: 'Jun 2024' },
  { id: 4, name: 'Sunita Joshi', email: 'sunita@sunrise.com', role: 'SUPERVISOR', assignedHostels: ['Sunrise Hostel'], status: 'ACTIVE', since: 'Sep 2025' },
]

const ROLE_CHIP: Record<string, string> = {
  ADMIN: 'bg-indigo-50 text-indigo-700',
  SUPERVISOR: 'bg-purple-50 text-purple-700',
  OWNER: 'bg-amber-50 text-amber-700',
}

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
]

const AVAILABLE_HOSTELS = ['Sunrise Hostel', 'Green Valley', 'Blue Ridge']

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

interface AddStaffForm {
  name: string
  email: string
  password: string
  role: string
  assignedHostels: string[]
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddStaffForm>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    assignedHostels: [],
  })

  function handleHostelToggle(hostel: string) {
    setForm((f) => ({
      ...f,
      assignedHostels: f.assignedHostels.includes(hostel)
        ? f.assignedHostels.filter((h) => h !== hostel)
        : [...f.assignedHostels, hostel],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newMember: StaffMember = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      role: form.role,
      assignedHostels: form.assignedHostels,
      status: 'ACTIVE',
      since: 'Mar 2026',
    }
    setStaff((prev) => [...prev, newMember])
    setForm({ name: '', email: '', password: '', role: 'ADMIN', assignedHostels: [] })
    setShowForm(false)
  }

  function handleDeactivate(id: number) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle={`${staff.length} staff members`}
        action={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancel' : 'Add Staff Member'}
          </button>
        }
      />

      {/* Add Staff Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserCheck size={14} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Add New Staff Member</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Raj Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. raj@sunrise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Temporary Password</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERVISOR">Supervisor</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Assign Hostels</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOSTELS.map((hostel) => (
                  <button
                    key={hostel}
                    type="button"
                    onClick={() => handleHostelToggle(hostel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      form.assignedHostels.includes(hostel)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {form.assignedHostels.includes(hostel) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    {hostel}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                <UserCheck size={14} />
                Create Staff Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Staff Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Assigned Hostels</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Since</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_CHIP[s.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      <Shield size={10} />
                      {s.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.assignedHostels.map((h) => (
                        <span key={h} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{s.since}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={s.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Shield size={14} />
                      </button>
                      <button
                        onClick={() => handleDeactivate(s.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          s.status === 'ACTIVE'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
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

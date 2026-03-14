import { useState } from 'react'
import { Plus, X, Briefcase, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Suresh Kumar', role: 'Cook',          salary: 12000, lastPaid: 'Feb 28, 2026', status: 'PAID' },
  { id: 2, name: 'Ramu Yadav',   role: 'Cleaner',       salary: 8000,  lastPaid: 'Feb 28, 2026', status: 'PAID' },
  { id: 3, name: 'Ganesh S.',    role: 'Security',      salary: 10000, lastPaid: 'Feb 28, 2026', status: 'PAID' },
  { id: 4, name: 'Pradeep Naik', role: 'Maintenance',   salary: 9000,  lastPaid: null,            status: 'PENDING' },
  { id: 5, name: 'Latha Devi',   role: 'Cook (Helper)', salary: 7500,  lastPaid: null,            status: 'PENDING' },
]

const AVATAR_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Employees() {
  const [showForm, setShowForm] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', role: '', salary: '', joinDate: '' })

  const totalPaid = MOCK_EMPLOYEES.filter((e) => e.status === 'PAID').length
  const totalPending = MOCK_EMPLOYEES.filter((e) => e.status === 'PENDING').length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call addEmployee API
    setShowForm(false)
    setForm({ name: '', role: '', salary: '', joinDate: '' })
  }

  function handleRecordSalary(id: number) {
    // TODO: call recordSalary API
    setConfirmId(null)
  }

  const confirmEmployee = MOCK_EMPLOYEES.find((e) => e.id === confirmId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage hostel staff and salaries"
        count={MOCK_EMPLOYEES.length}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
          >
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Employees"
          value={MOCK_EMPLOYEES.length}
          sub="Active staff members"
          icon={<Briefcase size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="March Paid"
          value={totalPaid}
          sub="Salaries disbursed"
          icon={<CheckCircle2 size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Pending"
          value={totalPending}
          sub="Awaiting payment"
          icon={<Briefcase size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Briefcase size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Add New Employee</h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Cook, Cleaner, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Salary (₹)</label>
                <input
                  required
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Join Date</label>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => setForm((f) => ({ ...f, joinDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
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
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_EMPLOYEES.map((emp, i) => (
          <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {getInitials(emp.name)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{emp.name}</p>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                    {emp.role}
                  </span>
                </div>
              </div>
              <Badge status={emp.status} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div>
                <p className="text-xs text-gray-400">Monthly Salary</p>
                <p className="text-base font-bold text-gray-900">₹{emp.salary.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Last Paid</p>
                <p className="text-xs font-medium text-gray-600">{emp.lastPaid ?? '—'}</p>
              </div>
            </div>
            {emp.status === 'PENDING' && (
              <button
                onClick={() => setConfirmId(emp.id)}
                className="w-full mt-3 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                Record Salary
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Salary Modal */}
      {confirmId !== null && confirmEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 size={22} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Record Salary Payment</h3>
            <p className="text-sm text-gray-500 mb-2">
              Record ₹{confirmEmployee.salary.toLocaleString()} salary payment for{' '}
              <span className="font-semibold text-gray-700">{confirmEmployee.name}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">This will mark their March 2026 salary as PAID.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRecordSalary(confirmId)}
                className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

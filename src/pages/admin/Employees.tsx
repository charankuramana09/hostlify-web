import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, Briefcase, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { getEmployees, addEmployee, recordSalary } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

const AVATAR_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Employees() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [showForm, setShowForm] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [form, setForm] = useState({ employeeName: '', designation: '', mobile: '', salary: '', joinDate: '' })

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees', activeHostelId],
    queryFn: () => getEmployees(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const addMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => addEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeHostelId] })
      setShowForm(false)
      setForm({ employeeName: '', designation: '', mobile: '', salary: '', joinDate: '' })
      show('success', 'Employee added', 'New employee has been added successfully.')
    },
    onError: () => {
      show('error', 'Failed to add employee', 'Please check the details and try again.')
    },
  })

  const salaryMut = useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: number; data: Record<string, unknown> }) =>
      recordSalary(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeHostelId] })
      setConfirmId(null)
      show('success', 'Salary recorded', 'Salary has been marked as paid.')
    },
    onError: () => {
      show('error', 'Failed to record salary', 'Please try again.')
    },
  })

  const now = new Date()
  const totalPaid = employees.filter((e: any) => e.status === 'PAID').length
  const totalPending = employees.filter((e: any) => e.status === 'PENDING').length
  const confirmEmployee = employees.find((e: any) => e.id === confirmId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addMut.mutate({
      employeeName: form.employeeName,
      designation: form.designation,
      mobile: form.mobile,
      salary: Number(form.salary),
      joinDate: form.joinDate,
    })
  }

  function handleRecordSalary(id: number) {
    salaryMut.mutate({
      employeeId: id,
      data: { month: now.getMonth() + 1, year: now.getFullYear(), amount: confirmEmployee?.salary },
    })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage hostel staff and salaries"
        count={employees.length}
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
          value={employees.length}
          sub="Active staff members"
          icon={<Briefcase size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Paid"
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employee Name</label>
                <input
                  required
                  value={form.employeeName}
                  onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Designation</label>
                <input
                  required
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  placeholder="Cook, Cleaner, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile</label>
                <input
                  required
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  placeholder="Mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Salary (₹)</label>
                <input
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
                disabled={addMut.isPending}
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                {addMut.isPending ? 'Adding…' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp: any, i: number) => (
          <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {getInitials(emp.employeeName ?? emp.name ?? '??')}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{emp.employeeName ?? emp.name}</p>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                    {emp.designation ?? emp.role}
                  </span>
                </div>
              </div>
              <Badge status={emp.status} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div>
                <p className="text-xs text-gray-400">Monthly Salary</p>
                <p className="text-base font-bold text-gray-900">₹{(emp.salary ?? 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Last Paid</p>
                <p className="text-xs font-medium text-gray-600">{emp.lastPaidDate ?? '—'}</p>
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
              Record ₹{(confirmEmployee.salary ?? 0).toLocaleString()} salary payment for{' '}
              <span className="font-semibold text-gray-700">{confirmEmployee.employeeName ?? confirmEmployee.name}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">This will mark their salary as PAID for this month.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRecordSalary(confirmId)}
                disabled={salaryMut.isPending}
                className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
              >
                {salaryMut.isPending ? 'Processing…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

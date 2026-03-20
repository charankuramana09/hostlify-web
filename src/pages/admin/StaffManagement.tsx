import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, UserCog, Mail, Phone, Shield, Trash2, Edit2, Briefcase, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { getStaffMembers, createStaffMember, updateStaffMember, deactivateStaffMember, getEmployees, addEmployee, recordSalary } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

const SUB_ROLES = ['MANAGER', 'SUPERVISOR', 'RECEPTIONIST', 'SECURITY', 'CLEANER', 'OTHER']

type StaffForm = { email: string; mobile: string; subRole: string; password: string }
const EMPTY_FORM: StaffForm = { email: '', mobile: '', subRole: 'MANAGER', password: '' }

const AVATAR_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

type TabType = 'staff' | 'employees'

export default function StaffManagement() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [activeTab, setActiveTab] = useState<TabType>('staff')

  // ── Staff Accounts ────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<StaffForm>(EMPTY_FORM)
  const [confirmDeactivate, setConfirmDeactivate] = useState<number | null>(null)

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff', activeHostelId],
    queryFn: () => getStaffMembers(activeHostelId!),
    enabled: !!activeHostelId && activeTab === 'staff',
  })

  const createMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => createStaffMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', activeHostelId] })
      setShowForm(false)
      setForm(EMPTY_FORM)
      show('success', 'Staff member added', 'New staff account has been created.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Please check the details and try again.'
      show('error', 'Failed to add staff', msg)
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', activeHostelId] })
      setEditId(null)
      setForm(EMPTY_FORM)
      show('success', 'Staff updated', 'Staff details have been updated.')
    },
    onError: () => show('error', 'Update failed', 'Could not update staff details.'),
  })

  const deactivateMut = useMutation({
    mutationFn: (id: number) => deactivateStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', activeHostelId] })
      setConfirmDeactivate(null)
      show('success', 'Staff deactivated', 'Staff member has been deactivated.')
    },
    onError: () => show('error', 'Deactivation failed', 'Could not deactivate staff member.'),
  })

  function openCreate() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(s: any) {
    setEditId(s.id)
    setForm({ email: s.email ?? '', mobile: s.mobile ?? '', subRole: s.subRole ?? 'MANAGER', password: '' })
    setShowForm(true)
  }

  function handleStaffSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editId !== null) {
      updateMut.mutate({ id: editId, data: { mobile: form.mobile, subRole: form.subRole } })
    } else {
      createMut.mutate({
        email: form.email,
        mobile: form.mobile,
        subRole: form.subRole,
        password: form.password || undefined,
        hostelId: activeHostelId,
      })
    }
  }

  const activeCount = (staff as any[]).filter((s) => s.status === 'ACTIVE').length

  // ── Employees & Payroll ───────────────────────────────────────────────────────
  const [showEmpForm, setShowEmpForm] = useState(false)
  const [confirmSalaryId, setConfirmSalaryId] = useState<number | null>(null)
  const [empForm, setEmpForm] = useState({ employeeName: '', designation: '', mobile: '', salary: '', joinDate: '' })

  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ['employees', activeHostelId],
    queryFn: () => getEmployees(activeHostelId!),
    enabled: !!activeHostelId && activeTab === 'employees',
  })

  const addEmpMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => addEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeHostelId] })
      setShowEmpForm(false)
      setEmpForm({ employeeName: '', designation: '', mobile: '', salary: '', joinDate: '' })
      show('success', 'Employee added', 'New employee has been added successfully.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Please check the details and try again.'
      show('error', 'Failed to add employee', msg)
    },
  })

  const salaryMut = useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: number; data: Record<string, unknown> }) =>
      recordSalary(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeHostelId] })
      setConfirmSalaryId(null)
      show('success', 'Salary recorded', 'Salary has been marked as paid.')
    },
    onError: () => {
      show('error', 'Failed to record salary', 'Please try again.')
    },
  })

  const now = new Date()
  const confirmEmployee = (employees as any[]).find((e: any) => e.id === confirmSalaryId)

  function handleEmpSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeHostelId) { show('error', 'No hostel selected', 'Please select a hostel first.'); return }
    addEmpMut.mutate({
      hostelId: activeHostelId,
      employeeName: empForm.employeeName,
      designation: empForm.designation,
      mobile: empForm.mobile,
      salary: Number(empForm.salary),
      joinDate: empForm.joinDate,
    })
  }

  function handleRecordSalary(id: number) {
    salaryMut.mutate({
      employeeId: id,
      data: { month: now.getMonth() + 1, year: now.getFullYear(), amount: confirmEmployee?.salary },
    })
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Employees"
        subtitle="Manage staff accounts and employee payroll"
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'staff' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCog size={13} /> Staff Accounts
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'employees' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Briefcase size={13} /> Employees & Payroll
        </button>
      </div>

      {/* ── Staff Accounts Tab ── */}
      {activeTab === 'staff' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
            >
              <Plus size={16} /> Add Staff
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              label="Total Staff"
              value={(staff as any[]).length}
              sub="All staff accounts"
              icon={<UserCog size={20} className="text-indigo-600" />}
              iconBg="bg-indigo-50"
            />
            <StatCard
              label="Active"
              value={activeCount}
              sub="Currently active"
              icon={<Shield size={20} className="text-emerald-600" />}
              iconBg="bg-emerald-50"
            />
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <UserCog size={14} className="text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{editId ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                </div>
                <button
                  onClick={() => { setShowForm(false); setEditId(null) }}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleStaffSubmit} className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {!editId && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="staff@email.com"
                        className={inputCls}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile</label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                      placeholder="Mobile number"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
                    <select
                      value={form.subRole}
                      onChange={(e) => setForm((f) => ({ ...f, subRole: e.target.value }))}
                      className={inputCls + ' bg-white'}
                    >
                      {SUB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {!editId && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Password <span className="font-normal text-gray-400 normal-case">(leave blank for default)</span>
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="Hostlify@123 (default)"
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditId(null) }}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMut.isPending || updateMut.isPending}
                    className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
                  >
                    {(createMut.isPending || updateMut.isPending) ? 'Saving…' : (editId ? 'Update' : 'Add Staff')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Staff Table */}
          {staffLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Staff Member</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Mobile</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(staff as any[]).map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                              {(s.email ?? '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-xs">{s.email}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Mail size={10} /> {s.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                            {s.subRole ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-gray-600 text-xs">
                            <Phone size={11} className="text-gray-400" /> {s.mobile ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge status={s.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(s)}
                              className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => setConfirmDeactivate(s.id)}
                              className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                              title="Deactivate"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(staff as any[]).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                          No staff members added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Employees & Payroll Tab ── */}
      {activeTab === 'employees' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowEmpForm(!showEmpForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
            >
              <Plus size={16} /> Add Employee
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              label="Total Employees"
              value={(employees as any[]).length}
              sub="Active staff members"
              icon={<Briefcase size={20} className="text-emerald-600" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Pending Salary"
              value={(employees as any[]).filter((e: any) => e.status === 'PENDING').length}
              sub="Awaiting payment"
              icon={<Briefcase size={20} className="text-amber-600" />}
              iconBg="bg-amber-50"
            />
          </div>

          {/* Add Employee Form */}
          {showEmpForm && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Briefcase size={14} className="text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Add New Employee</h3>
                </div>
                <button
                  onClick={() => setShowEmpForm(false)}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleEmpSubmit} className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employee Name</label>
                    <input
                      required
                      value={empForm.employeeName}
                      onChange={(e) => setEmpForm((f) => ({ ...f, employeeName: e.target.value }))}
                      placeholder="Full name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Designation</label>
                    <input
                      required
                      value={empForm.designation}
                      onChange={(e) => setEmpForm((f) => ({ ...f, designation: e.target.value }))}
                      placeholder="Cook, Cleaner, etc."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile</label>
                    <input
                      required
                      type="tel"
                      value={empForm.mobile}
                      onChange={(e) => setEmpForm((f) => ({ ...f, mobile: e.target.value }))}
                      placeholder="Mobile number"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      value={empForm.salary}
                      onChange={(e) => setEmpForm((f) => ({ ...f, salary: e.target.value }))}
                      placeholder="0"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Join Date</label>
                    <input
                      type="date"
                      value={empForm.joinDate}
                      onChange={(e) => setEmpForm((f) => ({ ...f, joinDate: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEmpForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addEmpMut.isPending}
                    className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
                  >
                    {addEmpMut.isPending ? 'Adding…' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Employee Cards */}
          {empLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(employees as any[]).map((emp: any, i: number) => (
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
                      <p className="text-base font-bold text-gray-900">₹{(emp.salary ?? emp.baseSalary ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Last Paid</p>
                      <p className="text-xs font-medium text-gray-600">{emp.lastPaidDate ?? '—'}</p>
                    </div>
                  </div>
                  {emp.status === 'PENDING' && (
                    <button
                      onClick={() => setConfirmSalaryId(emp.id)}
                      className="w-full mt-3 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
                    >
                      Record Salary
                    </button>
                  )}
                </div>
              ))}
              {(employees as any[]).length === 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400">
                  No employees added yet
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Confirm Deactivate Modal */}
      {confirmDeactivate !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Deactivate Staff Member?</h3>
            <p className="text-sm text-gray-500 mb-6">This will deactivate the staff account. They will no longer be able to log in.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeactivate(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deactivateMut.mutate(confirmDeactivate)}
                disabled={deactivateMut.isPending}
                className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-red-500"
              >
                {deactivateMut.isPending ? 'Deactivating…' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Salary Modal */}
      {confirmSalaryId !== null && confirmEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 size={22} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Record Salary Payment</h3>
            <p className="text-sm text-gray-500 mb-2">
              Record ₹{((confirmEmployee.salary ?? confirmEmployee.baseSalary) ?? 0).toLocaleString()} salary payment for{' '}
              <span className="font-semibold text-gray-700">{confirmEmployee.employeeName ?? confirmEmployee.name}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">This will mark their salary as PAID for this month.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSalaryId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRecordSalary(confirmSalaryId)}
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

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, IndianRupee, TrendingDown } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { getExpenses, getExpenseSummary, addExpense } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

const EXPENSE_CATEGORIES = ['GROCERIES', 'UTILITIES', 'MAINTENANCE', 'SALARY', 'MISCELLANEOUS']
const PAYMENT_MODES = ['CASH', 'ONLINE', 'CHEQUE']

const CATEGORY_CHIP: Record<string, string> = {
  GROCERIES:     'bg-orange-50 text-orange-700',
  UTILITIES:     'bg-amber-50 text-amber-700',
  MAINTENANCE:   'bg-blue-50 text-blue-700',
  SALARY:        'bg-emerald-50 text-emerald-700',
  MISCELLANEOUS: 'bg-gray-100 text-gray-600',
  // legacy labels
  Maintenance:   'bg-blue-50 text-blue-700',
  Cleaning:      'bg-teal-50 text-teal-700',
  'Food & Mess': 'bg-orange-50 text-orange-700',
  Security:      'bg-red-50 text-red-700',
  Other:         'bg-gray-100 text-gray-600',
}

const today = new Date().toISOString().split('T')[0]
type ExpenseForm = { category: string; description: string; amount: string; expenseDate: string; paymentMode: string }

export default function Expenses() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ExpenseForm>({ category: '', description: '', amount: '', expenseDate: today, paymentMode: 'CASH' })

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', activeHostelId, currentMonth, currentYear],
    queryFn: () => getExpenses(activeHostelId!, currentMonth, currentYear),
    enabled: !!activeHostelId,
  })

  const { data: summary } = useQuery({
    queryKey: ['expenseSummary', activeHostelId, currentMonth, currentYear],
    queryFn: () => getExpenseSummary(activeHostelId!, currentMonth, currentYear),
    enabled: !!activeHostelId,
  })

  const addMut = useMutation({
    mutationFn: (data: Record<string, unknown>) => addExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', activeHostelId] })
      queryClient.invalidateQueries({ queryKey: ['expenseSummary', activeHostelId] })
      setShowForm(false)
      setForm({ category: '', description: '', amount: '', expenseDate: today, paymentMode: 'CASH' })
      show('success', 'Expense added', 'The expense has been recorded successfully.')
    },
    onError: () => {
      show('error', 'Failed to add expense', 'Please check the details and try again.')
    },
  })

  const totalExpenses: number = summary?.total ?? expenses.reduce((s: number, e: any) => s + (e.amount ?? 0), 0)

  // API may return byCategory as an array [{category,amount}] or a plain object {CAT: amount}
  const categoryTotals: Record<string, number> = (() => {
    const raw = summary?.byCategory
    if (!raw) {
      return (expenses as any[]).reduce((acc: Record<string, number>, e: any) => {
        acc[e.category] = (acc[e.category] ?? 0) + (e.amount ?? 0)
        return acc
      }, {})
    }
    if (Array.isArray(raw)) {
      return Object.fromEntries((raw as { category: string; amount: number }[]).map((c) => [c.category, c.amount]))
    }
    // plain object shape
    return raw as Record<string, number>
  })()

  function isValid() {
    return !!(form.category && Number(form.amount) > 0 && form.description.trim() && form.expenseDate)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid()) return
    addMut.mutate({
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      expenseDate: form.expenseDate,
      paymentMode: form.paymentMode,
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
        title="Expenses"
        subtitle="Track hostel operational expenses"
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
          >
            <Plus size={16} /> Add Expense
          </button>
        }
      />

      {/* Total summary card */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
            <TrendingDown size={14} className="text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Total Expenses This Month
          </p>
        </div>
        <p className="text-3xl font-bold tracking-tight">₹{totalExpenses.toLocaleString()}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <span
              key={cat}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              {cat}: ₹{(amt as number).toLocaleString()}
            </span>
          ))}
        </div>
      </div>

      {/* Add expense form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #d1fae5' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <IndianRupee size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Add Expense</h3>
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expense Date</label>
                <input
                  type="date"
                  required
                  value={form.expenseDate}
                  onChange={(e) => setForm((f) => ({ ...f, expenseDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Payment Mode</label>
                <select
                  value={form.paymentMode}
                  onChange={(e) => setForm((f) => ({ ...f, paymentMode: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
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
                disabled={addMut.isPending || !isValid()}
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                {addMut.isPending ? 'Adding…' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Added By</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.map((e: any) => (
                <tr key={e.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_CHIP[e.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">{e.description}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {e.date ? new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">{e.addedBy ?? '—'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-bold text-gray-900 flex items-center justify-end gap-0.5">
                      <IndianRupee size={13} />{(e.amount ?? 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-semibold text-gray-400">
                    No expenses recorded yet
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={4} className="px-5 py-3.5 font-bold text-gray-700">Total</td>
                <td className="px-5 py-3.5 text-right font-bold text-gray-900 text-base">
                  ₹{totalExpenses.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

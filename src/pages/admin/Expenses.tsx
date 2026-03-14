import { useState } from 'react'
import { Plus, X, IndianRupee, TrendingDown } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const EXPENSE_CATEGORIES = ['Maintenance', 'Cleaning', 'Utilities', 'Food & Mess', 'Security', 'Other']

const MOCK_EXPENSES = [
  { id: 1, category: 'Cleaning',    description: 'Monthly cleaning supplies',  amount: 2400,  date: 'Mar 8, 2026', addedBy: 'Staff A' },
  { id: 2, category: 'Maintenance', description: 'AC servicing for Block B',    amount: 8500,  date: 'Mar 5, 2026', addedBy: 'Staff B' },
  { id: 3, category: 'Utilities',   description: 'Electricity bill – February', amount: 34000, date: 'Mar 1, 2026', addedBy: 'Staff A' },
  { id: 4, category: 'Security',    description: 'CCTV maintenance',            amount: 3200,  date: 'Feb 28, 2026',addedBy: 'Staff B' },
  { id: 5, category: 'Food & Mess', description: 'Monthly grocery procurement', amount: 75000, date: 'Feb 1, 2026', addedBy: 'Staff A' },
]

const totalExpenses = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)

const CATEGORY_CHIP: Record<string, string> = {
  Maintenance:  'bg-blue-50 text-blue-700',
  Cleaning:     'bg-teal-50 text-teal-700',
  Utilities:    'bg-amber-50 text-amber-700',
  'Food & Mess':'bg-orange-50 text-orange-700',
  Security:     'bg-red-50 text-red-700',
  Other:        'bg-gray-100 text-gray-600',
}

// Compute per-category totals
const categoryTotals = MOCK_EXPENSES.reduce<Record<string, number>>((acc, e) => {
  acc[e.category] = (acc[e.category] ?? 0) + e.amount
  return acc
}, {})

export default function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', description: '', amount: '', date: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call addExpense() API
    setShowForm(false)
    setForm({ category: '', description: '', amount: '', date: '' })
  }

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
              {cat}: ₹{amt.toLocaleString()}
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                />
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
                className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                Add
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
              {MOCK_EXPENSES.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_CHIP[e.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">{e.description}</td>
                  <td className="px-5 py-3.5 text-gray-500">{e.date}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">{e.addedBy}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-bold text-gray-900 flex items-center justify-end gap-0.5">
                      <IndianRupee size={13} />{e.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
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

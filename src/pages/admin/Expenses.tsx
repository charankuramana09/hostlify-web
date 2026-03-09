import { useState } from 'react'
import { Plus, X, IndianRupee } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const EXPENSE_CATEGORIES = ['Maintenance', 'Cleaning', 'Utilities', 'Food & Mess', 'Security', 'Other']

const MOCK_EXPENSES = [
  { id: 1, category: 'Cleaning', description: 'Monthly cleaning supplies', amount: 2400, date: 'Mar 8, 2026', addedBy: 'Staff A' },
  { id: 2, category: 'Maintenance', description: 'AC servicing for Block B', amount: 8500, date: 'Mar 5, 2026', addedBy: 'Staff B' },
  { id: 3, category: 'Utilities', description: 'Electricity bill – February', amount: 34000, date: 'Mar 1, 2026', addedBy: 'Staff A' },
  { id: 4, category: 'Security', description: 'CCTV maintenance', amount: 3200, date: 'Feb 28, 2026', addedBy: 'Staff B' },
  { id: 5, category: 'Food & Mess', description: 'Monthly grocery procurement', amount: 75000, date: 'Feb 1, 2026', addedBy: 'Staff A' },
]

const totalExpenses = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)

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
        subtitle={`Total this month: ₹${totalExpenses.toLocaleString()}`}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            <Plus size={16} /> Add Expense
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Add Expense</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Added By</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_EXPENSES.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{e.category}</td>
                  <td className="px-5 py-3.5 text-gray-600">{e.description}</td>
                  <td className="px-5 py-3.5 text-gray-500">{e.date}</td>
                  <td className="px-5 py-3.5 text-gray-500">{e.addedBy}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900 flex items-center justify-end gap-0.5">
                    <IndianRupee size={13} />{e.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={4} className="px-5 py-3 font-semibold text-gray-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

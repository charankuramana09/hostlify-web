import { CreditCard, Clock, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const CURRENT_DUE = {
  amount: 5000,
  description: 'Monthly Hostel Fee – April 2026',
  dueDate: 'April 1, 2026',
  daysLeft: 23,
}

const PAYMENT_HISTORY = [
  { id: 1, amount: 5000, paidDate: 'Mar 1, 2026', method: 'Online', referenceId: 'TXN001234', status: 'PAID' },
  { id: 2, amount: 5000, paidDate: 'Feb 1, 2026', method: 'Online', referenceId: 'TXN001102', status: 'PAID' },
  { id: 3, amount: 5000, paidDate: 'Jan 1, 2026', method: 'Cash', referenceId: 'CASH0091', status: 'PAID' },
  { id: 4, amount: 5000, paidDate: 'Dec 1, 2025', method: 'Online', referenceId: 'TXN000987', status: 'PAID' },
]

export default function MyDues() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Dues" subtitle="Track and pay your hostel fees" />

      {/* Current due */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-500 font-medium">Current Outstanding</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              ₹{CURRENT_DUE.amount.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm mt-1">{CURRENT_DUE.description}</p>
            <div className="flex items-center gap-1.5 mt-2 text-amber-600 text-sm">
              <Clock size={14} />
              <span>Due by {CURRENT_DUE.dueDate} · {CURRENT_DUE.daysLeft} days left</span>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <CreditCard size={16} />
            Pay Now
          </button>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <CheckCircle2 size={16} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Method</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Reference</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PAYMENT_HISTORY.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-gray-700">{p.paidDate}</td>
                  <td className="px-5 py-3.5 text-gray-700">Monthly Hostel Fee</td>
                  <td className="px-5 py-3.5 text-gray-600">{p.method}</td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{p.referenceId}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={p.status} />
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

import { useState } from 'react'
import { CreditCard, Clock, CheckCircle2, IndianRupee, AlertTriangle } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

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
  const [tab, setTab] = useState<'due' | 'history'>('due')

  return (
    <div className="space-y-6">
      <PageHeader title="My Dues" subtitle="Track and pay your hostel fees" />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Current Due"
          value="₹5,000"
          sub="Due April 1, 2026"
          icon={<IndianRupee size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          trend={{ value: '23 days', up: true }}
        />
        <StatCard
          label="Total Paid"
          value="₹20,000"
          sub="Last 4 months"
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Overdue"
          value="₹0"
          sub="No overdue payments"
          icon={<AlertTriangle size={20} className="text-amber-500" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Pill tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['due', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'due' ? 'Current Due' : 'Payment History'}
          </button>
        ))}
      </div>

      {tab === 'due' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Amber alert bar */}
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{ background: '#fffbf0', borderBottom: '1px solid #fef3c7' }}
          >
            <Clock size={14} className="text-amber-500 shrink-0" />
            <p className="text-sm font-semibold text-amber-800">Payment due in {CURRENT_DUE.daysLeft} days</p>
            <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {CURRENT_DUE.dueDate}
            </span>
          </div>
          <div className="p-6 flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Outstanding Amount</p>
              <p className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">
                ₹{CURRENT_DUE.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1.5">{CURRENT_DUE.description}</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
            >
              <CreditCard size={16} /> Pay Now
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Payment History</h2>
            <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {PAYMENT_HISTORY.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Method</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Reference</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PAYMENT_HISTORY.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{p.paidDate}</td>
                    <td className="px-5 py-3.5 text-gray-600">Monthly Hostel Fee</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 tracking-wider">{p.referenceId}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">
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
      )}
    </div>
  )
}

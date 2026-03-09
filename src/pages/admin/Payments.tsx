import { useState } from 'react'
import { IndianRupee, X } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_DUES = [
  { id: 1, memberName: 'Arjun Sharma', roomNumber: 'A-101', amount: 5000, dueDate: 'Apr 1, 2026', status: 'PENDING' },
  { id: 2, memberName: 'Priya Singh', roomNumber: 'A-102', amount: 5000, dueDate: 'Apr 1, 2026', status: 'PAID' },
  { id: 3, memberName: 'Ravi Kumar', roomNumber: 'B-201', amount: 5000, dueDate: 'Apr 1, 2026', status: 'OVERDUE' },
  { id: 4, memberName: 'Sneha Patel', roomNumber: 'B-202', amount: 5000, dueDate: 'Apr 1, 2026', status: 'PENDING' },
  { id: 5, memberName: 'Ananya Iyer', roomNumber: 'C-302', amount: 5000, dueDate: 'Apr 1, 2026', status: 'PAID' },
  { id: 6, memberName: 'Mohit Verma', roomNumber: 'C-301', amount: 5000, dueDate: 'Mar 1, 2026', status: 'OVERDUE' },
]

type Due = typeof MOCK_DUES[number]

export default function Payments() {
  const [tab, setTab] = useState<'dues' | 'history'>('dues')
  const [confirmRecord, setConfirmRecord] = useState<Due | null>(null)

  function handleRecordPayment() {
    // TODO: call recordCashPayment() API
    setConfirmRecord(null)
  }

  const pendingDues = MOCK_DUES.filter((d) => d.status !== 'PAID')
  const paidDues = MOCK_DUES.filter((d) => d.status === 'PAID')

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Manage dues and record cash payments" />

      {/* Confirm modal */}
      {confirmRecord && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Record Cash Payment</h3>
              <button onClick={() => setConfirmRecord(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1">
              <p className="font-medium text-gray-800">{confirmRecord.memberName}</p>
              <p className="text-sm text-gray-500">Room {confirmRecord.roomNumber}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{confirmRecord.amount.toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-500 mb-5">Confirm cash payment receipt from this member?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRecord(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleRecordPayment} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['dues', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'dues' ? 'Pending Dues' : 'Payment History'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Member</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Room</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Due Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                {tab === 'dues' && <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(tab === 'dues' ? pendingDues : paidDues).map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{d.memberName}</td>
                  <td className="px-5 py-3.5 font-mono text-gray-700">{d.roomNumber}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    ₹{d.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{d.dueDate}</td>
                  <td className="px-5 py-3.5"><Badge status={d.status} /></td>
                  {tab === 'dues' && (
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setConfirmRecord(d)}
                        className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
                      >
                        <IndianRupee size={13} /> Record Cash
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_LEAVES = [
  { id: 1, hostellerName: 'Arjun Sharma', roomNumber: 'A-101', fromDate: 'Mar 15, 2026', toDate: 'Mar 18, 2026', reason: 'Family function at hometown', status: 'PENDING', appliedAt: 'Mar 8, 2026' },
  { id: 2, hostellerName: 'Priya Singh', roomNumber: 'A-102', fromDate: 'Mar 20, 2026', toDate: 'Mar 22, 2026', reason: 'Medical appointment', status: 'APPROVED', appliedAt: 'Mar 9, 2026' },
  { id: 3, hostellerName: 'Ravi Kumar', roomNumber: 'B-201', fromDate: 'Feb 10, 2026', toDate: 'Feb 12, 2026', reason: 'Personal work', status: 'REJECTED', appliedAt: 'Feb 5, 2026' },
  { id: 4, hostellerName: 'Sneha Patel', roomNumber: 'B-202', fromDate: 'Mar 25, 2026', toDate: 'Mar 30, 2026', reason: 'Parents visiting hometown', status: 'PENDING', appliedAt: 'Mar 9, 2026' },
]

export default function AdminLeave() {
  function updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    // TODO: call updateLeaveStatus() API
    console.log('Update leave', id, 'to', status)
  }

  const pending = MOCK_LEAVES.filter((l) => l.status === 'PENDING')
  const rest = MOCK_LEAVES.filter((l) => l.status !== 'PENDING')

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Requests" subtitle="Review and approve leave applications" />

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
            Pending Approval ({pending.length})
          </h2>
          {pending.map((l) => (
            <div key={l.id} className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{l.hostellerName}</p>
                    <span className="text-xs text-gray-400">Room {l.roomNumber}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {l.fromDate} → {l.toDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{l.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied: {l.appliedAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(l.id, 'REJECTED')}
                    className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(l.id, 'APPROVED')}
                    className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Resident</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Dates</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Reason</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Applied</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rest.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{l.hostellerName}</p>
                    <p className="text-xs text-gray-400">Room {l.roomNumber}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{l.fromDate} – {l.toDate}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{l.reason}</td>
                  <td className="px-5 py-3.5 text-gray-500">{l.appliedAt}</td>
                  <td className="px-5 py-3.5"><Badge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

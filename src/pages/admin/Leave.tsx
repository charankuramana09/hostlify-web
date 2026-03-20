import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { getPendingLeaves, reviewLeave } from '../../api/staff'
import { useToastStore } from '../../store/toastStore'

export default function AdminLeave() {
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => getPendingLeaves(),
  })

  const reviewMut = useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: 'APPROVED' | 'REJECTED'; reason?: string }) =>
      reviewLeave(id, { status, ...(reason ? { reason } : {}) }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
      if (vars.status === 'APPROVED') {
        show('success', 'Leave approved', 'The leave request has been approved.')
      } else {
        show('success', 'Leave rejected', 'The leave request has been rejected.')
      }
    },
    onError: () => {
      show('error', 'Action failed', 'Could not process the leave request. Please try again.')
    },
  })

  function updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    reviewMut.mutate({ id, status })
  }


  const pending = leaves.filter((l: any) => l.status === 'PENDING')
  const rest = leaves.filter((l: any) => l.status !== 'PENDING')

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Requests" subtitle="Review and approve leave applications" />

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
            Pending Approval ({pending.length})
          </h2>
          {pending.map((l: any) => (
            <div key={l.id} className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{l.hostellerName ?? l.applicantName}</p>
                    <span className="text-xs text-gray-400">Room {l.roomNumber}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {l.fromDate} → {l.toDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{l.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied: {l.appliedAt ?? l.createdAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(l.id, 'REJECTED')}
                    disabled={reviewMut.isPending}
                    className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(l.id, 'APPROVED')}
                    disabled={reviewMut.isPending}
                    className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
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
              {rest.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-gray-400">
                    No reviewed requests yet
                  </td>
                </tr>
              )}
              {rest.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{l.hostellerName ?? l.applicantName}</p>
                    <p className="text-xs text-gray-400">Room {l.roomNumber}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{l.fromDate} – {l.toDate}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{l.reason}</td>
                  <td className="px-5 py-3.5 text-gray-500">{l.appliedAt ?? l.createdAt}</td>
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

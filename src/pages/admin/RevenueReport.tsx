import { useQuery } from '@tanstack/react-query'
import { TrendingUp, IndianRupee, Users, BarChart3 } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'
import { getExpenseSummary, getPendingDues } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'

function formatINR(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function RevenueReport() {
  const { activeHostelId } = useAuthStore()

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['expenseSummary', activeHostelId, currentMonth, currentYear],
    queryFn: () => getExpenseSummary(activeHostelId!, currentMonth, currentYear),
    enabled: !!activeHostelId,
  })

  const { data: dues = [], isLoading: duesLoading } = useQuery({
    queryKey: ['dues', activeHostelId],
    queryFn: () => getPendingDues(activeHostelId!),
    enabled: !!activeHostelId,
  })

  const isLoading = summaryLoading || duesLoading

  const totalExpenses: number = summary?.total ?? 0
  const byCategory: { category: string; amount: number }[] = summary?.byCategory ?? []

  const paidDues = (dues as any[]).filter((d) => d.status === 'PAID')
  const totalCollected = paidDues.reduce((s: number, d: any) => s + (d.amount ?? 0), 0)
  const pendingDues = (dues as any[]).filter((d) => d.status !== 'PAID')
  const totalPending = pendingDues.reduce((s: number, d: any) => s + (d.amount ?? 0), 0)
  const totalMembers = dues.length

  const maxBarAmount = Math.max(totalCollected, totalExpenses, 1)

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Report"
        subtitle="Collection and expense analytics"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Collected This Month"
          value={formatINR(totalCollected)}
          sub={`${paidDues.length} members paid`}
          icon={<IndianRupee size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Pending Collection"
          value={formatINR(totalPending)}
          sub={`${pendingDues.length} members pending`}
          icon={<TrendingUp size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Total Members"
          value={totalMembers}
          sub="With dues tracked"
          icon={<Users size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <IndianRupee size={13} className="text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Expense Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {byCategory.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">
                      No expense data available
                    </td>
                  </tr>
                )}
                {byCategory.map((item) => {
                  const share = totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0
                  return (
                    <tr key={item.category} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-gray-800 text-xs leading-tight">{item.category}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-xs font-bold text-emerald-600">{formatINR(item.amount)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-1.5 rounded-full bg-emerald-500"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8 text-right">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {byCategory.length > 0 && (
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td className="px-5 py-3 font-bold text-gray-700 text-xs">Total Expenses</td>
                    <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900 text-sm">
                      {formatINR(totalExpenses)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collection vs Expenses Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart3 size={13} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Collection vs Expenses</h2>
          </div>
          <div className="flex items-end gap-6 h-48 justify-center">
            {[
              { label: 'Collected', amount: totalCollected, color: 'linear-gradient(180deg, #059669, #34d399)' },
              { label: 'Pending', amount: totalPending, color: 'linear-gradient(180deg, #f59e0b, #fcd34d)' },
              { label: 'Expenses', amount: totalExpenses, color: 'linear-gradient(180deg, #6366f1, #818cf8)' },
            ].map((d) => {
              const heightPct = maxBarAmount > 0 ? (d.amount / maxBarAmount) * 100 : 0
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-lg transition-all group-hover:opacity-80"
                      style={{ height: `${Math.max(heightPct, 2)}%`, background: d.color }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {formatINR(d.amount)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{d.label}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Hover bars to see amounts · Current month data</p>
        </div>
      </div>
    </div>
  )
}

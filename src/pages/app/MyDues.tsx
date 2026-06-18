import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CreditCard, Clock, CheckCircle2, AlertTriangle, Receipt, Wallet } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { getCurrentDue, getDuesHistory, getMyPaymentRecords, initiateRazorpay, verifyRazorpay } from '../../api/hosteller'
import { getHostel } from '../../api/staff'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'
import { openRazorpayCheckout } from '../../lib/razorpay'

function fmtDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function inr(n: any) { return '₹' + Number(n ?? 0).toLocaleString('en-IN') }
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const period = (d: any) => d.periodMonth ? `${MONTHS[d.periodMonth]} ${d.periodYear}` : 'Monthly Rent'
const isUnpaid = (s: string) => s === 'UNPAID' || s === 'PARTIAL' || s === 'OVERDUE'

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" /></div>
}

export default function MyDues() {
  const [tab, setTab] = useState<'due' | 'history'>('due')
  const [payingId, setPayingId] = useState<number | null>(null)
  const [successInfo, setSuccessInfo] = useState<any>(null)
  const queryClient = useQueryClient()
  const hostelId = useAuthStore((s) => s.hostelId)
  const { show } = useToastStore()

  const { data: hostelInfo } = useQuery({ queryKey: ['hostel-info', hostelId], queryFn: () => getHostel(hostelId!), enabled: !!hostelId })
  const onlinePaymentEnabled = hostelInfo?.onlinePaymentEnabled !== false

  const { data: currentDue, isLoading: dueLoading } = useQuery({ queryKey: ['current-due'], queryFn: getCurrentDue, retry: false })
  const { data: dues = [], isLoading: duesLoading } = useQuery({ queryKey: ['dues-history'], queryFn: getDuesHistory })
  const { data: records = [], isLoading: recordsLoading } = useQuery({ queryKey: ['my-records'], queryFn: getMyPaymentRecords })

  const duesList = dues as any[]
  const recordsList = records as any[]
  const pendingDues = duesList.filter((d) => isUnpaid(d.status))
  const totalPending = pendingDues.reduce((s, d) => s + Number(d.amount ?? 0), 0)
  const totalPaid = recordsList.reduce((s, r) => s + Number(r.amount ?? 0), 0)
  const monthlyRent = currentDue?.amount ?? duesList[0]?.amount

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['current-due'] })
    queryClient.invalidateQueries({ queryKey: ['dues-history'] })
    queryClient.invalidateQueries({ queryKey: ['my-records'] })
  }

  async function pay(due: any) {
    if (!onlinePaymentEnabled) {
      show('info', 'Pay at hostel', 'Online payment is disabled. Please pay your rent at the hostel reception.')
      return
    }
    setPayingId(due.id)
    try {
      const info = await initiateRazorpay(due.id)
      const result = await openRazorpayCheckout({
        keyId: info.keyId, orderId: info.orderId, amountPaise: info.amountPaise,
        currency: info.currency, hostellerName: info.hostellerName, description: `${period(due)} rent`,
      })
      if (!result) { setPayingId(null); return } // dismissed
      const details = await verifyRazorpay({
        razorpayPaymentId: result.razorpay_payment_id,
        razorpayOrderId: result.razorpay_order_id,
        razorpaySignature: result.razorpay_signature,
      })
      refresh()
      setSuccessInfo({
        amount: details?.amount ?? due.amount,
        paymentId: details?.paymentId ?? result.razorpay_payment_id,
        method: details?.method ?? 'RAZORPAY',
        paymentDate: details?.paymentDate,
        period: period(due),
      })
    } catch (e: any) {
      show('error', 'Payment failed', e?.response?.data?.message ?? e?.message ?? 'Please try again or pay at the hostel.')
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Payments" subtitle="Your monthly rent, dues and payment history" />

      {/* Payment success receipt */}
      {successInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">
            <div className="flex flex-col items-center text-center px-6 pt-8 pb-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 size={34} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Payment Successful</h2>
              <p className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">{inr(successInfo.amount)}</p>
              <p className="text-sm text-gray-400 mt-1">{successInfo.period} rent paid</p>
            </div>
            <div className="mx-6 mb-5 rounded-xl bg-gray-50 divide-y divide-gray-100 text-sm">
              {[
                { l: 'Status', v: <Badge status="SUCCESS" /> },
                { l: 'Method', v: successInfo.method },
                { l: 'Payment ID', v: <span className="font-mono text-xs">{successInfo.paymentId}</span> },
                { l: 'Date', v: fmtDate(successInfo.paymentDate) },
              ].map(({ l, v }) => (
                <div key={l} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-gray-400 font-medium">{l}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setSuccessInfo(null); setTab('history') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                View History
              </button>
              <button onClick={() => setSuccessInfo(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white brand-gradient hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Monthly Rent" value={monthlyRent != null ? inr(monthlyRent) : '—'}
          sub={currentDue?.dueDate ? `Current due ${fmtDate(currentDue.dueDate)}` : 'No active due'}
          icon={<Wallet size={20} className="text-brand-600" />} iconBg="bg-brand-50" />
        <StatCard label="Outstanding" value={inr(totalPending)}
          sub={pendingDues.length ? `${pendingDues.length} unpaid due${pendingDues.length !== 1 ? 's' : ''}` : 'All clear 🎉'}
          icon={<AlertTriangle size={20} className="text-amber-500" />} iconBg="bg-amber-50" />
        <StatCard label="Total Paid" value={inr(totalPaid)}
          sub={`${recordsList.length} payment${recordsList.length !== 1 ? 's' : ''}`}
          icon={<CheckCircle2 size={20} className="text-emerald-600" />} iconBg="bg-emerald-50" />
      </div>

      {/* Highlighted current due banner */}
      {!dueLoading && currentDue && isUnpaid(currentDue.status) && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#fffbf0', borderBottom: '1px solid #fef3c7' }}>
            <Clock size={14} className="text-amber-500 shrink-0" />
            <p className="text-sm font-semibold text-amber-800">{period(currentDue)} rent is due</p>
            {currentDue.dueDate && <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">Due {fmtDate(currentDue.dueDate)}</span>}
          </div>
          <div className="p-6 flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Outstanding Amount</p>
              <p className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">{inr(currentDue.amount)}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button onClick={() => pay(currentDue)} disabled={payingId === currentDue.id}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 brand-gradient">
                <CreditCard size={16} /> {payingId === currentDue.id ? 'Processing…' : onlinePaymentEnabled ? 'Pay Now' : 'Pay at Hostel'}
              </button>
              {onlinePaymentEnabled && (
                <p className="text-[11px] text-gray-400">Or pay by cash at reception — staff will record it.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pill tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['due', 'history'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'due' ? `Dues (${pendingDues.length})` : `Payment History (${recordsList.length})`}
          </button>
        ))}
      </div>

      {/* Dues tab — every month's due with pay action */}
      {tab === 'due' && (
        duesLoading ? <Spinner /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Period', 'Amount', 'Due Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {duesList.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-700">{period(d)}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">{inr(d.amount)}</td>
                      <td className="px-5 py-3.5 text-gray-500">{fmtDate(d.dueDate)}</td>
                      <td className="px-5 py-3.5"><Badge status={d.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        {isUnpaid(d.status) ? (
                          <button onClick={() => pay(d)} disabled={payingId === d.id}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg brand-gradient hover:opacity-90 disabled:opacity-60">
                            <CreditCard size={12} /> {payingId === d.id ? '…' : onlinePaymentEnabled ? 'Pay' : 'At Hostel'}
                          </button>
                        ) : <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 size={13} /> Paid</span>}
                      </td>
                    </tr>
                  ))}
                  {duesList.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No dues yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* History tab — actual payment transactions */}
      {tab === 'history' && (
        recordsLoading ? <Spinner /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"><Receipt size={14} className="text-emerald-600" /></div>
              <h2 className="font-semibold text-gray-800 text-sm">Payment History</h2>
              <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{recordsList.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Date', 'Method', 'Reference', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {recordsList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 text-gray-700 font-medium">{fmtDate(p.paymentDate ?? p.createdAt)}</td>
                      <td className="px-5 py-3.5"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{p.paymentMethod ?? '—'}</span></td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500 tracking-wider">{p.razorpayPaymentId ?? p.transactionRef ?? '—'}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600">{inr(p.amount)}</td>
                      <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                    </tr>
                  ))}
                  {recordsList.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No payments yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Phone, Mail, Home, CreditCard, MessageSquare, Activity, LogOut } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import { getMemberById, checkoutHosteller } from '../../api/staff'

const CATEGORY_COLORS: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Plumbing: 'bg-teal-50 text-teal-700',
  Food: 'bg-orange-50 text-orange-700',
  Other: 'bg-gray-100 text-gray-600',
}

const ACTIVITY_DOT: Record<string, string> = {
  allocation: 'bg-indigo-500',
  payment: 'bg-amber-500',
  complaint: 'bg-emerald-500',
}

type Tab = 'overview' | 'payments' | 'complaints' | 'activity'

export default function MemberDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showCheckout, setShowCheckout] = useState(false)

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => getMemberById(Number(id)),
    enabled: !!id,
  })

  const checkoutMut = useMutation({
    mutationFn: () => checkoutHosteller(member?.bookingId ?? member?.id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      setShowCheckout(false)
      navigate(-1)
    },
  })

  const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity },
  ]

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  if (!member) return (
    <div className="flex flex-col items-center justify-center py-20 gap-2">
      <p className="font-semibold text-gray-400 text-sm">Member not found</p>
      <button onClick={() => navigate(-1)} className="text-xs text-emerald-600 hover:underline">Go back</button>
    </div>
  )

  const payments: any[] = member.payments ?? []
  const complaints: any[] = member.complaints ?? []
  const activity: any[] = member.activity ?? []
  const totalCollected = payments.filter((p: any) => p.status === 'PAID').reduce((s: number, p: any) => s + (p.amount ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Back to Members
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="h-20 relative"
          style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(30%, -30%)' }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-9 mb-4 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-white shrink-0">
              {(member.name ?? '??').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Checkout Member
            </button>
          </div>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                  {member.roomNumber ?? '—'}
                </span>
                <Badge status={member.status ?? 'ACTIVE'} />
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mail size={13} /> {member.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Phone size={13} /> {member.phone ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border-t border-gray-100">
          {[
            { label: 'Room', value: `${member.roomNumber ?? '—'}${member.type ? ' · ' + member.type : ''}` },
            { label: 'Advance', value: member.advance != null ? `₹${member.advance.toLocaleString()}` : '—' },
            { label: 'Monthly Rent', value: member.monthlyRent != null ? `₹${member.monthlyRent.toLocaleString()}` : '—' },
            { label: 'Join Date', value: member.joinDate ? new Date(member.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
          ].map((s) => (
            <div key={s.label} className="bg-white px-5 py-3.5 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Personal Details</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                ['Full Name', member.name],
                ['Gender', member.gender ?? '—'],
                ['Date of Birth', member.dob ?? '—'],
                ['Phone', member.phone ?? '—'],
                ['Email', member.email],
                ['Address', member.address ?? '—'],
                ['Floor', member.floor ?? '—'],
                ['Bed Number', member.bedNumber ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-4 px-5 py-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 shrink-0 pt-0.5">{label}</p>
                  <p className="text-sm text-gray-700 font-medium flex-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Emergency Contact</h3>
            </div>
            <div className="p-5 space-y-3">
              {member.emergencyContact ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {(member.emergencyContact.name ?? '?')[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{member.emergencyContact.name}</p>
                      <p className="text-xs text-gray-400">{member.emergencyContact.relation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    {member.emergencyContact.phone}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">No emergency contact on file.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl border border-emerald-100 px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm text-emerald-700 font-medium">Total Collected</p>
            <p className="text-lg font-bold text-emerald-700">₹{totalCollected.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Month</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Paid Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Method</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Reference</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No payment records available</td>
                    </tr>
                  )}
                  {payments.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-800">{p.month}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">₹{(p.amount ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-gray-500">{p.paidDate ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{p.method ?? '—'}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{p.ref ?? '—'}</td>
                      <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-3">
          {complaints.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 flex flex-col items-center gap-2">
              <p className="font-semibold text-gray-400 text-sm">No complaints filed</p>
            </div>
          )}
          {complaints.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{c.date ?? c.createdAt}</p>
                </div>
                <Badge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {activity.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No activity records available</p>
          )}
          <div className="space-y-0">
            {activity.map((a: any, i: number) => (
              <div key={a.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${ACTIVITY_DOT[a.type] ?? 'bg-gray-400'}`} />
                  {i < activity.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                </div>
                <div className="pb-5">
                  <p className="text-sm text-gray-800 font-medium">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <LogOut size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Checkout Member</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to checkout <span className="font-semibold text-gray-700">{member.name}</span>? This will vacate room {member.roomNumber ?? '—'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => checkoutMut.mutate()}
                disabled={checkoutMut.isPending}
                className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90 bg-red-500 disabled:opacity-60"
              >
                {checkoutMut.isPending ? 'Processing…' : 'Confirm Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

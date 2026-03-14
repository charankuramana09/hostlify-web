import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Home, CreditCard, MessageSquare, Activity, LogOut } from 'lucide-react'
import Badge from '../../components/ui/Badge'

const MOCK_MEMBER = {
  id: 1, name: 'Arjun Sharma', email: 'arjun@example.com', phone: '9876543210',
  gender: 'Male', dob: 'Jan 15, 2000', roomNumber: 'A-101', bedNumber: 'B1',
  floor: 'Ground Floor', type: 'AC Double', joinDate: 'Sep 1, 2025',
  advance: 10000, monthlyRent: 5000, status: 'ACTIVE',
  address: '42, MG Road, Bangalore - 560001',
  emergencyContact: { name: 'Suresh Sharma', phone: '9876500099', relation: 'Father' },
}

const MOCK_PAYMENTS = [
  { id: 1, month: 'March 2026', amount: 5000, paidDate: 'Mar 5, 2026', method: 'UPI', ref: 'TXN9876543', status: 'PAID' },
  { id: 2, month: 'February 2026', amount: 5000, paidDate: 'Feb 3, 2026', method: 'Cash', ref: '-', status: 'PAID' },
  { id: 3, month: 'January 2026', amount: 5000, paidDate: null, ref: '-', status: 'OVERDUE' },
]

const MOCK_COMPLAINTS = [
  { id: 1, title: 'AC not cooling', category: 'Maintenance', status: 'RESOLVED', date: 'Mar 7, 2026' },
  { id: 2, title: 'Water heater issue', category: 'Plumbing', status: 'CLOSED', date: 'Feb 5, 2026' },
]

const MOCK_ACTIVITY = [
  { id: 1, text: 'Room allocated: A-101', date: 'Sep 1, 2025', type: 'allocation' },
  { id: 2, text: 'January dues marked OVERDUE', date: 'Feb 1, 2026', type: 'payment' },
  { id: 3, text: 'Complaint #1 resolved', date: 'Mar 10, 2026', type: 'complaint' },
]

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
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showCheckout, setShowCheckout] = useState(false)

  const totalCollected = MOCK_PAYMENTS.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)

  const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity },
  ]

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
              {MOCK_MEMBER.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
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
                <h2 className="text-xl font-bold text-gray-900">{MOCK_MEMBER.name}</h2>
                <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg tracking-wider">
                  {MOCK_MEMBER.roomNumber}
                </span>
                <Badge status={MOCK_MEMBER.status} />
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mail size={13} /> {MOCK_MEMBER.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Phone size={13} /> {MOCK_MEMBER.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border-t border-gray-100">
          {[
            { label: 'Room', value: `${MOCK_MEMBER.roomNumber} · ${MOCK_MEMBER.type}` },
            { label: 'Advance', value: `₹${MOCK_MEMBER.advance.toLocaleString()}` },
            { label: 'Monthly Rent', value: `₹${MOCK_MEMBER.monthlyRent.toLocaleString()}` },
            { label: 'Join Date', value: MOCK_MEMBER.joinDate },
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
                ['Full Name', MOCK_MEMBER.name],
                ['Gender', MOCK_MEMBER.gender],
                ['Date of Birth', MOCK_MEMBER.dob],
                ['Phone', MOCK_MEMBER.phone],
                ['Email', MOCK_MEMBER.email],
                ['Address', MOCK_MEMBER.address],
                ['Floor', MOCK_MEMBER.floor],
                ['Bed Number', MOCK_MEMBER.bedNumber],
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
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {MOCK_MEMBER.emergencyContact.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{MOCK_MEMBER.emergencyContact.name}</p>
                  <p className="text-xs text-gray-400">{MOCK_MEMBER.emergencyContact.relation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" />
                {MOCK_MEMBER.emergencyContact.phone}
              </div>
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
                  {MOCK_PAYMENTS.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-800">{p.month}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">₹{p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-gray-500">{p.paidDate ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{p.method ?? '—'}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{p.ref}</td>
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
          {MOCK_COMPLAINTS.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{c.date}</p>
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
          <div className="space-y-0">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={a.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${ACTIVITY_DOT[a.type] ?? 'bg-gray-400'}`} />
                  {i < MOCK_ACTIVITY.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
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
              Are you sure you want to checkout <span className="font-semibold text-gray-700">{MOCK_MEMBER.name}</span>? This will vacate room {MOCK_MEMBER.roomNumber}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90 bg-red-500"
              >
                Confirm Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

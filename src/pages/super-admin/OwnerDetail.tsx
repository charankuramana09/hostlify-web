import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Badge from '../../components/ui/Badge'

const MOCK_OWNER = {
  id: 1, name: 'Vikram Mehta', email: 'vikram@sunrise.com', phone: '9876500001',
  plan: 'PROFESSIONAL', status: 'ACTIVE', since: 'Jan 15, 2025',
  planExpiry: 'Jan 15, 2027', hostels: 2, members: 170, revenue: 1125000,
  hostelsData: [
    { name: 'Sunrise Hostel',       city: 'Bangalore', members: 98, capacity: 120, status: 'ACTIVE' },
    { name: 'Green Valley Hostel',  city: 'Hyderabad', members: 72, capacity: 80,  status: 'ACTIVE' },
  ],
  features: {
    onlinePayments: true, referral: true, parking: true,
    cleaning: false, employees: true, advancedReports: false,
  },
}

const PLAN_CHIP: Record<string, string> = {
  STARTER: 'bg-gray-100 text-gray-600',
  PROFESSIONAL: 'bg-indigo-50 text-indigo-700',
  ENTERPRISE: 'bg-violet-50 text-violet-700',
}

const FEATURE_LABELS: Record<string, string> = {
  onlinePayments: 'Online Payments',
  referral: 'Referral Program',
  parking: 'Parking Management',
  cleaning: 'Cleaning Requests',
  employees: 'Employee Salary',
  advancedReports: 'Advanced Reports',
}

export default function OwnerDetail() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Back to Owners
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="h-20 relative"
          style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', transform: 'translate(30%, -30%)' }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-9 mb-4 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {MOCK_OWNER.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                Suspend Account
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
              >
                Renew Plan
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{MOCK_OWNER.name}</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PLAN_CHIP[MOCK_OWNER.plan] ?? 'bg-gray-100 text-gray-600'}`}>
              {MOCK_OWNER.plan}
            </span>
            <Badge status={MOCK_OWNER.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{MOCK_OWNER.email} · {MOCK_OWNER.phone}</p>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border-t border-gray-100">
          {[
            { label: 'Hostels', value: MOCK_OWNER.hostels },
            { label: 'Members', value: MOCK_OWNER.members },
            { label: 'Revenue', value: `₹${(MOCK_OWNER.revenue / 100000).toFixed(2)}L` },
            { label: 'Plan Expiry', value: MOCK_OWNER.planExpiry },
          ].map((s) => (
            <div key={s.label} className="bg-white px-5 py-3.5 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostels Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">Hostels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">City</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Occupancy</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_OWNER.hostelsData.map((h) => {
                  const rate = Math.round((h.members / h.capacity) * 100)
                  return (
                    <tr key={h.name} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-800">{h.name}</td>
                      <td className="px-5 py-3.5 text-gray-500">{h.city}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${rate}%`,
                                background: rate >= 80 ? 'linear-gradient(90deg, #059669, #34d399)' : 'linear-gradient(90deg, #d97706, #fbbf24)',
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{h.members}/{h.capacity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><Badge status={h.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">Feature Flags</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {Object.entries(MOCK_OWNER.features).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-gray-700">{FEATURE_LABELS[key] ?? key}</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

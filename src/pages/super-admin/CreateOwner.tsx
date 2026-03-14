import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: '₹999/mo',
    features: ['1 hostel', 'Up to 50 members', 'Basic reports', 'Email support'],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: '₹2,499/mo',
    features: ['Up to 3 hostels', 'Up to 200 members', 'Advanced reports', 'Priority support'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: '₹5,999/mo',
    features: ['Unlimited hostels', 'Unlimited members', 'Full analytics', 'Dedicated support'],
  },
]

const FEATURE_FLAGS = [
  { id: 'onlinePayments', label: 'Online Payments' },
  { id: 'referral', label: 'Referral Program' },
  { id: 'parking', label: 'Parking Management' },
  { id: 'cleaning', label: 'Cleaning Requests' },
  { id: 'employees', label: 'Employee Salary' },
  { id: 'advancedReports', label: 'Advanced Reports' },
]

type Features = Record<string, boolean>

export default function CreateOwner() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  })
  const [selectedPlan, setSelectedPlan] = useState('PROFESSIONAL')
  const [features, setFeatures] = useState<Features>({
    onlinePayments: true, referral: false, parking: false, cleaning: false, employees: false, advancedReports: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call createOwner API
    navigate('/super-admin/owners')
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <PageHeader
        title="Create Owner Account"
        subtitle="Set up a new hostel owner on the platform"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Owner Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <UserPlus size={14} className="text-violet-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">Owner Details</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'firstName', label: 'First Name', placeholder: 'Vikram' },
              { key: 'lastName', label: 'Last Name', placeholder: 'Mehta' },
              { key: 'email', label: 'Email', placeholder: 'owner@hostel.com', type: 'email' },
              { key: 'phone', label: 'Phone', placeholder: '9876500000' },
              { key: 'password', label: 'Password', placeholder: 'Min 8 characters', type: 'password' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {field.label}
                </label>
                <input
                  required
                  type={field.type ?? 'text'}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Subscription Plan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Subscription Plan</h2>
            <p className="text-xs text-gray-400 mt-0.5">Choose the plan for this owner</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const selected = selectedPlan === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 bg-white hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 text-sm">{plan.name}</span>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${selected ? 'border-violet-500 bg-violet-500' : 'border-gray-300'}`} />
                  </div>
                  <p className={`text-lg font-bold mb-3 ${selected ? 'text-violet-700' : 'text-gray-800'}`}>{plan.price}</p>
                  <ul className="space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected ? 'bg-violet-500' : 'bg-gray-300'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 3: Feature Flags */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Feature Flags</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enable or disable features for this owner</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {FEATURE_FLAGS.map((flag) => (
              <label key={flag.id} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{flag.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={features[flag.id] ?? false}
                    onChange={(e) => setFeatures((f) => ({ ...f, [flag.id]: e.target.checked }))}
                  />
                  <div
                    className={`w-10 h-5 rounded-full transition-colors ${
                      features[flag.id] ? 'bg-violet-500' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        features[flag.id] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/super-admin/owners')}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
          >
            <UserPlus size={16} /> Create Owner Account
          </button>
        </div>
      </form>
    </div>
  )
}

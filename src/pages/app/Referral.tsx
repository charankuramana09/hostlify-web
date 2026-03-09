import { useState } from 'react'
import { Copy, Check, Users, Gift } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

const MOCK_REFERRAL = {
  code: 'ARJUN2026',
  referredCount: 3,
  reward: "₹500 off next month's fee",
}

const MOCK_REFERRED = [
  { id: 1, name: 'Ravi Kumar', joinDate: 'Jan 15, 2026', status: 'Joined' },
  { id: 2, name: 'Priya Singh', joinDate: 'Feb 5, 2026', status: 'Joined' },
  { id: 3, name: 'Anil Mehta', joinDate: 'Mar 1, 2026', status: 'Pending' },
]

export default function Referral() {
  const [copied, setCopied] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(MOCK_REFERRAL.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Referral" subtitle="Invite friends and earn rewards" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Referred"
          value={MOCK_REFERRAL.referredCount}
          sub="Friends who joined via your code"
          icon={<Users size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Your Reward"
          value={MOCK_REFERRAL.reward}
          sub="Applied automatically on next due"
          icon={<Gift size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Referral code */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm font-medium mb-1">Your Referral Code</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-bold tracking-widest">{MOCK_REFERRAL.code}</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-indigo-200 text-sm mt-3">
          Share this code with friends. They get ₹200 off, you get ₹500 off.
        </p>
      </div>

      {/* Referred list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Referred Friends</h2>
        </div>
        {MOCK_REFERRED.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No referrals yet. Share your code!</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {MOCK_REFERRED.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Joined {r.joinDate}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.status === 'Joined' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

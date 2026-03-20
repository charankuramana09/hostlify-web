import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import {
  getOwnerById,
  getOwnerHostels,
  getSubscription,
  getFeatureFlags,
  suspendOwner,
  resetOwnerPassword,
} from '../../api/superadmin'

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
  const { id } = useParams<{ id: string }>()
  const ownerId = Number(id)
  const queryClient = useQueryClient()
  const [resetPasswordInput, setResetPasswordInput] = useState('')

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['sa-owner', ownerId],
    queryFn: () => getOwnerById(ownerId),
    enabled: !!ownerId,
  })

  const { data: hostelsData, isLoading: hostelsLoading } = useQuery({
    queryKey: ['sa-owner-hostels', ownerId],
    queryFn: () => getOwnerHostels(ownerId),
    enabled: !!ownerId,
  })

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['sa-subscription', ownerId],
    queryFn: () => getSubscription(ownerId),
    enabled: !!ownerId,
  })

  const { data: featureFlagsData, isLoading: flagsLoading } = useQuery({
    queryKey: ['sa-feature-flags', ownerId],
    queryFn: () => getFeatureFlags(ownerId),
    enabled: !!ownerId,
  })

  const suspendMutation = useMutation({
    mutationFn: () => suspendOwner(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sa-owner', ownerId] })
      queryClient.invalidateQueries({ queryKey: ['sa-owners'] })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (newPassword: string) => resetOwnerPassword(ownerId, newPassword),
  })

  if (ownerLoading || hostelsLoading || subLoading || flagsLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    )

  const ownerData = owner ?? {}
  const hostels: Array<{
    name: string
    city: string
    members: number
    capacity: number
    status: string
  }> = hostelsData ?? []

  const plan: string = subscription?.plan ?? ownerData.plan ?? 'STARTER'
  const planExpiry: string = subscription?.expiryDate ?? ownerData.planExpiry ?? '-'

  const features: Record<string, boolean> = (() => {
    if (Array.isArray(featureFlagsData)) {
      return featureFlagsData.reduce((acc: Record<string, boolean>, f: { key: string; enabled: boolean }) => {
        acc[f.key] = f.enabled
        return acc
      }, {})
    }
    return featureFlagsData ?? {}
  })()

  const ownerName: string = (ownerData.name ?? `${ownerData.firstName ?? ''} ${ownerData.lastName ?? ''}`.trim()) || 'Owner'
  const initials = ownerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

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
              {initials}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => suspendMutation.mutate()}
                disabled={suspendMutation.isPending}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                {suspendMutation.isPending ? 'Suspending...' : 'Suspend Account'}
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
            <h2 className="text-xl font-bold text-gray-900">{ownerName}</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PLAN_CHIP[plan] ?? 'bg-gray-100 text-gray-600'}`}>
              {plan}
            </span>
            <Badge status={ownerData.status ?? 'ACTIVE'} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{ownerData.email ?? ''} · {ownerData.phone ?? ownerData.mobile ?? ''}</p>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border-t border-gray-100">
          {[
            { label: 'Hostels', value: ownerData.hostels ?? hostels.length },
            { label: 'Members', value: ownerData.members ?? hostels.reduce((s: number, h: { members: number }) => s + h.members, 0) },
            { label: 'Revenue', value: `₹${((ownerData.revenue ?? 0) / 100000).toFixed(2)}L` },
            { label: 'Plan Expiry', value: planExpiry },
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
                {hostels.map((h) => {
                  const rate = h.capacity > 0 ? Math.round((h.members / h.capacity) * 100) : 0
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
                {hostels.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">No hostels found</td>
                  </tr>
                )}
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
            {Object.entries(features).map(([key, enabled]) => (
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
            {Object.keys(features).length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No feature flags configured</div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Reset Owner Password</h3>
        </div>
        <div className="p-5 flex items-center gap-3">
          <input
            type="password"
            value={resetPasswordInput}
            onChange={(e) => setResetPasswordInput(e.target.value)}
            placeholder="New password"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors"
          />
          <button
            onClick={() => {
              if (resetPasswordInput) resetPasswordMutation.mutate(resetPasswordInput)
            }}
            disabled={resetPasswordMutation.isPending || !resetPasswordInput}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
        {resetPasswordMutation.isSuccess && (
          <p className="px-5 pb-4 text-sm text-emerald-600 font-medium">Password reset successfully.</p>
        )}
        {resetPasswordMutation.isError && (
          <p className="px-5 pb-4 text-sm text-red-500 font-medium">Failed to reset password. Please try again.</p>
        )}
      </div>
    </div>
  )
}

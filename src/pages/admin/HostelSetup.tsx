import { useState, useEffect, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Wifi, IndianRupee, CalendarClock, Building2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'
import {
  getHostelAmenities, updateHostelAmenities,
  getHostelPricing, updateHostelPricing,
  getBookingSettings, updateBookingSettings,
} from '../../api/staff'

type TabType = 'amenities' | 'pricing' | 'booking'

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors'

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {children}
    </button>
  )
}

export default function HostelSetup() {
  const { activeHostelId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [tab, setTab] = useState<TabType>('amenities')

  // ── Amenities ────────────────────────────────────────────────────────────────
  const { data: amenitiesData, isLoading: amenitiesLoading } = useQuery({
    queryKey: ['hostel-amenities', activeHostelId],
    queryFn: () => getHostelAmenities(activeHostelId!),
    enabled: !!activeHostelId && tab === 'amenities',
  })

  const [amenities, setAmenities] = useState<{ key: string; label: string; enabled: boolean }[]>([])

  useEffect(() => {
    if (amenitiesData) {
      setAmenities(
        Array.isArray(amenitiesData)
          ? amenitiesData.map((a: any) => ({ key: a.key ?? a.name, label: a.label ?? a.name, enabled: a.enabled ?? false }))
          : [],
      )
    }
  }, [amenitiesData])

  const saveAmenitiesMut = useMutation({
    mutationFn: () => updateHostelAmenities(activeHostelId!, amenities.map(({ key, enabled }) => ({ key, enabled }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-amenities', activeHostelId] })
      show('success', 'Amenities saved')
    },
    onError: () => show('error', 'Failed to save amenities'),
  })

  // ── Pricing ──────────────────────────────────────────────────────────────────
  const { data: pricingData, isLoading: pricingLoading } = useQuery({
    queryKey: ['hostel-pricing', activeHostelId],
    queryFn: () => getHostelPricing(activeHostelId!),
    enabled: !!activeHostelId && tab === 'pricing',
  })

  const [tiers, setTiers] = useState<{ tierName: string; monthlyRent: string; description: string }[]>([])

  useEffect(() => {
    if (pricingData) {
      setTiers(
        Array.isArray(pricingData)
          ? pricingData.map((t: any) => ({
              tierName: t.tierName ?? '',
              monthlyRent: String(t.monthlyRent ?? ''),
              description: t.description ?? '',
            }))
          : [],
      )
    }
  }, [pricingData])

  const savePricingMut = useMutation({
    mutationFn: () =>
      updateHostelPricing(activeHostelId!, tiers.map((t) => ({ ...t, monthlyRent: Number(t.monthlyRent) }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-pricing', activeHostelId] })
      show('success', 'Pricing updated')
    },
    onError: () => show('error', 'Failed to update pricing'),
  })

  // ── Booking Settings ──────────────────────────────────────────────────────────
  const { data: bookingSettingsData, isLoading: bookingSettingsLoading } = useQuery({
    queryKey: ['booking-settings', activeHostelId],
    queryFn: () => getBookingSettings(activeHostelId!),
    enabled: !!activeHostelId && tab === 'booking',
  })

  const [bkSettings, setBkSettings] = useState({
    selfBookingEnabled: false,
    requiresAdminApproval: true,
    autoExpireDays: 7,
  })

  useEffect(() => {
    if (bookingSettingsData) {
      setBkSettings({
        selfBookingEnabled:    bookingSettingsData.selfBookingEnabled ?? false,
        requiresAdminApproval: bookingSettingsData.requiresAdminApproval ?? true,
        autoExpireDays:        bookingSettingsData.autoExpireDays ?? 7,
      })
    }
  }, [bookingSettingsData])

  const saveBookingMut = useMutation({
    mutationFn: () => updateBookingSettings(activeHostelId!, bkSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-settings', activeHostelId] })
      show('success', 'Booking settings saved')
    },
    onError: () => show('error', 'Failed to save booking settings'),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Hostel Setup" subtitle="Manage amenities, pricing, and booking settings" />

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <TabButton active={tab === 'amenities'} onClick={() => setTab('amenities')}>
          <span className="flex items-center gap-1.5"><Wifi size={13} /> Amenities</span>
        </TabButton>
        <TabButton active={tab === 'pricing'} onClick={() => setTab('pricing')}>
          <span className="flex items-center gap-1.5"><IndianRupee size={13} /> Pricing</span>
        </TabButton>
        <TabButton active={tab === 'booking'} onClick={() => setTab('booking')}>
          <span className="flex items-center gap-1.5"><CalendarClock size={13} /> Booking</span>
        </TabButton>
      </div>

      {/* ── Amenities Tab ── */}
      {tab === 'amenities' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Wifi size={14} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Amenities</h3>
          </div>
          {amenitiesLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : amenities.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No amenities configured for this hostel.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {amenities.map((a, i) => (
                  <label key={a.key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={a.enabled}
                      onChange={(e) => {
                        const updated = [...amenities]
                        updated[i] = { ...updated[i], enabled: e.target.checked }
                        setAmenities(updated)
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{a.label || a.key}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => saveAmenitiesMut.mutate()}
                disabled={saveAmenitiesMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
              >
                <Save size={14} />
                {saveAmenitiesMut.isPending ? 'Saving…' : 'Save Amenities'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Pricing Tab ── */}
      {tab === 'pricing' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <IndianRupee size={14} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Pricing Tiers</h3>
          </div>
          {pricingLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : (
            <>
              {tiers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No pricing tiers configured.</p>
              )}
              <div className="space-y-4 mb-5">
                {tiers.map((tier, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-gray-100 rounded-xl">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tier Name</label>
                      <input className={inputCls} value={tier.tierName}
                        onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], tierName: e.target.value }; setTiers(u) }}
                        placeholder="e.g. Standard" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Rent (₹)</label>
                      <input type="number" className={inputCls} value={tier.monthlyRent}
                        onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], monthlyRent: e.target.value }; setTiers(u) }}
                        placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                      <input className={inputCls} value={tier.description}
                        onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], description: e.target.value }; setTiers(u) }}
                        placeholder="e.g. AC room, attached bathroom" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTiers((t) => [...t, { tierName: '', monthlyRent: '', description: '' }])}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  + Add Tier
                </button>
                <button
                  onClick={() => savePricingMut.mutate()}
                  disabled={savePricingMut.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
                >
                  <Save size={14} />
                  {savePricingMut.isPending ? 'Saving…' : 'Save Pricing'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Booking Settings Tab ── */}
      {tab === 'booking' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <CalendarClock size={14} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Booking Settings</h3>
          </div>
          {bookingSettingsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bkSettings.selfBookingEnabled}
                  onChange={(e) => setBkSettings((s) => ({ ...s, selfBookingEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Self Booking Enabled</p>
                  <p className="text-xs text-gray-400">Allow hostellers to book beds themselves via the app</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bkSettings.requiresAdminApproval}
                  onChange={(e) => setBkSettings((s) => ({ ...s, requiresAdminApproval: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Requires Admin Approval</p>
                  <p className="text-xs text-gray-400">Booking requests must be approved by staff before confirmation</p>
                </div>
              </label>

              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Auto-expire After (days)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className={inputCls}
                  value={bkSettings.autoExpireDays}
                  onChange={(e) => setBkSettings((s) => ({ ...s, autoExpireDays: Number(e.target.value) }))}
                />
                <p className="text-xs text-gray-400 mt-1">Pending requests automatically expire after this many days</p>
              </div>

              <button
                onClick={() => saveBookingMut.mutate()}
                disabled={saveBookingMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              >
                <Save size={14} />
                {saveBookingMut.isPending ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Placeholder for hostel basic info note */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <Building2 size={14} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-800">Hostel Basic Info</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            To update hostel name, address, contact, and rent — go to <strong>Settings → General</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

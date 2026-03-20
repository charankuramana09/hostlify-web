import { useState } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function SAAccount() {
  const { email } = useAuthStore()

  const [form, setForm] = useState({
    firstName: 'Admin',
    lastName: 'User',
    mobile: '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call updateProfile API
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Feature coming soon
    setPasswords({ current: '', newPass: '', confirm: '' })
  }

  return (
    <div className="space-y-6">
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
          <div className="flex items-end gap-4 -mt-9 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {form.firstName[0]}{form.lastName[0]}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{form.firstName} {form.lastName}</h2>
            <span className="text-xs font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
              SUPER ADMIN
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{email ?? 'admin@hostlify.in'}</p>
          <p className="text-xs text-gray-400 mt-0.5">Member since January 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Edit Profile + Change Password */}
        <div className="space-y-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Edit Profile</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile</label>
                <input
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700 font-medium">
                Feature coming soon
              </div>
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'newPass', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type="password"
                    disabled
                    value={passwords[field.key as keyof typeof passwords]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-colors opacity-50 cursor-not-allowed"
                  />
                </div>
              ))}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 opacity-50 cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)' }}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Platform Info + Danger Zone */}
        <div className="space-y-6">
          {/* Platform Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <Shield size={14} className="text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Platform Info</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                ['Version', 'Hostlify v1.0.0'],
                ['Environment', 'Production'],
                ['Last Login', 'Mar 15, 2026 · 09:42 AM'],
                ['Active Sessions', '1 device'],
                ['Role', 'SUPER_ADMIN'],
                ['Member Since', 'January 2025'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-50">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle size={14} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-red-700 text-sm">Danger Zone</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Sign Out All Sessions</p>
                  <p className="text-xs text-gray-500 mt-0.5">Log out from all active devices</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 bg-white transition-colors whitespace-nowrap">
                  Sign Out All
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Deactivate Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently deactivate this account</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

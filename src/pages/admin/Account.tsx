import { useState } from 'react'
import { Mail, Phone, Shield, Camera, Save, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'

interface PasswordState {
  current: string
  newPass: string
  confirm: string
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-indigo-50 text-indigo-700',
  SUPERVISOR: 'bg-purple-50 text-purple-700',
  OWNER: 'bg-amber-50 text-amber-700',
}

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export default function Account() {
  const { email, subRole } = useAuthStore()
  const [passwords, setPasswords] = useState<PasswordState>({ current: '', newPass: '', confirm: '' })
  const [saved, setSaved] = useState(false)
  const [passError, setPassError] = useState('')
  const [passMsg, setPassMsg] = useState('')

  const displayRole = subRole ?? 'ADMIN'
  const displayEmail = email ?? ''

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()

    if (passwords.newPass || passwords.confirm) {
      if (passwords.newPass !== passwords.confirm) {
        setPassError('New passwords do not match.')
        return
      }
      if (passwords.newPass.length < 8) {
        setPassError('Password must be at least 8 characters.')
        return
      }
      // Password change endpoint not yet available
      setPassMsg('Password change feature coming soon.')
      setPasswords({ current: '', newPass: '', confirm: '' })
      setPassError('')
      return
    }

    setPassError('')
    setPasswords({ current: '', newPass: '', confirm: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Account"
        subtitle="Manage your profile and security settings"
      />

      {/* Profile hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="h-24 w-full"
          style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #059669 100%)' }}
        />
        <div className="px-6 pb-5 -mt-7 relative">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                {getInitials(displayEmail)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <Camera size={11} className="text-gray-500" />
              </button>
            </div>
            <div className="pb-0.5">
              <p className="font-bold text-gray-900">{displayEmail}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[displayRole] ?? 'bg-gray-100 text-gray-600'}`}>
                  <Shield size={10} />
                  {displayRole}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Mail size={12} className="text-gray-400" />
              {displayEmail}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone size={12} className="text-gray-400" />
              —
            </div>
          </div>
        </div>
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Profile */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-sm mb-5">Edit Profile</h3>
          <form onSubmit={handleProfileSave} className="space-y-5">
            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
              <input
                value={displayEmail}
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Change Password</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                      placeholder="Min. 8 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                      placeholder="Re-enter new password"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        passError ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
                {passError && (
                  <p className="text-xs text-red-500 font-medium">{passError}</p>
                )}
                {passMsg && (
                  <p className="text-xs text-amber-600 font-medium">{passMsg}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
              >
                <Save size={14} />
                Save Changes
              </button>
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  Saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={14} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Danger Zone</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-5">
            Deactivating your account will revoke your access to the staff portal immediately. This action can be reversed by a Super Admin.
          </p>
          <button className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
            Deactivate My Account
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center leading-relaxed">
            You will be logged out and your access will be suspended.
          </p>
        </div>
      </div>
    </div>
  )
}

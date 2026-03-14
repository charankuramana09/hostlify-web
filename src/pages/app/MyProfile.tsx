import { useState } from 'react'
import { Pencil, Save, X, User, Home, Calendar, Phone, Mail, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const MOCK_PROFILE = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@example.com',
  phone: '9876543210',
  roomNumber: 'A-101',
  hostelName: 'Sunrise Hostel',
  joinDate: 'Sep 1, 2025',
  gender: 'Male',
}

export default function MyProfile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ phone: MOCK_PROFILE.phone })

  const initials = MOCK_PROFILE.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  function handleSave() {
    // TODO: call updateProfile() API
    setEditing(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="My Profile"
        subtitle="View and update your personal information"
        action={
          editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
              >
                <Save size={14} /> Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
          )
        }
      />

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Gradient band */}
        <div
          className="h-24 relative"
          style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #3aaee8, transparent)', transform: 'translate(30%, -30%)' }}
          />
        </div>
        {/* Avatar overlapping */}
        <div className="bg-white px-6 pb-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold -mt-10 mb-3 border-4 border-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #3aaee8)' }}
          >
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{MOCK_PROFILE.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Mail size={13} className="text-gray-400" /> {MOCK_PROFILE.email}
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar size={12} className="text-gray-300" /> Member since {MOCK_PROFILE.joinDate}
          </p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <User size={14} className="text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Personal Details</h3>
        </div>
        <div className="divide-y divide-gray-50 px-5">
          {[
            { label: 'Full Name', value: MOCK_PROFILE.name, icon: User },
            { label: 'Email Address', value: MOCK_PROFILE.email, icon: Mail },
            { label: 'Gender', value: MOCK_PROFILE.gender, icon: Users },
          ].map((field) => (
            <div key={field.label} className="flex items-center py-3.5 gap-4">
              <field.icon size={15} className="text-gray-300 shrink-0" />
              <span className="text-sm text-gray-400 w-32 shrink-0">{field.label}</span>
              <span className="text-sm text-gray-800 font-medium">{field.value}</span>
            </div>
          ))}
          {/* Editable phone */}
          <div className="flex items-center py-3.5 gap-4">
            <Phone size={15} className="text-gray-300 shrink-0" />
            <span className="text-sm text-gray-400 w-32 shrink-0">Phone</span>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ phone: e.target.value })}
                className="text-sm border border-indigo-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
              />
            ) : (
              <span className="text-sm text-gray-800 font-medium">{form.phone}</span>
            )}
          </div>
        </div>
      </div>

      {/* Hostel Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Home size={14} className="text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Hostel Details</h3>
        </div>
        <div className="divide-y divide-gray-50 px-5">
          {[
            { label: 'Hostel', value: MOCK_PROFILE.hostelName },
            { label: 'Room Number', value: MOCK_PROFILE.roomNumber },
            { label: 'Join Date', value: MOCK_PROFILE.joinDate },
          ].map((field) => (
            <div key={field.label} className="flex items-center py-3.5 gap-4">
              <div className="w-3.5 shrink-0" />
              <span className="text-sm text-gray-400 w-32 shrink-0">{field.label}</span>
              <span className={`text-sm text-gray-800 font-medium ${field.label === 'Room Number' ? 'font-mono tracking-wider' : ''}`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

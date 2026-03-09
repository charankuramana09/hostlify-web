import { useState } from 'react'
import { Pencil, Save, X } from 'lucide-react'
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
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <Save size={14} /> Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              <Pencil size={14} /> Edit
            </button>
          )
        }
      />

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{MOCK_PROFILE.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{MOCK_PROFILE.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {MOCK_PROFILE.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          Personal Details
        </h3>

        {[
          { label: 'Full Name', value: MOCK_PROFILE.name, editable: false },
          { label: 'Email Address', value: MOCK_PROFILE.email, editable: false },
          { label: 'Gender', value: MOCK_PROFILE.gender, editable: false },
        ].map((field) => (
          <div key={field.label} className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-sm text-gray-500 w-36 shrink-0">{field.label}</span>
            <span className="text-sm text-gray-800 font-medium">{field.value}</span>
          </div>
        ))}

        {/* Editable phone */}
        <div className="flex items-center justify-between py-1 border-b border-gray-50">
          <span className="text-sm text-gray-500 w-36 shrink-0">Phone</span>
          {editing ? (
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ phone: e.target.value })}
              className="text-sm border border-indigo-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
          ) : (
            <span className="text-sm text-gray-800 font-medium">{form.phone}</span>
          )}
        </div>
      </div>

      {/* Hostel Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          Hostel Details
        </h3>
        {[
          { label: 'Hostel', value: MOCK_PROFILE.hostelName },
          { label: 'Room Number', value: MOCK_PROFILE.roomNumber },
          { label: 'Join Date', value: MOCK_PROFILE.joinDate },
        ].map((field) => (
          <div key={field.label} className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-sm text-gray-500 w-36 shrink-0">{field.label}</span>
            <span className="text-sm text-gray-800 font-medium">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

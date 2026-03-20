import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, X, User, Home, Phone, Mail, MapPin, CreditCard } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'
import { getHostellerProfile, updateHostellerProfile, getMyBooking } from '../../api/hosteller'

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors'

const selectCls = inputCls + ' bg-gray-50'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  mobile: string
  altMobile: string
  dateOfBirth: string
  gender: string
  userType: string
  companyCollege: string
  permanentAddress: string
  city: string
  pincode: string
  idProofType: string
  idProofNumber: string
}

function SectionHeader({ icon: Icon, label, color }: { icon: typeof User; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-2.5 px-5 py-4 border-b border-gray-50`}>
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
        <Icon size={14} className="text-white" />
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
    </div>
  )
}

export default function MyProfile() {
  const { hostellerProfileId } = useAuthStore()
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileForm>({
    firstName: '', lastName: '', email: '', mobile: '', altMobile: '',
    dateOfBirth: '', gender: '', userType: '', companyCollege: '',
    permanentAddress: '', city: '', pincode: '', idProofType: '', idProofNumber: '',
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', hostellerProfileId],
    queryFn: () => getHostellerProfile(hostellerProfileId!),
    enabled: !!hostellerProfileId,
  })

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ['my-booking'],
    queryFn: getMyBooking,
  })

  useEffect(() => {
    if (profile) {
      // support both { name, phone } and { firstName, lastName, mobile } shapes
      const nameParts = (profile.name ?? '').split(' ')
      setForm({
        firstName:        profile.firstName ?? nameParts[0] ?? '',
        lastName:         profile.lastName ?? nameParts.slice(1).join(' ') ?? '',
        email:            profile.email ?? '',
        mobile:           profile.mobile ?? profile.phone ?? '',
        altMobile:        profile.altMobile ?? '',
        dateOfBirth:      profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender:           profile.gender ?? '',
        userType:         profile.userType ?? '',
        companyCollege:   profile.companyCollege ?? '',
        permanentAddress: profile.permanentAddress ?? '',
        city:             profile.city ?? '',
        pincode:          profile.pincode ?? '',
        idProofType:      profile.idProofType ?? '',
        idProofNumber:    profile.idProofNumber ?? '',
      })
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: (data: ProfileForm) => updateHostellerProfile(hostellerProfileId!, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', hostellerProfileId] })
      setEditing(false)
      show('success', 'Profile updated', 'Your information has been saved.')
    },
    onError: () => {
      show('error', 'Update failed', 'Could not save your changes. Please try again.')
    },
  })

  function handleSave(e: FormEvent) {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  function field(key: keyof ProfileForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const isLoading = profileLoading || bookingLoading

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  )

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(' ') || '—'
  const hostelName  = booking?.hostel?.name ?? '—'
  const roomNumber  = booking?.room?.roomNumber ?? '—'
  const bedLabel    = booking?.bed?.bedNumber ?? booking?.bed?.bedName ?? '—'
  const floorLabel  = booking?.floor?.floorName ?? booking?.floor?.name ?? '—'
  const checkIn     = booking?.checkInDate ? fmtDate(booking.checkInDate) : '—'
  const monthlyRent = booking?.monthlyRent != null ? `₹${Number(booking.monthlyRent).toLocaleString()}` : '—'
  const bkStatus    = booking?.status ?? '—'

  const initials = displayName !== '—'
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="space-y-6 max-w-3xl">
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
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Edit Profile
            </button>
          )
        }
      />

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div
          className="h-24 relative"
          style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #3aaee8, transparent)', transform: 'translate(30%, -30%)' }}
          />
        </div>
        <div className="bg-white px-6 pb-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold -mt-10 mb-3 border-4 border-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #1d6ea8, #3aaee8)' }}
          >
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Mail size={13} className="text-gray-400" /> {form.email || '—'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader icon={User} label="Personal Details" color="bg-indigo-500" />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
              {editing ? (
                <input className={inputCls} value={form.firstName} onChange={field('firstName')} placeholder="First name" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.firstName || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
              {editing ? (
                <input className={inputCls} value={form.lastName} onChange={field('lastName')} placeholder="Last name" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.lastName || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date of Birth</label>
              {editing ? (
                <input type="date" className={inputCls} value={form.dateOfBirth} onChange={field('dateOfBirth')} />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.dateOfBirth ? fmtDate(form.dateOfBirth) : '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
              {editing ? (
                <select className={selectCls} value={form.gender} onChange={field('gender')}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.gender || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">User Type</label>
              {editing ? (
                <select className={selectCls} value={form.userType} onChange={field('userType')}>
                  <option value="">Select type</option>
                  <option value="GENERAL">General</option>
                  <option value="STUDENT">Student</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.userType || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Company / College</label>
              {editing ? (
                <input className={inputCls} value={form.companyCollege} onChange={field('companyCollege')} placeholder="Your company or college" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.companyCollege || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader icon={Phone} label="Contact Information" color="bg-emerald-500" />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              {editing ? (
                <input type="email" className={inputCls} value={form.email} onChange={field('email')} placeholder="Email" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.email || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile</label>
              {editing ? (
                <input type="tel" className={inputCls} value={form.mobile} onChange={field('mobile')} placeholder="Mobile number" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.mobile || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Alt. Mobile</label>
              {editing ? (
                <input type="tel" className={inputCls} value={form.altMobile} onChange={field('altMobile')} placeholder="Alternate mobile" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.altMobile || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader icon={MapPin} label="Address Details" color="bg-amber-500" />
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Permanent Address</label>
              {editing ? (
                <textarea
                  rows={3}
                  className={inputCls + ' resize-none'}
                  value={form.permanentAddress}
                  onChange={field('permanentAddress')}
                  placeholder="Full address"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.permanentAddress || '—'}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
                {editing ? (
                  <input className={inputCls} value={form.city} onChange={field('city')} placeholder="City" />
                ) : (
                  <p className="text-sm text-gray-800 font-medium py-2.5">{form.city || '—'}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pincode</label>
                {editing ? (
                  <input className={inputCls} value={form.pincode} onChange={field('pincode')} placeholder="Pincode" />
                ) : (
                  <p className="text-sm text-gray-800 font-medium py-2.5">{form.pincode || '—'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ID Verification */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader icon={CreditCard} label="ID Verification" color="bg-purple-500" />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ID Proof Type</label>
              {editing ? (
                <select className={selectCls} value={form.idProofType} onChange={field('idProofType')}>
                  <option value="">Select ID type</option>
                  <option value="AADHAR">Aadhar</option>
                  <option value="PAN">PAN</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="VOTER_ID">Voter ID</option>
                </select>
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.idProofType || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ID Proof Number</label>
              {editing ? (
                <input className={inputCls} value={form.idProofNumber} onChange={field('idProofNumber')} placeholder="ID number" />
              ) : (
                <p className="text-sm text-gray-800 font-medium py-2.5">{form.idProofNumber || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1d6ea8, #1a8fd1)' }}
            >
              <Save size={14} />
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>

      {/* Stay Info (read-only) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader icon={Home} label="Stay Info" color="bg-sky-500" />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Hostel', value: hostelName },
            { label: 'Room Number', value: roomNumber },
            { label: 'Bed', value: bedLabel },
            { label: 'Floor', value: floorLabel },
            { label: 'Check-in Date', value: checkIn },
            { label: 'Monthly Rent', value: monthlyRent },
            { label: 'Booking Status', value: bkStatus },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

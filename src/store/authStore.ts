import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  role: string | null
  subRole: string | null
  email: string | null
  isAuthenticated: boolean
  // Hosteller context
  hostelId: number | null
  hostellerProfileId: number | null
  bookingId: number | null
  // Staff context
  hostelIds: number[]
  ownerId: number | null
  activeHostelId: number | null  // current hostel selected by staff

  setAuth: (data: {
    accessToken: string
    refreshToken: string
    role: string
    subRole?: string
    email?: string
    hostelId?: number
    hostellerProfileId?: number
    bookingId?: number
    hostelIds?: number[]
    ownerId?: number
  }) => void
  setActiveHostelId: (id: number) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      subRole: null,
      email: null,
      isAuthenticated: false,
      hostelId: null,
      hostellerProfileId: null,
      bookingId: null,
      hostelIds: [],
      ownerId: null,
      activeHostelId: null,

      setAuth: ({ accessToken, refreshToken, role, subRole, email, hostelId, hostellerProfileId, bookingId, hostelIds, ownerId }) => {
        localStorage.setItem('hostlify-access-token', accessToken)
        localStorage.setItem('hostlify-refresh-token', refreshToken)
        const ids = hostelIds ?? []
        set({
          accessToken,
          role,
          subRole: subRole ?? null,
          email: email ?? null,
          isAuthenticated: true,
          hostelId: hostelId ?? null,
          hostellerProfileId: hostellerProfileId ?? null,
          bookingId: bookingId ?? null,
          hostelIds: ids,
          ownerId: ownerId ?? null,
          activeHostelId: ids.length > 0 ? ids[0] : null,
        })
      },

      setActiveHostelId: (id) => set({ activeHostelId: id }),

      clearAuth: () => {
        localStorage.removeItem('hostlify-access-token')
        localStorage.removeItem('hostlify-refresh-token')
        set({
          accessToken: null, role: null, subRole: null, email: null, isAuthenticated: false,
          hostelId: null, hostellerProfileId: null, bookingId: null,
          hostelIds: [], ownerId: null, activeHostelId: null,
        })
      },
    }),
    { name: 'hostlify-auth' }
  )
)

import { apiClient } from './client'

// ─── Booking / Profile ────────────────────────────────────────────────────────
export const getMyBooking = () =>
  apiClient.get('/booking/me').then((r) => r.data.data)

export const getHostellerProfile = (id: number) =>
  apiClient.get(`/hostellers/${id}`).then((r) => r.data.data)

export const updateHostellerProfile = (id: number, data: Record<string, unknown>) =>
  apiClient.put(`/hostellers/${id}`, data).then((r) => r.data.data)

// ─── Payment / Dues ───────────────────────────────────────────────────────────
export const getCurrentDue = () =>
  apiClient.get('/payment/dues/current').then((r) => r.data.data)

export const getDuesHistory = () =>
  apiClient.get('/payment/dues/history').then((r) => r.data.data)

export const initiateRazorpay = (dueId: number) =>
  apiClient.post('/payment/razorpay/initiate', { dueId }).then((r) => r.data.data)

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getMyComplaints = (hostellerProfileId: number) =>
  apiClient.get(`/complaints/hosteller/${hostellerProfileId}`).then((r) => r.data.data)

export const createComplaint = (data: Record<string, unknown>) =>
  apiClient.post('/complaints', data).then((r) => r.data.data)

// ─── Announcements ────────────────────────────────────────────────────────────
export const getAnnouncements = (hostelId: number) =>
  apiClient.get(`/announcements/hostel/${hostelId}`).then((r) => r.data.data)

// ─── Menu ─────────────────────────────────────────────────────────────────────
export const getCurrentMenu = (hostelId: number) =>
  apiClient.get(`/menu/current?hostelId=${hostelId}`).then((r) => r.data.data)

export const getMenuItems = (menuId: number) =>
  apiClient.get(`/menu/${menuId}/items`).then((r) => r.data.data)

// ─── Leave ────────────────────────────────────────────────────────────────────
export const getMyLeaves = (hostellerProfileId: number) =>
  apiClient.get(`/leaves/hosteller/${hostellerProfileId}`).then((r) => r.data.data)

export const applyLeave = (data: Record<string, unknown>) =>
  apiClient.post('/leaves', data).then((r) => r.data.data)

// ─── Referral ─────────────────────────────────────────────────────────────────
export const getMyReferralCode = () =>
  apiClient.get('/referral/my-code').then((r) => r.data.data)

export const getMyReferrals = () =>
  apiClient.get('/referral/my-referrals').then((r) => r.data.data)

// ─── Parking ──────────────────────────────────────────────────────────────────
export const getMyParking = () =>
  apiClient.get('/parking/me').then((r) => r.data.data)

export const registerParking = (data: Record<string, unknown>) =>
  apiClient.post('/parking', data).then((r) => r.data.data)

export const deregisterParking = (recordId: number) =>
  apiClient.delete(`/parking/${recordId}`).then((r) => r.data.data)

// ─── Cleaning ─────────────────────────────────────────────────────────────────
export const getMyCleaning = () =>
  apiClient.get('/cleaning/me').then((r) => r.data.data)

export const requestCleaning = (data: Record<string, unknown>) =>
  apiClient.post('/cleaning', data).then((r) => r.data.data)

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const submitReview = (data: { rating: number; reviewText: string }) =>
  apiClient.post('/reviews', data).then((r) => r.data.data)

// ─── Hostel Discovery ─────────────────────────────────────────────────────────
export const getNearbyHostels = (lat: number, lng: number, radius = 10) =>
  apiClient.get(`/hostel/nearby?lat=${lat}&lng=${lng}&radius=${radius}`).then((r) => r.data.data)

export const searchHostels = (city?: string, roomType?: string, maxRent?: number) => {
  const params = new URLSearchParams()
  if (city) params.append('city', city)
  if (roomType) params.append('roomType', roomType)
  if (maxRent) params.append('maxRent', String(maxRent))
  return apiClient.get(`/hostel/search?${params}`).then((r) => r.data.data)
}

export const getHostelDetail = (hostelId: number) =>
  apiClient.get(`/hostels/${hostelId}/detail`).then((r) => r.data.data)

export const getFloorsWithAvailability = (hostelId: number) =>
  apiClient.get(`/hostels/${hostelId}/floors-with-availability`).then((r) => r.data.data)

export const getRoomsWithAvailability = (floorId: number) =>
  apiClient.get(`/floors/${floorId}/rooms-with-availability`).then((r) => r.data.data)

export const getBedsByRoom = (roomId: number) =>
  apiClient.get(`/rooms/${roomId}/beds`).then((r) => r.data.data)

export const submitBookingRequest = (data: Record<string, unknown>) =>
  apiClient.post('/booking/request', data).then((r) => r.data.data)

export const getMyBookingRequest = () =>
  apiClient.get('/booking/request/my').then((r) => r.data.data)

export const cancelBookingRequest = (id: number) =>
  apiClient.delete(`/booking/request/${id}`).then((r) => r.data.data)

export const getProfileCompletion = () =>
  apiClient.get('/hostellers/profile/completion').then((r) => r.data.data)

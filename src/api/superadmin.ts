import { apiClient } from './client'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getSADashboard = () =>
  apiClient.get('/admin/dashboard').then((r) => r.data.data)

// ─── Owners ───────────────────────────────────────────────────────────────────
export const getOwners = (page = 0, size = 20) =>
  apiClient.get(`/admin/owners?page=${page}&size=${size}`).then((r) => r.data.data)

export const getOwnerById = (id: number) =>
  apiClient.get(`/admin/owners/${id}`).then((r) => r.data.data)

export const createOwner = (data: Record<string, unknown>) =>
  apiClient.post('/admin/owners', data).then((r) => r.data.data)

export const suspendOwner = (id: number) =>
  apiClient.put(`/admin/owners/${id}/suspend`).then((r) => r.data.data)

export const resetOwnerPassword = (id: number, newPassword: string) =>
  apiClient.put(`/admin/owners/${id}/reset-password`, { newPassword }).then((r) => r.data.data)

// ─── Hostels for owner ────────────────────────────────────────────────────────
export const getOwnerHostels = (ownerId: number) =>
  apiClient.get(`/owners/${ownerId}/hostels`).then((r) => r.data.data)

// ─── Subscription ─────────────────────────────────────────────────────────────
export const getSubscription = (ownerId: number) =>
  apiClient.get(`/admin/subscription/${ownerId}`).then((r) => r.data.data)

export const upsertSubscription = (data: Record<string, unknown>) =>
  apiClient.post('/admin/subscription', data).then((r) => r.data.data)

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const getFeatureFlags = (ownerId: number) =>
  apiClient.get(`/admin/flags/${ownerId}`).then((r) => r.data.data)

export const setFeatureFlag = (data: Record<string, unknown>) =>
  apiClient.post('/admin/flags', data).then((r) => r.data.data)

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getRevenueReport = (month?: number, year?: number) => {
  const params = new URLSearchParams()
  if (month) params.append('month', String(month))
  if (year) params.append('year', String(year))
  const qs = params.toString()
  return apiClient.get(`/admin/reports/revenue${qs ? '?' + qs : ''}`).then((r) => r.data.data)
}

export const getOccupancyReport = () =>
  apiClient.get('/admin/reports/occupancy').then((r) => r.data.data)

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const getAuditLogs = (hostelId: number, page = 0, size = 20) =>
  apiClient.get(`/admin/audit/hostel/${hostelId}?page=${page}&size=${size}`).then((r) => r.data.data)

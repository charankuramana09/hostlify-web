import { apiClient } from './client'

export interface Due {
  id: number
  description: string
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
}

export interface PaymentRecord {
  id: number
  amount: number
  paidDate: string
  method: string
  referenceId: string
}

export interface HostellerProfile {
  id: number
  name: string
  email: string
  phone: string
  roomNumber: string
  hostelName: string
  joinDate: string
  avatarUrl?: string
}

export interface Complaint {
  id: number
  title: string
  category: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  category: string
  publishedAt: string
}

export interface MenuItem {
  day: string
  breakfast: string
  lunch: string
  dinner: string
}

export interface LeaveRequest {
  id: number
  fromDate: string
  toDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  appliedAt: string
}

export interface ServiceRequest {
  id: number
  category: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  createdAt: string
}

export const getDues = () =>
  apiClient.get<Due[]>('/hosteller/dues').then((r) => r.data)

export const getPaymentHistory = () =>
  apiClient.get<PaymentRecord[]>('/hosteller/payments').then((r) => r.data)

export const getProfile = () =>
  apiClient.get<HostellerProfile>('/hosteller/profile').then((r) => r.data)

export const updateProfile = (data: Partial<HostellerProfile>) =>
  apiClient.patch<HostellerProfile>('/hosteller/profile', data).then((r) => r.data)

export const getComplaints = () =>
  apiClient.get<Complaint[]>('/hosteller/complaints').then((r) => r.data)

export const createComplaint = (data: Pick<Complaint, 'title' | 'category' | 'description'>) =>
  apiClient.post<Complaint>('/hosteller/complaints', data).then((r) => r.data)

export const getAnnouncements = () =>
  apiClient.get<Announcement[]>('/hosteller/announcements').then((r) => r.data)

export const getWeeklyMenu = () =>
  apiClient.get<MenuItem[]>('/hosteller/menu').then((r) => r.data)

export const getLeaveRequests = () =>
  apiClient.get<LeaveRequest[]>('/hosteller/leaves').then((r) => r.data)

export const applyLeave = (data: Pick<LeaveRequest, 'fromDate' | 'toDate' | 'reason'>) =>
  apiClient.post<LeaveRequest>('/hosteller/leaves', data).then((r) => r.data)

export const getServiceRequests = () =>
  apiClient.get<ServiceRequest[]>('/hosteller/services').then((r) => r.data)

export const createServiceRequest = (data: Pick<ServiceRequest, 'category' | 'description'>) =>
  apiClient.post<ServiceRequest>('/hosteller/services', data).then((r) => r.data)

export const getReferralCode = () =>
  apiClient.get<{ code: string; referredCount: number; reward: string }>('/hosteller/referral').then((r) => r.data)

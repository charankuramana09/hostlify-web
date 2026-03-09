import { apiClient } from './client'

export interface AllocationRequest {
  id: number
  applicantName: string
  email: string
  phone: string
  appliedDate: string
  roomPreference: string
  gender: 'MALE' | 'FEMALE'
  status: 'PENDING' | 'ALLOCATED' | 'REJECTED'
}

export interface Member {
  id: number
  name: string
  email: string
  phone: string
  roomNumber: string
  hostelId: number
  status: 'ACTIVE' | 'INACTIVE'
  joinDate: string
}

export interface DueRecord {
  id: number
  memberName: string
  roomNumber: string
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
}

export interface Expense {
  id: number
  category: string
  description: string
  amount: number
  date: string
  addedBy: string
}

export interface StaffComplaint {
  id: number
  hostellerName: string
  roomNumber: string
  title: string
  category: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
}

export interface StaffAnnouncement {
  id: number
  title: string
  content: string
  category: string
  publishedAt: string
  publishedBy: string
}

export interface StaffLeaveRequest {
  id: number
  hostellerName: string
  roomNumber: string
  fromDate: string
  toDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  appliedAt: string
}

export interface StaffMenuItem {
  day: string
  breakfast: string
  lunch: string
  dinner: string
}

export const getAllocationRequests = () =>
  apiClient.get<AllocationRequest[]>('/staff/allocations').then((r) => r.data)

export const allocateRoom = (id: number, roomNumber: string) =>
  apiClient.post(`/staff/allocations/${id}/allocate`, { roomNumber }).then((r) => r.data)

export const rejectAllocation = (id: number) =>
  apiClient.post(`/staff/allocations/${id}/reject`).then((r) => r.data)

export const getMembers = () =>
  apiClient.get<Member[]>('/staff/members').then((r) => r.data)

export const getDuesList = () =>
  apiClient.get<DueRecord[]>('/staff/dues').then((r) => r.data)

export const recordCashPayment = (dueId: number) =>
  apiClient.post(`/staff/dues/${dueId}/record-cash`).then((r) => r.data)

export const getExpenses = () =>
  apiClient.get<Expense[]>('/staff/expenses').then((r) => r.data)

export const addExpense = (data: Pick<Expense, 'category' | 'description' | 'amount' | 'date'>) =>
  apiClient.post<Expense>('/staff/expenses', data).then((r) => r.data)

export const getStaffComplaints = () =>
  apiClient.get<StaffComplaint[]>('/staff/complaints').then((r) => r.data)

export const updateComplaintStatus = (id: number, status: string) =>
  apiClient.patch(`/staff/complaints/${id}/status`, { status }).then((r) => r.data)

export const getStaffAnnouncements = () =>
  apiClient.get<StaffAnnouncement[]>('/staff/announcements').then((r) => r.data)

export const createAnnouncement = (data: Pick<StaffAnnouncement, 'title' | 'content' | 'category'>) =>
  apiClient.post<StaffAnnouncement>('/staff/announcements', data).then((r) => r.data)

export const getStaffLeaveRequests = () =>
  apiClient.get<StaffLeaveRequest[]>('/staff/leaves').then((r) => r.data)

export const updateLeaveStatus = (id: number, status: 'APPROVED' | 'REJECTED') =>
  apiClient.patch(`/staff/leaves/${id}/status`, { status }).then((r) => r.data)

export const getStaffMenu = () =>
  apiClient.get<StaffMenuItem[]>('/staff/menu').then((r) => r.data)

export const updateMenu = (data: StaffMenuItem[]) =>
  apiClient.put('/staff/menu', data).then((r) => r.data)

export const getStaffDashboard = () =>
  apiClient
    .get<{
      occupancy: { total: number; occupied: number; available: number }
      pendingAllocations: number
      openComplaints: number
      monthlyRevenue: number
    }>('/staff/dashboard')
    .then((r) => r.data)

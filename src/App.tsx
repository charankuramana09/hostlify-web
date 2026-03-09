import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './guards/AuthGuard'
import RoleGuard from './guards/RoleGuard'
import Unauthorized from './pages/Unauthorized'

// Auth pages (eager — tiny, always needed)
import HostellerLogin from './pages/auth/HostellerLogin'
import HostellerSignup from './pages/auth/HostellerSignup'
import StaffLogin from './pages/auth/StaffLogin'
import SuperAdminLogin from './pages/auth/SuperAdminLogin'

// Layouts (lazy)
const AppLayout = lazy(() => import('./layouts/AppLayout'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const SuperAdminLayout = lazy(() => import('./layouts/SuperAdminLayout'))

// Hosteller pages
const AppDashboard = lazy(() => import('./pages/app/Dashboard'))
const MyDues = lazy(() => import('./pages/app/MyDues'))
const MyProfile = lazy(() => import('./pages/app/MyProfile'))
const AppComplaints = lazy(() => import('./pages/app/Complaints'))
const AppMenu = lazy(() => import('./pages/app/Menu'))
const AppLeave = lazy(() => import('./pages/app/Leave'))
const AppService = lazy(() => import('./pages/app/Service'))
const AppReferral = lazy(() => import('./pages/app/Referral'))
const AppAnnouncements = lazy(() => import('./pages/app/Announcements'))

// Staff pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const PendingAllocations = lazy(() => import('./pages/admin/PendingAllocations'))
const Members = lazy(() => import('./pages/admin/Members'))
const Payments = lazy(() => import('./pages/admin/Payments'))
const AdminComplaints = lazy(() => import('./pages/admin/Complaints'))
const Expenses = lazy(() => import('./pages/admin/Expenses'))
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements'))
const AdminMenu = lazy(() => import('./pages/admin/Menu'))
const AdminLeave = lazy(() => import('./pages/admin/Leave'))

// Super Admin pages
const SuperAdminDashboard = lazy(() => import('./pages/super-admin/Dashboard'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/auth/login" element={<HostellerLogin />} />
          <Route path="/auth/signup" element={<HostellerSignup />} />
          <Route path="/auth/staff/login" element={<StaffLogin />} />
          <Route path="/auth/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ── Hosteller Portal (/app/*) ── */}
          <Route element={<AuthGuard />}>
            <Route element={<RoleGuard allowedRoles={['HOSTELLER']} />}>
              <Route element={<AppLayout />}>
                <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/app/dashboard" element={<AppDashboard />} />
                <Route path="/app/dues" element={<MyDues />} />
                <Route path="/app/profile" element={<MyProfile />} />
                <Route path="/app/complaints" element={<AppComplaints />} />
                <Route path="/app/menu" element={<AppMenu />} />
                <Route path="/app/leave" element={<AppLeave />} />
                <Route path="/app/service" element={<AppService />} />
                <Route path="/app/referral" element={<AppReferral />} />
                <Route path="/app/announcements" element={<AppAnnouncements />} />
              </Route>
            </Route>
          </Route>

          {/* ── Staff Portal (/admin/*) ── */}
          <Route element={<AuthGuard />}>
            <Route element={<RoleGuard allowedRoles={['HOSTEL_STAFF']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/allocations" element={<PendingAllocations />} />
                <Route path="/admin/members" element={<Members />} />
                <Route path="/admin/payments" element={<Payments />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/expenses" element={<Expenses />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/menu" element={<AdminMenu />} />
                <Route path="/admin/leave" element={<AdminLeave />} />
              </Route>
            </Route>
          </Route>

          {/* ── Super Admin Portal (/super-admin/*) ── */}
          <Route element={<AuthGuard />}>
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN']} />}>
              <Route element={<SuperAdminLayout />}>
                <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
                <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

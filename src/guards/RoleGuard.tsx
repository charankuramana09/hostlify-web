import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface RoleGuardProps {
  allowedRoles: string[]
}

const ROLE_HOME: Record<string, string> = {
  HOSTELLER: '/app/dashboard',
  HOSTEL_STAFF: '/admin/dashboard',
  SUPER_ADMIN: '/super-admin/dashboard',
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const role = useAuthStore((s) => s.role)

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to the user's own portal instead of a generic /unauthorized page
    const home = role ? ROLE_HOME[role] : null
    return <Navigate to={home ?? '/unauthorized'} replace />
  }

  return <Outlet />
}

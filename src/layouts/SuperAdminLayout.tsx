import { LayoutDashboard, Building2, Users, BarChart3, Settings } from 'lucide-react'
import PortalLayout, { type NavItem } from './PortalLayout'

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Hostels', to: '/super-admin/hostels', icon: Building2 },
  { label: 'Staff', to: '/super-admin/staff', icon: Users },
  { label: 'Reports', to: '/super-admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/super-admin/settings', icon: Settings },
]

export default function SuperAdminLayout() {
  return (
    <PortalLayout
      navItems={navItems}
      portalName="Super Admin"
    />
  )
}

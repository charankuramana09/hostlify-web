import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CreditCard,
  MessageSquare,
  Receipt,
  Bell,
  UtensilsCrossed,
  CalendarX,
  Map,
  Car,
  SprayCan,
  Settings,
  UserCog,
  BarChart3,
  Star,
  UserCircle,
  Wrench,
  Building2,
} from 'lucide-react'
import PortalLayout, { type NavItem } from './PortalLayout'
import { useAuthStore } from '../store/authStore'

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',           to: '/admin/dashboard',     icon: LayoutDashboard },
  { label: 'Hostel Setup',        to: '/admin/hostel-setup',  icon: Building2 },
  { label: 'Allocations',         to: '/admin/allocations',   icon: ClipboardList },
  { label: 'Members',             to: '/admin/members',       icon: Users },
  { label: 'Payments',            to: '/admin/payments',      icon: CreditCard },
  { label: 'Complaints',          to: '/admin/complaints',    icon: MessageSquare },
  { label: 'Expenses',            to: '/admin/expenses',      icon: Receipt },
  { label: 'Maintenance',         to: '/admin/maintenance',   icon: Wrench },
  { label: 'Revenue Report',      to: '/admin/revenue',       icon: BarChart3 },
  { label: 'Occupancy Map',       to: '/admin/occupancy',     icon: Map },
  { label: 'Announcements',       to: '/admin/announcements', icon: Bell },
  { label: 'Menu',                to: '/admin/menu',          icon: UtensilsCrossed },
  { label: 'Leave',               to: '/admin/leave',         icon: CalendarX },
  { label: 'Parking',             to: '/admin/parking',       icon: Car },
  { label: 'Cleaning',            to: '/admin/cleaning',      icon: SprayCan },
  { label: 'Staff & Employees',   to: '/admin/staff',         icon: UserCog },
  { label: 'Reviews',             to: '/admin/reviews',       icon: Star },
  { label: 'Settings',            to: '/admin/settings',      icon: Settings },
  { label: 'My Account',          to: '/admin/account',       icon: UserCircle },
]

// Finance-related nav items hidden for SUPERVISOR sub_role
const FINANCE_ROUTES = new Set(['/admin/payments', '/admin/expenses', '/admin/employees', '/admin/revenue', '/admin/staff'])

export default function AdminLayout() {
  const subRole = useAuthStore((s) => s.subRole)
  const navItems = subRole === 'SUPERVISOR'
    ? ALL_NAV_ITEMS.filter((item) => !FINANCE_ROUTES.has(item.to))
    : ALL_NAV_ITEMS

  return (
    <PortalLayout
      navItems={navItems}
      portalName="Staff"
    />
  )
}

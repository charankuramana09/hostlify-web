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
  Briefcase,
} from 'lucide-react'
import PortalLayout, { type NavItem } from './PortalLayout'

const navItems: NavItem[] = [
  { label: 'Dashboard',           to: '/admin/dashboard',     icon: LayoutDashboard },
  { label: 'Pending Allocations', to: '/admin/allocations',   icon: ClipboardList },
  { label: 'Members',             to: '/admin/members',       icon: Users },
  { label: 'Payments',            to: '/admin/payments',      icon: CreditCard },
  { label: 'Complaints',          to: '/admin/complaints',    icon: MessageSquare },
  { label: 'Expenses',            to: '/admin/expenses',      icon: Receipt },
  { label: 'Maintenance',         to: '/admin/maintenance',   icon: Wrench },
  { label: 'Employees',           to: '/admin/employees',     icon: Briefcase },
  { label: 'Revenue Report',      to: '/admin/revenue',       icon: BarChart3 },
  { label: 'Occupancy Map',       to: '/admin/occupancy',     icon: Map },
  { label: 'Announcements',       to: '/admin/announcements', icon: Bell },
  { label: 'Menu',                to: '/admin/menu',          icon: UtensilsCrossed },
  { label: 'Leave',               to: '/admin/leave',         icon: CalendarX },
  { label: 'Parking',             to: '/admin/parking',       icon: Car },
  { label: 'Cleaning',            to: '/admin/cleaning',      icon: SprayCan },
  { label: 'Staff',               to: '/admin/staff',         icon: UserCog },
  { label: 'Reviews',             to: '/admin/reviews',       icon: Star },
  { label: 'Settings',            to: '/admin/settings',      icon: Settings },
  { label: 'My Account',          to: '/admin/account',       icon: UserCircle },
]

export default function AdminLayout() {
  return (
    <PortalLayout
      navItems={navItems}
      portalName="Staff"
    />
  )
}

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
} from 'lucide-react'
import PortalLayout, { type NavItem } from './PortalLayout'

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pending Allocations', to: '/admin/allocations', icon: ClipboardList },
  { label: 'Members', to: '/admin/members', icon: Users },
  { label: 'Payments', to: '/admin/payments', icon: CreditCard },
  { label: 'Complaints', to: '/admin/complaints', icon: MessageSquare },
  { label: 'Expenses', to: '/admin/expenses', icon: Receipt },
  { label: 'Announcements', to: '/admin/announcements', icon: Bell },
  { label: 'Menu', to: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Leave', to: '/admin/leave', icon: CalendarX },
]

export default function AdminLayout() {
  return (
    <PortalLayout
      navItems={navItems}
      portalName="Staff"
    />
  )
}

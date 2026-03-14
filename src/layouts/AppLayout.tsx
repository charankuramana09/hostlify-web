import {
  LayoutDashboard,
  CreditCard,
  User,
  MessageSquare,
  UtensilsCrossed,
  CalendarX,
  Wrench,
  UserPlus,
  Bell,
  Car,
  SprayCan,
} from 'lucide-react'
import PortalLayout, { type NavItem } from './PortalLayout'

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'My Dues', to: '/app/dues', icon: CreditCard },
  { label: 'My Profile', to: '/app/profile', icon: User },
  { label: 'Complaints', to: '/app/complaints', icon: MessageSquare },
  { label: 'Menu', to: '/app/menu', icon: UtensilsCrossed },
  { label: 'Leave', to: '/app/leave', icon: CalendarX },
  { label: 'Service', to: '/app/service', icon: Wrench },
  { label: 'Referral', to: '/app/referral', icon: UserPlus },
  { label: 'Announcements', to: '/app/announcements', icon: Bell },
  { label: 'Parking', to: '/app/parking', icon: Car },
  { label: 'Cleaning', to: '/app/cleaning', icon: SprayCan },
]

export default function AppLayout() {
  return (
    <PortalLayout
      navItems={navItems}
      portalName="Hosteller"
    />
  )
}

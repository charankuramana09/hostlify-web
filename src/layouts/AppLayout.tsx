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
  Compass,
  CalendarClock,
  BedDouble,
  HeartHandshake,
} from 'lucide-react'
import PortalLayout, { type NavEntry, type NavItem } from './PortalLayout'

// Grouped to keep the sidebar uncluttered. All routes are unchanged.
const navItems: NavEntry[] = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  {
    label: 'Find & Book',
    icon: Compass,
    children: [
      { label: 'Discover Hostels', to: '/app/discover', icon: Compass },
      { label: 'Booking Status', to: '/app/booking-status', icon: CalendarClock },
    ],
  },
  {
    label: 'My Stay',
    icon: BedDouble,
    children: [
      { label: 'My Dues', to: '/app/dues', icon: CreditCard },
      { label: 'Complaints', to: '/app/complaints', icon: MessageSquare },
      { label: 'Leave', to: '/app/leave', icon: CalendarX },
      { label: 'My Profile', to: '/app/profile', icon: User },
    ],
  },
  {
    label: 'Services',
    icon: HeartHandshake,
    children: [
      { label: 'Menu', to: '/app/menu', icon: UtensilsCrossed },
      { label: 'Cleaning', to: '/app/cleaning', icon: SprayCan },
      { label: 'Vehicle Parking', to: '/app/parking', icon: Car },
      { label: 'Other Services', to: '/app/service', icon: Wrench },
    ],
  },
  { label: 'Announcements', to: '/app/announcements', icon: Bell },
  { label: 'Referral', to: '/app/referral', icon: UserPlus },
]

// Most-used destinations for the mobile bottom tab bar.
const bottomNav: NavItem[] = [
  { label: 'Home', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Discover', to: '/app/discover', icon: Compass },
  { label: 'Dues', to: '/app/dues', icon: CreditCard },
  { label: 'Profile', to: '/app/profile', icon: User },
]

export default function AppLayout() {
  return <PortalLayout navItems={navItems} portalName="Hosteller" bottomNav={bottomNav} profilePath="/app/profile" />
}

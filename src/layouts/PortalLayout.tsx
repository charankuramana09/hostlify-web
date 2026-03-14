import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Bell, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { STRINGS } from '../constants/strings'
import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ size?: number; className?: string }>
}

interface PortalLayoutProps {
  navItems: NavItem[]
  portalName: string
  accentBg?: string
  accentText?: string
  activeBg?: string
}

export default function PortalLayout({ navItems, portalName }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { role, clearAuth } = useAuthStore()

  const displayName = role?.replace(/_/g, ' ') ?? 'User'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const currentPage = navItems.find(item => location.pathname.startsWith(item.to))?.label ?? STRINGS.portal.dashboard

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  function logout() {
    clearAuth()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#eef1f5' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 228, background: '#0f2d4a' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #1d6ea8, #3aaee8)' }}
              >
                H
              </div>
              <span className="text-white font-bold text-lg tracking-tight">{STRINGS.common.appName}</span>
            </div>
            <div className="text-xs mt-0.5 font-medium pl-9" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {portalName} Portal
            </div>
          </div>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(29,110,168,0.9)' } : {}}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-sky-300" />
                  )}
                  <item.icon size={17} className="shrink-0 ml-1" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-60 shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => { navigate('/app/profile'); setSidebarOpen(false) }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #1d6ea8, #3aaee8)' }}
            >
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Hostlify User</p>
            </div>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mt-1 transition-colors text-white/35 hover:text-white/75 hover:bg-white/5"
          >
            <LogOut size={16} className="ml-1 shrink-0" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-5 gap-4 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 hidden sm:block">{greeting} 👋</span>
              <span className="text-gray-200 hidden sm:block">·</span>
              <span className="font-semibold text-gray-800 truncate">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div
              className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #1d6ea8, #3aaee8)' }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

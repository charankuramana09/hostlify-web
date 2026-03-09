import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Bell, Search } from 'lucide-react'
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
  // Accent colors are now mostly handled by CSS variables, 
  // but we keep these for backward compatibility or small overrides
  accentBg?: string
  accentText?: string
  activeBg?: string
}

export default function PortalLayout({
  navItems,
  portalName,
}: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { role, clearAuth } = useAuthStore()

  const displayName = role?.replace('_', ' ') ?? 'User'
  const initials = displayName.charAt(0).toUpperCase()

  // Find current page title from navItems
  const currentPage = navItems.find(item => location.pathname.startsWith(item.to))?.label || STRINGS.portal.dashboard

  function logout() {
    clearAuth()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-[#e8eef4] overflow-hidden font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Using wireframe styles */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[228px] bg-[#0f2d4a] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Logo */}
        <div className="sidebar-logo">
          <div className="flex items-center justify-between">
            <div>
              <div className="sidebar-logo-text text-white">{STRINGS.common.appName}</div>
              <div className="sidebar-logo-sub opacity-40">{portalName} Portal</div>
            </div>
            <button
              className="lg:hidden text-white/60 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="sidebar-section flex-1 overflow-y-auto no-scrollbar">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar User */}
        <div className="sidebar-bottom">
          <div className="sidebar-user" onClick={() => navigate('/app/profile')}>
            <div className="avatar avatar-sm bg-brand-500">
              {initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName}</div>
              <div className="sidebar-user-role">Hostlify User</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-item w-full mt-2 text-white/40 hover:text-white hover:bg-white/5"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-1">
              {portalName} Portal
            </div>
            <h1 className="topbar-title leading-tight">{currentPage}</h1>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn hidden sm:flex">
              <Search size={18} />
            </button>
            <button className="topbar-btn">
              <Bell size={18} />
              <span className="topbar-dot"></span>
            </button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1 hidden sm:block"></div>
            <div className="avatar avatar-sm hidden sm:flex">
              {initials}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

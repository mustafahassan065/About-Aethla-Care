'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Search, LogOut, ChevronDown, Menu, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'

const sidebarNav = [
  {
    group: 'Overview',
    items: [
      { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    ],
  },
  {
    group: 'Care Management',
    items: [
      { href: '/admin/consultations', icon: '🤷‍♂️', label: 'Consultations' },
      { href: '/admin/clients', icon: '👥', label: 'Clients' },
      { href: '/admin/staff', icon: '🏃', label: 'Staff' },
        { href: '/admin/matching',       label: 'Caregiver Match'  },
      { href: '/admin/scheduling', icon: '📅', label: 'Scheduling' },
      { href: '/admin/care-notes', icon: '📝', label: 'Care Notes' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/admin/billing', icon: '💰', label: 'Billing' },
     { href: '/admin/compliance',     label: 'Compliance'       },
      { href: '/admin/reports', icon: '📈', label: 'Reports' },
    ],
  },
  {
    group: 'Content',
    items: [
      { href: '/admin/cms', icon: '📄', label: 'CMS' },
    ],
  },
]

/* ---------------- SIDEBAR ---------------- */

function Sidebar({ open, onClose, onToggle }: { open: boolean; onClose: () => void; onToggle: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay (mobile only) */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{ width: '260px', background: '#0D2B3E' }}
      >
        {/* Logo with Toggle Button */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>
              A
            </div>
            <div>
              <span className="block text-sm font-extrabold text-white">Aethla Care</span>
              <span className="block text-[10px] text-white/40 uppercase">Admin Panel</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop Toggle Button */}
            <button 
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Mobile Close Button */}
            <button onClick={onClose} className="lg:hidden text-white/60">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {sidebarNav.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] uppercase text-white/30 px-3 mb-2">
                {group.group}
              </p>

              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/')

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 ${
                      isActive ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              AD
            </div>

            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Admin User</p>
              <p className="text-white/40 text-[11px]">admin@aethlacare.qa</p>
            </div>

            <button className="text-white/40">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

/* ---------------- TOPBAR ---------------- */

function TopBar({ onMenuClick, onToggleSidebar, sidebarCollapsed }: { onMenuClick: () => void; onToggleSidebar: () => void; sidebarCollapsed: boolean }) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="flex items-center gap-4 px-4 py-3 border-b bg-white">
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu size={20} />
      </button>

      {/* Desktop Toggle Button in TopBar (Alternative) */}
      <button 
        onClick={onToggleSidebar}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex-1 max-w-sm">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search size={16} />
          <input
            placeholder="Search..."
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      <div className="relative">
        <button onClick={() => setNotifOpen(!notifOpen)}>
          <Bell size={20} />
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50"
            >
              <p className="text-sm">No new notifications</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          A
        </div>
        <ChevronDown size={14} />
      </div>
    </header>
  )
}

/* ---------------- MAIN LAYOUT ---------------- */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // New state for desktop collapse
  const pathname = usePathname()

  const { isAuthenticated } = useAuthStore()

  // 🚨 LOGIN PAGE: NO SIDEBAR
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with conditional width for desktop */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-0 lg:w-0' : 'w-[260px]'}
          hidden lg:block
        `}
      />
      
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggle={toggleSidebar}
      />

      <div className="flex-1 flex flex-col">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
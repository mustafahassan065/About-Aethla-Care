'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Bell } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { AdminGuard } from '@/components/shared/AdminGuard'

const navItems = [
  { href: '/employee/dashboard',  label: 'My Dashboard'    },
  { href: '/employee/schedule',   label: 'My Schedule'     },
  { href: '/employee/clients',    label: 'My Clients'      },
  { href: '/employee/care-notes', label: 'Care Notes'      },
  { href: '/employee/checkin',    label: 'Check In / Out'  },
  { href: '/employee/incidents',  label: 'Report Incident' },
  { href: '/employee/profile',    label: 'My Profile'      },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/employee/login')
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px', background: '#134F66' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/employee/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold font-poppins text-base"
              style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
            <div>
              <span className="block text-sm font-extrabold font-poppins text-white leading-tight">Aethla Care</span>
              <span className="block text-[10px] text-white/40 uppercase tracking-widest">Employee Portal</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`sidebar-link ${isActive ? 'active' : ''} mb-0.5`}
              >
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold font-poppins text-sm flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-poppins text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[11px] text-white/40 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors p-1">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminGuard allowedRoles={['caregiver', 'coordinator']} redirectTo="/employee/login">
      <div className="min-h-screen bg-neutral-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-[260px] flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 flex items-center gap-4 px-4 md:px-6 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100">
              <Menu size={22} />
            </button>
            <span className="text-body-sm font-semibold text-neutral-600">Employee Portal</span>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative p-2 rounded-xl text-neutral-600 hover:bg-neutral-100">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
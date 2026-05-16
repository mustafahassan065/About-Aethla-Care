'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, Search, LogOut, ChevronDown } from 'lucide-react'

const sidebarNav = [
  {
    group: 'Overview',
    items: [
      { href: '/admin/dashboard',       icon: '📊', label: 'Dashboard'       },
    ],
  },
  {
    group: 'Care Management',
    items: [
      { href: '/admin/clients',         icon: '👥', label: 'Clients'         },
      { href: '/admin/staff',           icon: '🏃', label: 'Staff'           },
      { href: '/admin/scheduling',      icon: '📅', label: 'Scheduling'      },
      { href: '/admin/care-notes',      icon: '📝', label: 'Care Notes'      },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/admin/billing',         icon: '💰', label: 'Billing'         },
      { href: '/admin/communications',  icon: '💬', label: 'Communications'  },
      { href: '/admin/reports',         icon: '📈', label: 'Reports'         },
    ],
  },
  {
    group: 'Content',
    items: [
      { href: '/admin/cms',             icon: '📄', label: 'CMS'             },
    ],
  },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px', background: '#0D2B3E' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold font-poppins text-base" style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
            <div>
              <span className="block text-sm font-extrabold font-poppins text-white leading-tight">Aethla Care</span>
              <span className="block text-[10px] text-white/40 uppercase tracking-widest">Admin Panel</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          {sidebarNav.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 px-3 mb-2">{group.group}</p>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`sidebar-link ${isActive ? 'active' : ''} mb-0.5`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-poppins text-sm flex-shrink-0">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-poppins text-white truncate">Admin User</p>
              <p className="text-[11px] text-white/40 truncate">admin@aethlacare.qa</p>
            </div>
            <button className="text-white/40 hover:text-white transition-colors p-1"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>
    </>
  )
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { icon: '⚠️', text: 'Incident reported for client #C-1042', time: '18m ago' },
    { icon: '📅', text: '3 shifts unassigned for tomorrow', time: '1h ago' },
    { icon: '🧾', text: 'Invoice overdue: Al-Rashid Family', time: '3h ago' },
    { icon: '🆕', text: 'New consultation request received', time: '5h ago' },
  ]

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 flex items-center gap-4 px-4 md:px-6 h-16">
      <button onClick={onMenuClick} className="lg:hidden text-neutral-600 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
          <Search size={16} className="text-neutral-400 flex-shrink-0" />
          <input type="text" placeholder="Search clients, staff..." className="bg-transparent text-body-sm text-neutral-600 outline-none w-full placeholder:text-neutral-400" />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-neutral-600 hover:text-primary-500 hover:bg-primary-50 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-neutral-100 overflow-hidden z-50"
                style={{ boxShadow: '0 20px 60px rgba(27,107,138,0.16)' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                  <span className="text-body-sm font-bold font-poppins text-neutral-800">Notifications</span>
                  <button className="text-caption text-primary-500 hover:underline">Mark all read</button>
                </div>
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0 cursor-pointer">
                    <span className="text-lg mt-0.5">{n.icon}</span>
                    <div>
                      <p className="text-body-sm text-neutral-700 leading-snug">{n.text}</p>
                      <span className="text-caption text-neutral-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 rounded-xl px-2 py-1.5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-poppins text-sm flex-shrink-0">AD</div>
          <span className="hidden sm:block text-body-sm font-semibold text-neutral-700">Admin</span>
          <ChevronDown size={14} className="text-neutral-400" />
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

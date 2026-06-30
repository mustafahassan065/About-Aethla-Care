'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { AdminGuard } from '@/components/shared/AdminGuard'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { useAuthStore } from '@/lib/auth'

const sidebarNav = [
  {
    group: 'Overview',
    items: [
      { href: '/admin/dashboard',  label: 'Dashboard'      },
      { href: '/admin/activity',   label: 'Activity Log'   },
    ],
  },
  {
    group: 'Care Management',
    items: [
      { href: '/admin/consultations', label: 'Consultations'      },
      { href: '/admin/signups',       label: 'Signup Requests'    },
      { href: '/admin/clients',       label: 'Clients'            },
      { href: '/admin/staff',         label: 'Staff'              },
      { href: '/admin/matching',      label: 'Caregiver Matching' },
      { href: '/admin/scheduling',    label: 'Scheduling'         },
      { href: '/admin/care-notes',    label: 'Care Notes'         },
      { href: '/admin/incidents',     label: 'Incidents'          },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/admin/billing',    label: 'Billing & Finance' },
      { href: '/admin/compliance', label: 'Compliance'        },
      { href: '/admin/reports',    label: 'Reports'           },
    ],
  },
  {
    group: 'Content',
    items: [
      { href: '/admin/cms',     label: 'CMS / Blog'          },
      { href: '/admin/qa', label: 'Q&A Management' },
      { href: '/admin/careers', label: 'Career Applications' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/view-as', label: 'View As User' },
      { href: '/admin/users',    label: 'Users & Access' },
      { href: '/admin/settings', label: 'Settings'       },
    ],
  },
]

const accountantAllowed = ['/admin/billing', '/admin/reports']
const coordinatorHidden = ['/admin/settings', '/admin/users', '/admin/activity']

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const router = useRouter()

  const filteredNav = sidebarNav.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (user?.role === 'accountant') return accountantAllowed.some(p => item.href.startsWith(p))
      if (user?.role === 'coordinator') return !coordinatorHidden.includes(item.href)
      return true
    }),
  })).filter(s => s.items.length > 0)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
        )}
      </AnimatePresence>
      <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px', background: '#0D2B3E' }}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold font-poppins"
              style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
            <div>
              <span className="block text-sm font-extrabold font-poppins text-white">Aethla Care</span>
              <span className="block text-[10px] text-white/40 uppercase tracking-widest">
                {user?.role === 'accountant' ? 'Finance Portal' : user?.role === 'coordinator' ? 'Coordinator Panel' : 'Admin Panel'}
              </span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          {filteredNav.map((section) => (
            <div key={section.group} className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-1.5">{section.group}</p>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}
                    className={`sidebar-link ${isActive ? 'active' : ''} mb-0.5`}>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[11px] text-white/40 capitalize">{user?.role}</p>
            </div>
            <button onClick={async () => { await logout(); router.push('/admin/login') }}
              className="text-white/40 hover:text-white p-1"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Public auth pages — no guard, no sidebar
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password'
  ) {
    return <>{children}</>
  }

  return (
    <AdminGuard allowedRoles={['admin', 'coordinator', 'accountant']} redirectTo="/admin/login">
      <div className="min-h-screen bg-neutral-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-[260px] flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 flex items-center gap-4 px-4 md:px-6 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100">
              <Menu size={22} />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
              <Link href="/admin/settings" className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100">
                <Settings size={20} />
              </Link>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/index'

export default function CustomerDashboard() {
  const { user } = useAuthStore()

  // Get client record linked to this user
  const { data: clientData } = useQuery({
    queryKey: ['portal', 'client', user?._id],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
    retry: 1,
  })

  const client = clientData?.data?.[0]

  // Recent visits
  const { data: schedules } = useQuery({
    queryKey: ['portal', 'schedules', client?._id],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=5`).then(r => r.data),
    enabled: !!client?._id,
    retry: 1,
  })

  // Recent care notes
  const { data: notes } = useQuery({
    queryKey: ['portal', 'notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&limit=3`).then(r => r.data),
    enabled: !!client?._id,
    retry: 1,
  })

  // Invoices
  const { data: invoices } = useQuery({
    queryKey: ['portal', 'invoices', client?._id],
    queryFn: () => apiClient.get(`/billing/invoices?clientId=${client._id}&limit=3`).then(r => r.data),
    enabled: !!client?._id,
    retry: 1,
  })

  const recentVisits = schedules?.data || []
  const recentNotes  = notes?.data || []
  const recentInvoices = invoices?.data || []

  const upcomingVisit = recentVisits.find((v: any) => v.status === 'scheduled')
  const totalUnpaid = recentInvoices
    .filter((i: any) => i.status === 'sent' || i.status === 'overdue')
    .reduce((s: number, i: any) => s + (i.total || 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">
          Welcome, {user?.firstName}
        </h1>
        <p className="text-body-sm text-neutral-400 mt-1">
          {new Date().toLocaleDateString('en-QA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <p className="text-caption text-neutral-400 mb-1">Care Status</p>
          {client ? <StatusBadge status={client.status} /> : <div className="skeleton h-5 w-16 rounded" />}
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{recentVisits.length}</div>
          <p className="text-caption text-neutral-400 mt-1">Recent Visits</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #C9A84C' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalUnpaid.toLocaleString()}</div>
          <p className="text-caption text-neutral-400 mt-1">Outstanding Balance</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #94A3B8' }}>
          <p className="text-caption text-neutral-400 mb-1">Next Visit</p>
          {upcomingVisit
            ? <p className="text-body-sm font-semibold text-neutral-800">{upcomingVisit.date} · {upcomingVisit.startTime}</p>
            : <p className="text-body-sm text-neutral-400">None scheduled</p>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Visits */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-heading-md font-poppins">Recent Visits</h3>
            <Link href="/portal/schedule" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          {recentVisits.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No visits yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentVisits.slice(0, 4).map((v: any) => (
                <div key={v._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{v.date} · {v.startTime}</p>
                    <p className="text-caption text-neutral-400 capitalize">{(v.serviceType || '').replace('-', ' ')}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Care Notes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-heading-md font-poppins">Care Notes</h3>
            <Link href="/portal/care-notes" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          {recentNotes.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No care notes yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentNotes.map((note: any) => (
                <div key={note._id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-body-sm font-semibold text-neutral-800">{note.visitDate}</p>
                    <span className="text-caption capitalize text-neutral-500">Mood: {note.mood}</span>
                  </div>
                  <p className="text-caption text-neutral-500 line-clamp-2">{note.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing Summary */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-heading-md font-poppins">Billing</h3>
            <Link href="/portal/billing" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No invoices yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentInvoices.map((inv: any) => (
                <div key={inv._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{inv.invoiceNumber}</p>
                    <p className="text-caption text-neutral-400">Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-bold font-poppins text-neutral-800">QAR {(inv.total || 0).toLocaleString()}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/portal/schedule',   label: 'Visit Schedule'  },
              { href: '/portal/care-notes', label: 'Care Notes'      },
              { href: '/portal/billing',    label: 'Invoices'        },
              { href: '/portal/caregiver',  label: 'My Caregiver'   },
              { href: '/portal/messages',   label: 'Messages'        },
              { href: '/portal/profile',    label: 'My Profile'      },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center justify-center p-3 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center">
                <span className="text-body-sm font-semibold text-neutral-600">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
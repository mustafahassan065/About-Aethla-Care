'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import Link from 'next/link'

export default function CustomerDashboard() {
  const { user } = useAuthStore()

  // Get client record linked to this family user
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ['my-client-record', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
    retry: 1,
  })

  const client = clientData

  // Get recent visits for THIS client only
  const { data: schedules } = useQuery({
    queryKey: ['my-visits', client?._id],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=5`).then(r => r.data),
    enabled: !!client?._id,
  })

  // Get shared care notes for THIS client
  const { data: notes } = useQuery({
    queryKey: ['my-notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&familyShared=true&limit=3`).then(r => r.data),
    enabled: !!client?._id,
  })

  // Get invoices for THIS client
  const { data: invoices } = useQuery({
    queryKey: ['my-invoices', client?._id],
    queryFn: () => apiClient.get(`/billing/invoices?clientId=${client._id}&limit=3`).then(r => r.data),
    enabled: !!client?._id,
  })

  const visits = schedules?.data || []
  const careNotes = notes?.data || []
  const bills = invoices?.data || []

  const nextVisit = visits.find((v: any) => v.status === 'scheduled')
  const unpaid = bills.filter((i: any) => ['sent', 'overdue'].includes(i.status))
    .reduce((s: number, i: any) => s + (i.total || 0), 0)

  if (clientLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    )
  }

  if (!client) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-heading-lg font-poppins text-neutral-700 mb-3">Profile Not Set Up Yet</h2>
        <p className="text-body-md text-neutral-500 mb-2">
          Your family portal account has been created but is not yet linked to a care client.
        </p>
        <p className="text-body-sm text-neutral-400">
          Please contact your care coordinator to complete the setup.
        </p>
        <a href="tel:+97440000000" className="btn-primary btn-sm mt-5 inline-block">
          Call Coordinator
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">
          Welcome, {user?.firstName}
        </h1>
        <p className="text-body-sm text-neutral-400 mt-1">
          Viewing care updates for {client.firstName} {client.lastName}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <p className="text-caption text-neutral-400 mb-1">Care Status</p>
          <span className={`inline-flex px-2 py-1 rounded-full text-caption font-semibold capitalize ${
            client.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
          }`}>{client.status}</span>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{visits.length}</div>
          <p className="text-caption text-neutral-400 mt-1">Recent Visits</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #C9A84C' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {unpaid.toLocaleString()}</div>
          <p className="text-caption text-neutral-400 mt-1">Outstanding</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #94A3B8' }}>
          <p className="text-caption text-neutral-400 mb-1">Next Visit</p>
          {nextVisit
            ? <p className="text-body-sm font-semibold text-neutral-800">{nextVisit.date} · {nextVisit.startTime}</p>
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
          {visits.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No visits yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {visits.map((v: any) => (
                <div key={v._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{v.date} · {v.startTime}</p>
                    <p className="text-caption text-neutral-400 capitalize">{(v.serviceType || '').replace('-', ' ')}</p>
                    {v.caregiverId?.userId && (
                      <p className="text-caption text-neutral-400">
                        {v.caregiverId.userId.firstName} {v.caregiverId.userId.lastName}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                    v.status === 'completed'   ? 'bg-green-50 text-green-600' :
                    v.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                    v.status === 'scheduled'   ? 'bg-blue-50 text-blue-600'   :
                    'bg-neutral-100 text-neutral-500'
                  }`}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Care Notes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-heading-md font-poppins">Latest Care Notes</h3>
            <Link href="/portal/care-notes" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          {careNotes.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No care notes shared yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {careNotes.map((note: any) => (
                <div key={note._id} className="px-5 py-3.5">
                  <div className="flex justify-between mb-1">
                    <p className="text-body-sm font-semibold text-neutral-800">{note.visitDate}</p>
                    <span className={`text-caption font-semibold capitalize px-2 py-0.5 rounded-full ${
                      note.mood === 'excellent' ? 'bg-green-50 text-green-600' :
                      note.mood === 'good'      ? 'bg-blue-50 text-blue-600'   :
                      note.mood === 'fair'      ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-500'
                    }`}>Mood: {note.mood}</span>
                  </div>
                  <p className="text-body-sm text-neutral-500 line-clamp-2">{note.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-heading-md font-poppins">Billing</h3>
            <Link href="/portal/billing" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          {bills.length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No invoices yet.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {bills.map((inv: any) => (
                <div key={inv._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{inv.invoiceNumber}</p>
                    <p className="text-caption text-neutral-400">Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-bold text-neutral-800">QAR {(inv.total || 0).toLocaleString()}</p>
                    <span className={`text-caption font-semibold capitalize ${
                      inv.status === 'paid'    ? 'text-green-600' :
                      inv.status === 'overdue' ? 'text-red-500'   : 'text-amber-600'
                    }`}>{inv.status}</span>
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
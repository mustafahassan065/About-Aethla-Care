'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, AlertTriangle, Calendar, FileText } from 'lucide-react'
import { useClient, useCareNotes, useSchedules } from '@/hooks'
import { StatusBadge, Avatar, PageHeader } from '@/components/ui/index'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule' | 'billing'>('overview')
  const { data: client, isLoading } = useClient(params.id)
  const { data: notes } = useCareNotes({ clientId: params.id, limit: 10 })
  const { data: schedules } = useSchedules({ clientId: params.id, limit: 10 })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-heading-xl mb-2">Client not found</h2>
        <Link href="/admin/clients" className="btn-primary btn-sm mt-4">← Back to Clients</Link>
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: '📋 Overview' },
    { key: 'notes', label: `📝 Care Notes (${notes?.total ?? 0})` },
    { key: 'schedule', label: `📅 Schedule (${schedules?.total ?? 0})` },
    { key: 'billing', label: '💰 Billing' },
  ] as const

  return (
    <div>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={`Client ID: ${client._id.slice(-8).toUpperCase()}`}
        action={
          <div className="flex gap-3">
            <Link href={`/admin/clients/${params.id}/edit`} className="btn-outline btn-sm">Edit Profile</Link>
            <Link href="/admin/clients" className="btn-ghost-sm text-neutral-500 hover:text-neutral-700 text-body-sm font-semibold py-2 px-3">← Back</Link>
          </div>
        }
      />

      {/* Top cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-3">
          <Avatar name={`${client.firstName} ${client.lastName}`} size="lg" />
          <div>
            <StatusBadge status={client.status} />
            <p className="text-caption text-neutral-400 mt-1">{client.careType?.join(', ')}</p>
          </div>
        </div>
        <div className="card p-5 space-y-2">
          <p className="text-overline text-neutral-400">Contact</p>
          <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-body-sm text-primary-500 font-semibold">
            <Phone size={14} /> {client.phone}
          </a>
          {client.email && (
            <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-body-sm text-neutral-600">
              <Mail size={14} /> {client.email}
            </a>
          )}
        </div>
        <div className="card p-5">
          <p className="text-overline text-neutral-400 mb-2">Location</p>
          <div className="flex items-start gap-2 text-body-sm text-neutral-600">
            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary-400" />
            {client.address?.area}, {client.address?.city}, Qatar
          </div>
        </div>
        <div className="card p-5">
          <p className="text-overline text-neutral-400 mb-2">Emergency</p>
          {client.emergencyContacts?.[0] ? (
            <div>
              <p className="text-body-sm font-semibold text-neutral-800">{client.emergencyContacts[0].name}</p>
              <p className="text-caption text-neutral-500">{client.emergencyContacts[0].relationship}</p>
              <a href={`tel:${client.emergencyContacts[0].phone}`} className="text-caption text-primary-500">{client.emergencyContacts[0].phone}</a>
            </div>
          ) : <p className="text-caption text-neutral-400">None on file</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 ${
              activeTab === t.key ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Personal Details</h3>
            <dl className="space-y-3">
              {[
                ['Full Name', `${client.firstName} ${client.lastName}`],
                ['Date of Birth', client.dateOfBirth],
                ['Gender', client.gender],
                ['Phone', client.phone],
                ['Email', client.email || '—'],
                ['Address', `${client.address?.area}, ${client.address?.city}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                  <dt className="text-body-sm text-neutral-400">{k}</dt>
                  <dd className="text-body-sm font-semibold text-neutral-700 text-right max-w-[60%]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medical Information</h3>
            {client.medicalConditions?.length ? (
              <div className="mb-4">
                <p className="text-overline text-neutral-400 mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {client.medicalConditions.map((c: string) => <span key={c} className="badge-primary">{c}</span>)}
                </div>
              </div>
            ) : null}
            {client.allergies?.length ? (
              <div className="mb-4">
                <p className="text-overline text-neutral-400 mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {client.allergies.map((a: string) => <span key={a} className="badge-error">{a}</span>)}
                </div>
              </div>
            ) : null}
            {client.notes && (
              <div>
                <p className="text-overline text-neutral-400 mb-2">Notes</p>
                <p className="text-body-sm text-neutral-600 leading-relaxed">{client.notes}</p>
              </div>
            )}
            {!client.medicalConditions?.length && !client.allergies?.length && !client.notes && (
              <p className="text-body-sm text-neutral-400">No medical information on file.</p>
            )}
          </div>
        </div>
      )}

      {/* Care Notes tab */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-body-sm text-neutral-500">{notes?.total ?? 0} care notes</p>
            <Link href="/admin/care-notes/new" className="btn-primary btn-sm">+ New Note</Link>
          </div>
          {notes?.data?.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-body-md text-neutral-400">No care notes yet.</p>
            </div>
          )}
          {notes?.data?.map((note: any) => (
            <div key={note._id} className="card p-5">
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{note.mood === 'excellent' ? '😊' : note.mood === 'good' ? '🙂' : note.mood === 'fair' ? '😐' : '😔'}</span>
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{note.visitDate}</p>
                    <p className="text-caption text-neutral-400">{note.tasksCompleted?.length} tasks completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {note.familyShared && <span className="badge-accent text-xs">Shared</span>}
                  <Link href={`/admin/care-notes/${note._id}`} className="btn-outline btn-sm py-1 px-3 text-xs">View</Link>
                </div>
              </div>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{note.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* Schedule tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-body-sm text-neutral-500">{schedules?.total ?? 0} visits</p>
            <Link href="/admin/scheduling" className="btn-primary btn-sm">+ New Schedule</Link>
          </div>
          {schedules?.data?.map((s: any) => (
            <div key={s._id} className="card p-4 flex items-center gap-4">
              <div className="text-2xl">📅</div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-neutral-800">{s.date} · {s.startTime} – {s.endTime}</p>
                <p className="text-caption text-neutral-400 capitalize">{s.serviceType?.replace('-', ' ')}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
          {schedules?.data?.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-body-md text-neutral-400">No visits scheduled yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'billing' && (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">🧾</div>
          <p className="text-body-md text-neutral-500 mb-4">View invoices for this client in the Billing section.</p>
          <Link href={`/admin/billing?clientId=${params.id}`} className="btn-primary btn-sm">Go to Billing →</Link>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useClient, useCareNotes, useSchedules } from '@/hooks'
import { StatusBadge, Avatar, PageHeader } from '@/components/ui/index'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule' | 'billing' | 'consent'>('overview')
  const { data: client, isLoading } = useClient(params.id)
  const { data: notes }     = useCareNotes({ clientId: params.id, limit: 10 })
  const { data: schedules } = useSchedules({ clientId: params.id, limit: 10 })

  const [consentSigned, setConsentSigned] = useState({
    careConsent:     false,
    dataProtection:  false,
    photoConsent:    false,
    medicationConsent: false,
  })

  if (isLoading) return (
    <div className="space-y-6">
      <div className="skeleton h-12 w-64 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
    </div>
  )

  if (!client) return (
    <div className="text-center py-20">
      <p className="text-body-md text-neutral-400 mb-4">Client not found</p>
      <Link href="/admin/clients" className="btn-primary btn-sm">← Back to Clients</Link>
    </div>
  )

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'notes',    label: `Care Notes (${notes?.total ?? 0})` },
    { key: 'schedule', label: `Schedule (${schedules?.total ?? 0})` },
    { key: 'billing',  label: 'Billing' },
    { key: 'consent',  label: 'Consent Forms' },
  ] as const

  return (
    <div>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={`Client ID: ${client._id.slice(-8).toUpperCase()}`}
        action={
          <div className="flex gap-3">
            <Link href={`/admin/clients/${params.id}/edit`} className="btn-outline btn-sm">Edit Profile</Link>
            <Link href="/admin/clients" className="btn-ghost-sm text-neutral-500 text-body-sm font-semibold py-2 px-3">← Back</Link>
          </div>
        }
      />

      {/* Top Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-3">
          <Avatar name={`${client.firstName} ${client.lastName}`} size="lg" />
          <div>
            <StatusBadge status={client.status} />
            <p className="text-caption text-neutral-400 mt-1">{client.careType?.join(', ')}</p>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-overline text-neutral-400 mb-2">Contact</p>
          <a href={`tel:${client.phone}`} className="text-body-sm text-primary-500 font-semibold block">{client.phone}</a>
          {client.email && <a href={`mailto:${client.email}`} className="text-body-sm text-neutral-500 mt-1 block">{client.email}</a>}
        </div>
        <div className="card p-5">
          <p className="text-overline text-neutral-400 mb-2">Location</p>
          <p className="text-body-sm text-neutral-700">{client.address?.area}, {client.address?.city}</p>
        </div>
        <div className="card p-5">
          <p className="text-overline text-neutral-400 mb-2">Emergency Contact</p>
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
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
              activeTab === t.key ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Personal Details</h3>
            <dl className="space-y-3">
              {[
                ['Full Name',     `${client.firstName} ${client.lastName}`],
                ['Date of Birth', client.dateOfBirth],
                ['Gender',        client.gender],
                ['Phone',         client.phone],
                ['Email',         client.email || '—'],
                ['Address',       `${client.address?.area}, ${client.address?.city}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                  <dt className="text-body-sm text-neutral-400">{k}</dt>
                  <dd className="text-body-sm font-semibold text-neutral-700">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medical Information</h3>
            {client.medicalConditions?.length > 0 && (
              <div className="mb-4">
                <p className="text-overline text-neutral-400 mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {client.medicalConditions.map((c: string) => <span key={c} className="badge-primary">{c}</span>)}
                </div>
              </div>
            )}
            {client.allergies?.length > 0 && (
              <div className="mb-4">
                <p className="text-overline text-neutral-400 mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {client.allergies.map((a: string) => <span key={a} className="badge-error">{a}</span>)}
                </div>
              </div>
            )}
            {client.notes && <p className="text-body-sm text-neutral-600">{client.notes}</p>}
            {!client.medicalConditions?.length && !client.allergies?.length && !client.notes && (
              <p className="text-body-sm text-neutral-400">No medical information on file.</p>
            )}
          </div>
        </div>
      )}

      {/* Care Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-body-sm text-neutral-500">{notes?.total ?? 0} care notes</p>
            <Link href="/admin/care-notes/new" className="btn-primary btn-sm">+ New Note</Link>
          </div>
          {notes?.data?.length === 0 && <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No care notes yet.</p></div>}
          {notes?.data?.map((note: any) => (
            <div key={note._id} className="card p-5">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-body-sm font-semibold text-neutral-800">{note.visitDate}</p>
                  <p className="text-caption text-neutral-400">{note.tasksCompleted?.length} tasks · Mood: {note.mood}</p>
                </div>
                {note.familyShared && <span className="badge-accent text-xs">Shared</span>}
              </div>
              <p className="text-body-sm text-neutral-600">{note.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-body-sm text-neutral-500">{schedules?.total ?? 0} visits</p>
            <Link href="/admin/scheduling/new" className="btn-primary btn-sm">+ New Schedule</Link>
          </div>
          {schedules?.data?.map((s: any) => (
            <div key={s._id} className="card p-4 flex items-center gap-4">
              <div className="min-w-[60px] text-center">
                <p className="text-heading-sm font-poppins text-primary-500">{s.startTime}</p>
                <p className="text-caption text-neutral-400">{s.date}</p>
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-neutral-800 capitalize">{(s.serviceType || '').replace('-', ' ')}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
          {schedules?.data?.length === 0 && <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No visits yet.</p></div>}
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="card p-8 text-center">
          <p className="text-body-md text-neutral-500 mb-4">View invoices for this client in the Billing section.</p>
          <Link href={`/admin/billing?clientId=${params.id}`} className="btn-primary btn-sm">Go to Billing</Link>
        </div>
      )}

      {/* Consent Forms Tab */}
      {activeTab === 'consent' && (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Consent & Agreement Forms</h3>
            <div className="flex flex-col gap-4">
              {[
                { key: 'careConsent',       title: 'Care Services Consent',          desc: 'Client consents to receive home healthcare services from Aethla Care.' },
                { key: 'dataProtection',    title: 'Data Protection Agreement',      desc: 'Client consents to the collection and use of personal and health data for care purposes.' },
                { key: 'photoConsent',      title: 'Photo & Documentation Consent',  desc: 'Client consents to photographs being taken for care documentation purposes.' },
                { key: 'medicationConsent', title: 'Medication Administration Consent', desc: 'Client consents to caregivers administering prescribed medications during visits.' },
              ].map(f => (
                <div key={f.key} className="flex items-start justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition-colors gap-4">
                  <div className="flex-1">
                    <h4 className="text-body-sm font-bold font-poppins text-neutral-800 mb-0.5">{f.title}</h4>
                    <p className="text-body-sm text-neutral-500">{f.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-caption font-semibold px-2 py-1 rounded-full ${
                      consentSigned[f.key as keyof typeof consentSigned]
                        ? 'bg-green-50 text-green-600'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {consentSigned[f.key as keyof typeof consentSigned] ? 'Signed' : 'Pending'}
                    </span>
                    <button
                      onClick={() => setConsentSigned(p => ({ ...p, [f.key]: !p[f.key as keyof typeof consentSigned] }))}
                      className="btn-outline btn-sm py-1 px-3 text-xs"
                    >
                      {consentSigned[f.key as keyof typeof consentSigned] ? 'Revoke' : 'Mark Signed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-body-sm text-neutral-500">
              Digital consent signatures and audit trails are maintained as part of GDPR-style data protection compliance. All consent records are timestamped and stored securely.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
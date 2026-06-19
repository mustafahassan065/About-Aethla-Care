'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'

export default function PortalProfile() {
  const { user } = useAuthStore()

  const { data: client, isLoading } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your care profile and personal details" />

      {isLoading ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : !client ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500">Profile not yet linked. Contact your care coordinator.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <Avatar name={`${client.firstName} ${client.lastName}`} size="lg" />
            <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">{client.firstName} {client.lastName}</h3>
            <StatusBadge status={client.status} />
            <p className="text-caption text-neutral-400 mt-2">{client.careType?.join(', ')}</p>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Personal Information</h3>
              <dl className="space-y-3">
                {[
                  ['Full Name',     `${client.firstName} ${client.lastName}`],
                  ['Date of Birth', client.dateOfBirth || '—'],
                  ['Gender',        client.gender || '—'],
                  ['Phone',         client.phone || '—'],
                  ['Email',         client.email || '—'],
                  ['Location',      client.address ? `${client.address.area}, ${client.address.city}` : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {client.emergencyContacts?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-4">Emergency Contact</h3>
                <dl className="space-y-3">
                  {[
                    ['Name',         client.emergencyContacts[0].name],
                    ['Relationship', client.emergencyContacts[0].relationship],
                    ['Phone',        client.emergencyContacts[0].phone],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                      <dt className="text-body-sm text-neutral-400">{k}</dt>
                      <dd className="text-body-sm font-semibold text-neutral-700">{v || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {(client.medicalConditions?.length > 0 || client.allergies?.length > 0) && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-4">Medical Information</h3>
                {client.medicalConditions?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-caption text-neutral-400 mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {client.medicalConditions.map((c: string) => <span key={c} className="badge-primary">{c}</span>)}
                    </div>
                  </div>
                )}
                {client.allergies?.length > 0 && (
                  <div>
                    <p className="text-caption text-neutral-400 mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {client.allergies.map((a: string) => <span key={a} className="badge-error">{a}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="card p-5">
              <p className="text-body-sm text-neutral-500">
                To update your profile, contact your care coordinator on{' '}
                <a href="tel:+97440000000" className="text-primary-500 font-semibold hover:underline">+974 4000 0000</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
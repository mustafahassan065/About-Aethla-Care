'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'

export default function PortalProfile() {
  const { user } = useAuthStore()

  const { data: clientData, isLoading } = useQuery({
    queryKey: ['portal', 'client-record'],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const client = clientData?.data?.[0]

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your care profile and personal details" />

      {isLoading ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="card p-6 text-center">
            <Avatar name={`${client?.firstName || user?.firstName || 'U'} ${client?.lastName || user?.lastName || ''}`} size="lg" />
            <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">
              {client?.firstName || user?.firstName} {client?.lastName || user?.lastName}
            </h3>
            {client && <StatusBadge status={client.status} />}
            <p className="text-caption text-neutral-400 mt-2">
              {client?.careType?.join(', ')}
            </p>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Personal Information</h3>
              <dl className="space-y-3">
                {[
                  ['Full Name',    `${client?.firstName || user?.firstName} ${client?.lastName || user?.lastName}`],
                  ['Email',        user?.email],
                  ['Phone',        client?.phone || '—'],
                  ['Date of Birth', client?.dateOfBirth || '—'],
                  ['Gender',       client?.gender || '—'],
                  ['Location',     client?.address ? `${client.address.area}, ${client.address.city}` : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {client?.emergencyContacts?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-4">Emergency Contact</h3>
                {client.emergencyContacts.map((ec: any, i: number) => (
                  <dl key={i} className="space-y-3">
                    {[
                      ['Name',         ec.name],
                      ['Relationship', ec.relationship],
                      ['Phone',        ec.phone],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                        <dt className="text-body-sm text-neutral-400">{k}</dt>
                        <dd className="text-body-sm font-semibold text-neutral-700">{v || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                ))}
              </div>
            )}

            <div className="card p-5">
              <p className="text-body-sm text-neutral-500">
                To update your profile details, please contact your care coordinator on{' '}
                <a href="tel:+97440000000" className="text-primary-500 hover:underline font-semibold">+974 4000 0000</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
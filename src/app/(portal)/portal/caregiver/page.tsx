'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'

export default function PortalCaregiver() {
  const { user } = useAuthStore()

  const { data: clientData } = useQuery({
    queryKey: ['portal', 'client-record'],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const client = clientData?.data?.[0]

  // Get assigned caregiver from most recent schedule
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['portal', 'caregiver-schedule', client?._id],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=5`).then(r => r.data),
    enabled: !!client?._id,
  })

  const caregiver = schedules?.data?.[0]?.caregiverId
  const cgUser    = caregiver?.userId

  return (
    <div>
      <PageHeader title="My Caregiver" subtitle="Your assigned care professional" />

      {isLoading ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : !caregiver ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No caregiver assigned yet.</p>
          <p className="text-body-sm text-neutral-400 mt-2">Contact your coordinator for more information.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card p-6 text-center">
            <Avatar name={`${cgUser?.firstName || 'U'} ${cgUser?.lastName || ''}`} size="lg" />
            <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">
              {cgUser?.firstName} {cgUser?.lastName}
            </h3>
            <p className="text-body-sm text-neutral-500 mt-1">
              {caregiver.specializations?.join(', ')}
            </p>
            <StatusBadge status={caregiver.status} />

            <div className="flex justify-center gap-6 mt-5 pt-5 border-t border-neutral-100">
              <div>
                <p className="text-2xl font-extrabold font-poppins text-primary-500">{caregiver.rating?.toFixed(1) || 'N/A'}</p>
                <p className="text-caption text-neutral-400">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-poppins text-accent-600">{caregiver.experience || 0}</p>
                <p className="text-caption text-neutral-400">Years Exp.</p>
              </div>
            </div>

            {cgUser?.phone && (
              <a href={`tel:${cgUser.phone}`} className="btn-primary btn-sm w-full mt-5">Call Caregiver</a>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Professional Details</h3>
              <dl className="space-y-3">
                {[
                  ['License Number',    caregiver.licenseNumber],
                  ['Languages',         caregiver.languages?.join(', ')],
                  ['Background Check',  caregiver.backgroundCheckStatus],
                  ['Experience',        `${caregiver.experience || 0} years`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {caregiver.bio && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-3">About</h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed">{caregiver.bio}</p>
              </div>
            )}

            <div className="card p-5">
              <p className="text-body-sm text-neutral-500">
                To change your assigned caregiver or discuss your care arrangement, please contact your coordinator on{' '}
                <a href="tel:+97440000000" className="text-primary-500 hover:underline font-semibold">+974 4000 0000</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
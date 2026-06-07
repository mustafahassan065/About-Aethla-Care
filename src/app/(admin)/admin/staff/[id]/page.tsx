'use client'

import Link from 'next/link'
import { useCaregiver } from '@/hooks'
import { StatusBadge, PageHeader, Avatar } from '@/components/ui/index'

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const { data: caregiver, isLoading } = useCaregiver(params.id)
  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />
  if (!caregiver) return <div className="text-center py-20"><p>Caregiver not found</p><Link href="/admin/staff" className="btn-primary btn-sm mt-4">← Back</Link></div>

  // userId is now always populated as user object
  const user = caregiver.userId || {}

  return (
    <div>
      <PageHeader
        title={`${user.firstName || ''} ${user.lastName || ''}`}
        subtitle="Caregiver Profile"
        action={<Link href="/admin/staff" className="btn-outline btn-sm">← Back to Staff</Link>}
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="card p-6 text-center">
            <Avatar name={`${user.firstName || 'U'} ${user.lastName || ''}`} size="lg" />
            <h3 className="text-heading-md font-poppins mt-3">{user.firstName} {user.lastName}</h3>
            <StatusBadge status={caregiver.status} />
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              {caregiver.specializations?.map((s: string) => (
                <span key={s} className="badge-primary capitalize">{s}</span>
              ))}
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <div className="text-center">
              <div className="text-3xl font-extrabold font-poppins text-primary-500">{caregiver.rating?.toFixed(1) || 'N/A'}</div>
              <p className="text-caption text-neutral-400">Average Rating</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl p-3 bg-primary-50">
                <div className="text-xl font-bold font-poppins text-primary-500">{caregiver.experience || 0}</div>
                <p className="text-caption text-neutral-500">Years Exp.</p>
              </div>
              <div className="rounded-xl p-3 bg-accent-50">
                <div className="text-xl font-bold font-poppins text-accent-600">{caregiver.currentClients?.length || 0}</div>
                <p className="text-caption text-neutral-500">Clients</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Professional Details</h3>
            <dl className="space-y-3">
              {[
                ['License Number', caregiver.licenseNumber],
                ['License Expiry', caregiver.licenseExpiry],
                ['Background Check', caregiver.backgroundCheckStatus],
                ['Hourly Rate', `QAR ${caregiver.hourlyRate || 0}/hr`],
                ['Languages', caregiver.languages?.join(', ')],
                ['Email', user.email],
                ['Phone', user.phone],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                  <dt className="text-body-sm text-neutral-400">{k}</dt>
                  <dd className="text-body-sm font-semibold text-neutral-700">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
          {caregiver.bio && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-3">Bio</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{caregiver.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
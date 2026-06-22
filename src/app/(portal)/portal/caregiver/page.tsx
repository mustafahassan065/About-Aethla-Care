'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'

export default function PortalCaregiverPage() {
  const { user } = useAuthStore()

  const { data: client } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  // Get assigned caregiver from schedules
  const { data: schedules } = useQuery({
    queryKey: ['my-recent-schedule', client?._id],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=5`).then(r => r.data),
    enabled: !!client?._id,
  })

  const recentSchedule = schedules?.data?.[0]
  const caregiverId = recentSchedule?.caregiverId?._id || client?.assignedCaregivers?.[0]

  const { data: cg, isLoading } = useQuery({
    queryKey: ['assigned-cg', caregiverId],
    queryFn: () => apiClient.get(`/caregivers/${caregiverId}`).then(r => r.data),
    enabled: !!caregiverId,
  })

  return (
    <div>
      <PageHeader title="My Caregiver" subtitle="Your assigned care professional" />

      {isLoading ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : !cg ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500 mb-2">No caregiver assigned yet.</p>
          <p className="text-body-sm text-neutral-400">Your care coordinator will assign a caregiver once your care plan is confirmed.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card p-6 text-center">
            <Avatar name={`${cg.userId?.firstName} ${cg.userId?.lastName}`} size="lg" />
            <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">
              {cg.userId?.firstName} {cg.userId?.lastName}
            </h3>
            <p className="text-body-sm text-neutral-500 mt-1">{cg.specializations?.join(', ')}</p>
            <StatusBadge status={cg.status} />

            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-neutral-100">
              <div>
                <p className="text-2xl font-extrabold font-poppins text-primary-500">{cg.rating?.toFixed(1) || '—'}</p>
                <p className="text-caption text-neutral-400">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-poppins text-accent-600">{cg.experience || 0}</p>
                <p className="text-caption text-neutral-400">Years Exp.</p>
              </div>
            </div>

            {cg.userId?.phone && (
              <a href={`tel:${cg.userId.phone}`}
                className="btn-outline w-full text-center block py-2.5 mt-4 text-body-sm font-semibold">
                Call Caregiver
              </a>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            {cg.bio && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-3">About</h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed">{cg.bio}</p>
              </div>
            )}

            {/* Skills */}
            {cg.skills?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cg.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-body-sm font-semibold bg-primary-50 text-primary-600 border border-primary-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cg.certificates?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-heading-md font-poppins mb-4">Certifications & Credentials</h3>
                <div className="flex flex-col gap-2">
                  {cg.certificates.map((cert: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-body-sm font-semibold text-neutral-700">{cert.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Info */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Professional Details</h3>
              <dl className="space-y-3">
                {[
                  ['Specializations',    cg.specializations?.join(', ') || '—'],
                  ['Languages',         cg.languages?.join(', ')       || '—'],
                  ['Experience',        `${cg.experience || 0} years`        ],
                  ['License Status',    cg.licenseNumber ? 'Verified' : 'On File'],
                  ['Background Check',  cg.backgroundCheckStatus || '—'      ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
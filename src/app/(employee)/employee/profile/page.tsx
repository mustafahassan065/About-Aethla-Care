'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function EmployeeProfile() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')

  const { data: cg, isLoading } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
    onSuccess: (data: any) => { if (data?.bio) setBio(data.bio) },
  })

  const updateMutation = useMutation({
    mutationFn: (dto: any) => apiClient.patch(`/caregivers/${cg._id}`, dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-cg'] }); toast.success('Profile updated'); setEditing(false) },
    onError: () => toast.error('Failed to update'),
  })

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  if (!cg) {
    return (
      <div>
        <PageHeader title="My Profile" subtitle="Your employee profile" />
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500">Caregiver profile not yet set up. Contact admin.</p>
        </div>
      </div>
    )
  }

  const cgUser = cg.userId

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Your professional caregiver profile"
        action={
          <button onClick={() => setEditing(!editing)} className={editing ? 'btn-outline btn-sm' : 'btn-primary btn-sm'}>
            {editing ? 'Cancel' : 'Edit Bio'}
          </button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 text-center">
          <Avatar name={`${cgUser?.firstName || 'U'} ${cgUser?.lastName || ''}`} size="lg" />
          <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">{cgUser?.firstName} {cgUser?.lastName}</h3>
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
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Professional Details</h3>
            <dl className="space-y-3">
              {[
                ['Email',              cgUser?.email || '—'],
                ['Phone',              cgUser?.phone || '—'],
                ['License Number',     cg.licenseNumber || '—'],
                ['License Expiry',     cg.licenseExpiry ? new Date(cg.licenseExpiry).toLocaleDateString() : '—'],
                ['Specializations',    cg.specializations?.join(', ') || '—'],
                ['Languages',          cg.languages?.join(', ') || '—'],
                ['Hourly Rate',        cg.hourlyRate ? `QAR ${cg.hourlyRate}/hr` : '—'],
                ['Background Check',   cg.backgroundCheckStatus || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                  <dt className="text-body-sm text-neutral-400">{k}</dt>
                  <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bio */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-3">About Me</h3>
            {editing ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  className="form-input min-h-[100px] resize-y mb-3" placeholder="Tell clients and coordinators about yourself..." />
                <button onClick={() => updateMutation.mutate({ bio })}
                  disabled={updateMutation.isPending} className="btn-primary btn-sm">
                  {updateMutation.isPending ? 'Saving...' : 'Save Bio'}
                </button>
              </div>
            ) : (
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                {cg.bio || 'No bio added yet. Click Edit Bio to add one.'}
              </p>
            )}
          </div>

          <div className="card p-5">
            <p className="text-body-sm text-neutral-500">
              To update your professional details, contact your coordinator on{' '}
              <a href="tel:+97440000000" className="text-primary-500 font-semibold hover:underline">+974 4000 0000</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

export default function AdminViewAsEmployee() {
  const [viewData, setViewData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('adminViewAs')
    if (data) setViewData(JSON.parse(data))
  }, [])

  const { data: schedules } = useQuery({
    queryKey: ['view-schedules', viewData?.caregiverId],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${viewData.caregiverId}&limit=10`).then(r => r.data),
    enabled: !!viewData?.caregiverId,
  })

  const { data: cg } = useQuery({
    queryKey: ['view-cg', viewData?.caregiverId],
    queryFn: () => apiClient.get(`/caregivers/${viewData.caregiverId}`).then(r => r.data),
    enabled: !!viewData?.caregiverId,
  })

  if (!viewData) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="card p-8 text-center">
        <p className="text-body-md text-neutral-500 mb-4">No user selected.</p>
        <Link href="/admin/view-as" className="btn-primary btn-sm">← Go Back</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Banner */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: '#1B6B8A' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-body-sm font-semibold text-white">
            Admin View — Viewing as: <strong>{viewData.name}</strong> (Employee)
          </p>
        </div>
        <Link href="/admin/view-as" className="text-white/70 hover:text-white text-body-sm font-semibold">← Exit View</Link>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-heading-xl font-poppins text-neutral-800 mb-6">{viewData.name}&apos;s Dashboard</h1>

        {/* Caregiver Info */}
        {cg && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Specializations', value: cg.specializations?.join(', ') || '—' },
              { label: 'License Number',  value: cg.licenseNumber || '—'               },
              { label: 'Status',          value: cg.status || '—'                      },
            ].map(s => (
              <div key={s.label} className="card p-4">
                <p className="text-caption text-neutral-400 mb-1">{s.label}</p>
                <p className="text-body-sm font-semibold text-neutral-800 capitalize">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Schedules */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="text-heading-md font-poppins">Recent Schedules</h3>
          </div>
          {(schedules?.data || []).length === 0 ? (
            <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No schedules found.</p></div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {(schedules?.data || []).map((s: any) => (
                <div key={s._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{s.date} · {s.startTime}</p>
                    <p className="text-caption text-neutral-400">{s.clientId?.firstName} {s.clientId?.lastName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                    s.status === 'completed' ? 'bg-green-50 text-green-600' :
                    s.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
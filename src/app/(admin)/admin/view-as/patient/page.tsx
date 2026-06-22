'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

export default function AdminViewAsPatient() {
  const [viewData, setViewData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('adminViewAs')
    if (data) setViewData(JSON.parse(data))
  }, [])

  const { data: client } = useQuery({
    queryKey: ['view-client', viewData?.userId],
    queryFn: () => apiClient.get(`/clients?limit=1`).then(async r => {
      // Find client linked to this user
      const all = await apiClient.get(`/clients?limit=200`).then(r => r.data)
      return all.data?.find((c: any) => c.userId?.toString() === viewData?.userId)
    }),
    enabled: !!viewData?.userId,
  })

  const { data: schedules } = useQuery({
    queryKey: ['view-patient-schedules', client?._id],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=10`).then(r => r.data),
    enabled: !!client?._id,
  })

  const { data: notes } = useQuery({
    queryKey: ['view-patient-notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&familyShared=true&limit=5`).then(r => r.data),
    enabled: !!client?._id,
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
        style={{ background: '#2DA88A' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <p className="text-body-sm font-semibold text-white">
            Admin View — Viewing as: <strong>{viewData.name}</strong> (Patient/Family)
          </p>
        </div>
        <Link href="/admin/view-as" className="text-white/70 hover:text-white text-body-sm font-semibold">← Exit View</Link>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-heading-xl font-poppins text-neutral-800 mb-6">{viewData.name}&apos;s Portal View</h1>

        {client ? (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Client Name',  value: `${client.firstName} ${client.lastName}` },
                { label: 'Care Type',    value: client.careType?.join(', ') || '—'       },
                { label: 'Status',       value: client.status || '—'                     },
              ].map(s => (
                <div key={s.label} className="card p-4">
                  <p className="text-caption text-neutral-400 mb-1">{s.label}</p>
                  <p className="text-body-sm font-semibold text-neutral-800 capitalize">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Schedules */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100">
                  <h3 className="text-heading-md font-poppins">Recent Visits</h3>
                </div>
                {(schedules?.data || []).length === 0 ? (
                  <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No visits.</p></div>
                ) : (
                  <div className="divide-y divide-neutral-50">
                    {(schedules?.data || []).map((s: any) => (
                      <div key={s._id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-body-sm font-semibold text-neutral-800">{s.date}</p>
                          <p className="text-caption text-neutral-400">{s.startTime} – {s.endTime}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                          s.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Care Notes */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100">
                  <h3 className="text-heading-md font-poppins">Shared Care Notes</h3>
                </div>
                {(notes?.data || []).length === 0 ? (
                  <div className="p-8 text-center"><p className="text-body-sm text-neutral-400">No shared notes.</p></div>
                ) : (
                  <div className="divide-y divide-neutral-50">
                    {(notes?.data || []).map((n: any) => (
                      <div key={n._id} className="p-4">
                        <p className="text-body-sm font-semibold text-neutral-800">{n.visitDate}</p>
                        <p className="text-body-sm text-neutral-500 line-clamp-2 mt-1">{n.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-body-md text-neutral-500">No client linked to this family account yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
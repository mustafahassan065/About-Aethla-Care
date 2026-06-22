'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'

export default function ShiftHistory() {
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)

  const { data: cg } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['my-shift-history', cg?._id, page],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cg._id}&limit=20&page=${page}`).then(r => r.data),
    enabled: !!cg?._id,
  })

  const visits    = data?.data || []
  const total     = data?.total || 0
  const completed = visits.filter((v: any) => v.status === 'completed').length
  const missed    = visits.filter((v: any) => v.status === 'missed').length

  return (
    <div>
      <PageHeader title="Shift History" subtitle="Complete record of your care visits" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Shifts',  value: total,     color: '#1B6B8A' },
          { label: 'Completed',     value: completed, color: '#2DA88A' },
          { label: 'This Page',     value: visits.length, color: '#C9A84C' },
          { label: 'Missed',        value: missed,    color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : visits.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No shift history yet.</p></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="divide-y divide-neutral-50">
              {visits.map((v: any) => (
                <div key={v._id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <p className="text-body-sm font-bold font-poppins text-primary-500">{v.startTime}</p>
                      <p className="text-caption text-neutral-400">{v.date}</p>
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-800">
                        {v.clientId?.firstName} {v.clientId?.lastName}
                      </p>
                      <p className="text-caption text-neutral-400 capitalize">{(v.serviceType || '').replace('-', ' ')}</p>
                      {v.checkInTime && v.checkOutTime && (
                        <p className="text-caption text-green-600">
                          {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{' '}
                          {new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          </div>

          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-5">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-outline btn-sm">← Prev</button>
              <span className="text-body-sm text-neutral-500 py-2">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page === data.totalPages} className="btn-outline btn-sm">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
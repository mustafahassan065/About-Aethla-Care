'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'

export default function PortalHistory() {
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)

  const { data: client } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['my-history', client?._id, page],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&limit=20&page=${page}`).then(r => r.data),
    enabled: !!client?._id,
  })

  const visits = data?.data || []
  const total  = data?.total || 0
  const completed = visits.filter((v: any) => v.status === 'completed').length

  return (
    <div>
      <PageHeader title="Service History" subtitle="Complete history of your care visits" />

      {!client ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-500">Account not linked. Contact your coordinator.</p></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="card p-4" style={{ borderLeft: '4px solid #1B6B8A' }}>
              <div className="text-2xl font-extrabold font-poppins text-neutral-800">{total}</div>
              <p className="text-caption text-neutral-400 mt-1">Total Visits</p>
            </div>
            <div className="card p-4" style={{ borderLeft: '4px solid #2DA88A' }}>
              <div className="text-2xl font-extrabold font-poppins text-neutral-800">{completed}</div>
              <p className="text-caption text-neutral-400 mt-1">Completed</p>
            </div>
            <div className="card p-4" style={{ borderLeft: '4px solid #C9A84C' }}>
              <div className="text-2xl font-extrabold font-poppins text-neutral-800">{client.careType?.join(', ')}</div>
              <p className="text-caption text-neutral-400 mt-1">Service Type</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          ) : visits.length === 0 ? (
            <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No visit history yet.</p></div>
          ) : (
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
                        <p className="text-body-sm font-semibold text-neutral-800 capitalize">{(v.serviceType || '').replace('-', ' ')}</p>
                        {v.caregiverId?.userId && (
                          <p className="text-caption text-neutral-400">
                            {v.caregiverId.userId.firstName} {v.caregiverId.userId.lastName}
                          </p>
                        )}
                        {v.checkInTime && (
                          <p className="text-caption text-green-600">
                            Arrived: {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline btn-sm">← Prev</button>
              <span className="text-body-sm text-neutral-500 py-2">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page === data.totalPages} className="btn-outline btn-sm">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
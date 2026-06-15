'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'

export default function PortalSchedule() {
  const { user } = useAuthStore()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const { data: clientData } = useQuery({
    queryKey: ['portal', 'client-record'],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const client = clientData?.data?.[0]

  const { data, isLoading } = useQuery({
    queryKey: ['portal', 'schedule', client?._id, date],
    queryFn: () => apiClient.get(`/schedules?clientId=${client._id}&date=${date}&limit=50`).then(r => r.data),
    enabled: !!client?._id,
  })

  const visits = data?.data || []

  return (
    <div>
      <PageHeader title="Visit Schedule" subtitle="Upcoming and past care visits" />

      <div className="card p-4 mb-5">
        <label className="form-label">Select Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input w-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',       value: visits.length,                                              color: '#1B6B8A' },
          { label: 'Completed',   value: visits.filter((v: any) => v.status === 'completed').length,  color: '#2DA88A' },
          { label: 'Upcoming',    value: visits.filter((v: any) => v.status === 'scheduled').length,  color: '#94A3B8' },
          { label: 'In Progress', value: visits.filter((v: any) => v.status === 'in-progress').length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : visits.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No visits for this date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((v: any) => (
            <div key={v._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-heading-sm font-poppins text-primary-500">{v.startTime}</p>
                  <p className="text-caption text-neutral-400">{v.endTime}</p>
                </div>
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">
                    {v.caregiverId?.userId?.firstName} {v.caregiverId?.userId?.lastName}
                  </p>
                  <p className="text-caption text-neutral-500 capitalize">
                    {(v.serviceType || '').replace('-', ' ')}
                  </p>
                  {v.checkInTime && (
                    <p className="text-caption text-green-600 mt-0.5">
                      Arrived: {new Date(v.checkInTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <StatusBadge status={v.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
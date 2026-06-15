'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import Link from 'next/link'

export default function EmployeeSchedule() {
  const { user } = useAuthStore()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const { data, isLoading } = useQuery({
    queryKey: ['employee', 'schedule', date],
    queryFn: async () => {
      const cgRes = await apiClient.get(`/caregivers?userId=${user?._id}&limit=1`)
      const cg = cgRes.data?.data?.[0]
      if (!cg) return { data: [] }
      const res = await apiClient.get(`/schedules?caregiverId=${cg._id}&date=${date}&limit=50`)
      return res.data
    },
    enabled: !!user,
  })

  const visits = data?.data || []

  return (
    <div>
      <PageHeader title="My Schedule" subtitle="View and manage your assigned visits" />

      <div className="card p-4 mb-5">
        <label className="form-label">Select Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input w-auto" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Visits',  value: visits.length,                                             color: '#1B6B8A' },
          { label: 'Completed',     value: visits.filter((v: any) => v.status === 'completed').length, color: '#2DA88A' },
          { label: 'Scheduled',     value: visits.filter((v: any) => v.status === 'scheduled').length, color: '#94A3B8' },
          { label: 'In Progress',   value: visits.filter((v: any) => v.status === 'in-progress').length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Visits */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : visits.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No visits scheduled for {date}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((v: any) => (
            <div key={v._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-heading-sm font-poppins text-primary-500">{v.startTime}</p>
                  <p className="text-caption text-neutral-400">{v.endTime}</p>
                </div>
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">
                    {v.clientId?.firstName} {v.clientId?.lastName}
                  </p>
                  <p className="text-caption text-neutral-500 mt-0.5">
                    {v.clientId?.address?.area || 'Doha'} &middot; <span className="capitalize">{(v.serviceType || '').replace('-', ' ')}</span>
                  </p>
                  {v.notes && <p className="text-caption text-neutral-400 mt-1">Note: {v.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={v.status} />
                {v.status === 'scheduled' && (
                  <Link href="/employee/checkin" className="btn-primary btn-sm py-1 px-3 text-xs">Check In</Link>
                )}
                {v.status === 'completed' && (
                  <Link href={`/employee/care-notes/new?scheduleId=${v._id}&clientId=${v.clientId?._id}`}
                    className="btn-outline btn-sm py-1 px-3 text-xs">Add Note</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
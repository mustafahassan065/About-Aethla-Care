'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const today = new Date().toISOString().split('T')[0]

  // Step 1: Get caregiver record linked to this user
  const { data: cgData } = useQuery({
    queryKey: ['my-caregiver-record', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
    retry: 1,
  })

  // Step 2: Get today's schedules for THIS caregiver only
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['my-schedules-today', cgData?._id, today],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cgData._id}&date=${today}&limit=20`)
      .then(r => r.data),
    enabled: !!cgData?._id,
  })

  const checkInMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/schedules/${id}/checkin`, { location: { lat: 0, lng: 0 } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-schedules-today'] }); toast.success('Checked in') },
    onError: () => toast.error('Check-in failed'),
  })

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/schedules/${id}/checkout`, { location: { lat: 0, lng: 0 } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-schedules-today'] }); toast.success('Checked out') },
    onError: () => toast.error('Check-out failed'),
  })

  const visits = scheduleData?.data || []
  const completed  = visits.filter((v: any) => v.status === 'completed').length
  const inProgress = visits.filter((v: any) => v.status === 'in-progress').length
  const upcoming   = visits.filter((v: any) => v.status === 'scheduled').length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">
          {greeting}, {user?.firstName}
        </h1>
        <p className="text-body-sm text-neutral-400 mt-1">
          {new Date().toLocaleDateString('en-QA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Visits",  value: visits.length, color: '#1B6B8A' },
          { label: 'Completed',       value: completed,     color: '#2DA88A' },
          { label: 'In Progress',     value: inProgress,    color: '#F59E0B' },
          { label: 'Upcoming',        value: upcoming,      color: '#94A3B8' },
        ].map(s => (
          <div key={s.label} className="card p-5" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-heading-md font-poppins">Today's Schedule</h3>
          <Link href="/employee/schedule" className="text-body-sm text-primary-500 hover:underline">View All</Link>
        </div>

        {!cgData ? (
          <div className="p-10 text-center">
            <p className="text-body-md text-neutral-400">Setting up your profile...</p>
            <p className="text-body-sm text-neutral-400 mt-2">Contact admin if this persists.</p>
          </div>
        ) : isLoading ? (
          <div className="p-5 space-y-3">
            {[1,2].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : visits.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-body-md text-neutral-400">No visits scheduled for today.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {visits.map((visit: any) => (
              <div key={visit._id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[56px]">
                    <p className="text-heading-sm font-poppins text-primary-500">{visit.startTime}</p>
                    <p className="text-caption text-neutral-400">{visit.endTime}</p>
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">
                      {visit.clientId?.firstName} {visit.clientId?.lastName}
                    </p>
                    <p className="text-caption text-neutral-500 capitalize">
                      {(visit.serviceType || '').replace('-', ' ')}
                    </p>
                    {visit.checkInTime && (
                      <p className="text-caption text-green-600">
                        In: {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                    visit.status === 'completed'    ? 'bg-green-50 text-green-600'  :
                    visit.status === 'in-progress'  ? 'bg-amber-50 text-amber-600'  :
                    visit.status === 'scheduled'    ? 'bg-blue-50 text-blue-600'    :
                    visit.status === 'missed'       ? 'bg-red-50 text-red-500'      :
                    'bg-neutral-100 text-neutral-500'
                  }`}>{visit.status}</span>

                  {visit.status === 'scheduled' && (
                    <button onClick={() => checkInMutation.mutate(visit._id)}
                      disabled={checkInMutation.isPending}
                      className="btn-primary btn-sm py-1 px-3 text-xs">Check In</button>
                  )}
                  {visit.status === 'in-progress' && (
                    <button onClick={() => checkOutMutation.mutate(visit._id)}
                      disabled={checkOutMutation.isPending}
                      className="btn-outline btn-sm py-1 px-3 text-xs">Check Out</button>
                  )}
                  {visit.status === 'completed' && (
                    <Link href={`/employee/care-notes?clientId=${visit.clientId?._id}&scheduleId=${visit._id}`}
                      className="btn-outline btn-sm py-1 px-3 text-xs">Add Note</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-heading-md font-poppins mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: '/employee/checkin',    label: 'GPS Check In/Out'    },
            { href: '/employee/schedule',   label: 'My Full Schedule'    },
            { href: '/employee/care-notes', label: 'Submit Care Note'    },
            { href: '/employee/clients',    label: 'My Clients'          },
            { href: '/employee/incidents',  label: 'Report an Incident'  },
           
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center justify-center p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center">
              <span className="text-body-sm font-semibold text-neutral-600">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
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

  // Today's schedules for this caregiver
  const { data: schedules, isLoading: schedLoading } = useQuery({
    queryKey: ['employee', 'schedules', today],
    queryFn: async () => {
      // Get caregiver record for current user
      const cgRes = await apiClient.get(`/caregivers?userId=${user?._id}&limit=1`)
      const cg = cgRes.data?.data?.[0]
      if (!cg) return { data: [] }
      const res = await apiClient.get(`/schedules?caregiverId=${cg._id}&date=${today}&limit=20`)
      return res.data
    },
    enabled: !!user,
    retry: 1,
  })

  const checkInMutation = useMutation({
    mutationFn: (scheduleId: string) => apiClient.post(`/schedules/${scheduleId}/checkin`, { location: { lat: 0, lng: 0 } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee', 'schedules'] }); toast.success('Checked in successfully') },
    onError: () => toast.error('Check-in failed'),
  })

  const checkOutMutation = useMutation({
    mutationFn: (scheduleId: string) => apiClient.post(`/schedules/${scheduleId}/checkout`, { location: { lat: 0, lng: 0 } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee', 'schedules'] }); toast.success('Checked out successfully') },
    onError: () => toast.error('Check-out failed'),
  })

  const todayVisits = schedules?.data || []
  const completed = todayVisits.filter((s: any) => s.status === 'completed').length
  const upcoming  = todayVisits.filter((s: any) => s.status === 'scheduled').length
  const inProgress = todayVisits.filter((s: any) => s.status === 'in-progress').length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.firstName}
        </h1>
        <p className="text-body-sm text-neutral-400 mt-1">
          {new Date().toLocaleDateString('en-QA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Visits",   value: todayVisits.length, color: '#1B6B8A' },
          { label: 'Completed',        value: completed,          color: '#2DA88A' },
          { label: 'In Progress',      value: inProgress,         color: '#F59E0B' },
          { label: 'Upcoming',         value: upcoming,           color: '#94A3B8' },
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
          <h3 className="text-heading-md font-poppins">Today&apos;s Schedule</h3>
          <Link href="/employee/schedule" className="text-body-sm text-primary-500 hover:underline">View All</Link>
        </div>

        {schedLoading ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : todayVisits.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-body-md text-neutral-400">No visits scheduled for today.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {todayVisits.map((visit: any) => (
              <div key={visit._id} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-heading-sm font-poppins text-primary-500">{visit.startTime}</p>
                      <p className="text-caption text-neutral-400">{visit.endTime}</p>
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-800">
                        {visit.clientId?.firstName} {visit.clientId?.lastName}
                      </p>
                      <p className="text-caption text-neutral-500 capitalize">
                        {(visit.serviceType || '').replace('-', ' ')} &middot; {visit.clientId?.address?.area || 'Doha'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                      visit.status === 'completed'   ? 'bg-green-50 text-green-600' :
                      visit.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                      visit.status === 'scheduled'   ? 'bg-blue-50 text-blue-600' :
                      visit.status === 'missed'      ? 'bg-red-50 text-red-500' :
                      'bg-neutral-100 text-neutral-500'
                    }`}>{visit.status}</span>

                    {visit.status === 'scheduled' && (
                      <button
                        onClick={() => checkInMutation.mutate(visit._id)}
                        disabled={checkInMutation.isPending}
                        className="btn-primary btn-sm py-1 px-3 text-xs"
                      >Check In</button>
                    )}
                    {visit.status === 'in-progress' && (
                      <button
                        onClick={() => checkOutMutation.mutate(visit._id)}
                        disabled={checkOutMutation.isPending}
                        className="btn-outline btn-sm py-1 px-3 text-xs"
                      >Check Out</button>
                    )}
                    {visit.status === 'completed' && (
                      <Link href={`/employee/care-notes/new?scheduleId=${visit._id}&clientId=${visit.clientId?._id}`}
                        className="btn-outline btn-sm py-1 px-3 text-xs">
                        Add Note
                      </Link>
                    )}
                  </div>
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
            { href: '/employee/care-notes/new', label: 'Submit Care Note' },
            { href: '/employee/incidents/new',  label: 'Report Incident'  },
            { href: '/employee/schedule',       label: 'View Full Schedule' },
            { href: '/employee/clients',        label: 'My Clients'       },
            { href: '/employee/profile',        label: 'Update Profile'   },
            { href: '/employee/checkin',        label: 'GPS Check-In'     },
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
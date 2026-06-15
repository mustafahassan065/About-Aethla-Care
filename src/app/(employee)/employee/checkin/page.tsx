'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import toast from 'react-hot-toast'
import { PageHeader } from '@/components/ui/index'

export default function EmployeeCheckin() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const today = new Date().toISOString().split('T')[0]
  const [locating, setLocating] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['employee', 'checkin', today],
    queryFn: async () => {
      const cgRes = await apiClient.get(`/caregivers?userId=${user?._id}&limit=1`)
      const cg = cgRes.data?.data?.[0]
      if (!cg) return { data: [] }
      const res = await apiClient.get(`/schedules?caregiverId=${cg._id}&date=${today}&limit=20`)
      return res.data
    },
    enabled: !!user,
  })

  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject('Geolocation not supported'); return }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 0, lng: 0 }) // fallback
      )
    })

  const checkInMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      setLocating(true)
      const location = await getLocation()
      setLocating(false)
      return apiClient.post(`/schedules/${scheduleId}/checkin`, { location })
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee', 'checkin'] }); toast.success('Checked in — visit started') },
    onError: () => { setLocating(false); toast.error('Check-in failed') },
  })

  const checkOutMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      setLocating(true)
      const location = await getLocation()
      setLocating(false)
      return apiClient.post(`/schedules/${scheduleId}/checkout`, { location })
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee', 'checkin'] }); toast.success('Checked out — visit completed') },
    onError: () => { setLocating(false); toast.error('Check-out failed') },
  })

  const visits = data?.data || []

  return (
    <div>
      <PageHeader title="GPS Check In / Out" subtitle="Log your arrival and departure for each visit" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : visits.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No visits scheduled for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit: any) => (
            <div key={visit._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption font-semibold capitalize ${
                      visit.status === 'completed'   ? 'bg-green-50 text-green-600' :
                      visit.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                      visit.status === 'scheduled'   ? 'bg-blue-50 text-blue-600' :
                      'bg-neutral-100 text-neutral-500'
                    }`}>{visit.status}</span>
                    <span className="text-body-sm font-mono text-neutral-500">{visit.startTime} – {visit.endTime}</span>
                  </div>
                  <h3 className="text-heading-md font-poppins text-neutral-800">
                    {visit.clientId?.firstName} {visit.clientId?.lastName}
                  </h3>
                  <p className="text-body-sm text-neutral-500 mt-0.5">
                    {visit.clientId?.address?.area || 'Doha'}, Qatar &middot; {(visit.serviceType || '').replace('-', ' ')}
                  </p>
                  {visit.checkInTime && (
                    <p className="text-caption text-green-600 mt-1">
                      Checked in: {new Date(visit.checkInTime).toLocaleTimeString()}
                    </p>
                  )}
                  {visit.checkOutTime && (
                    <p className="text-caption text-blue-600 mt-0.5">
                      Checked out: {new Date(visit.checkOutTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {visit.status === 'scheduled' && (
                    <button
                      onClick={() => checkInMutation.mutate(visit._id)}
                      disabled={checkInMutation.isPending || locating}
                      className="btn-primary btn-sm"
                    >
                      {locating ? 'Getting location...' : 'Check In'}
                    </button>
                  )}
                  {visit.status === 'in-progress' && (
                    <button
                      onClick={() => checkOutMutation.mutate(visit._id)}
                      disabled={checkOutMutation.isPending || locating}
                      className="btn-outline btn-sm"
                    >
                      {locating ? 'Getting location...' : 'Check Out'}
                    </button>
                  )}
                  {visit.status === 'completed' && (
                    <span className="text-body-sm font-semibold text-green-600">Visit Complete</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
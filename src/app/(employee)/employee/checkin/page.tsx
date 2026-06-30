'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { MapPin, Clock, CheckCircle, LogOut } from 'lucide-react'

export default function CheckInPage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState('')

  const { data: cg } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['checkin-visits', cg?._id],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cg._id}&limit=20`).then(r => r.data),
    enabled: !!cg?._id,
    refetchInterval: 30000,
  })

  const checkInMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/schedules/${id}/check-in`, {}).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkin-visits'] })
      toast.success('Checked in successfully!')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Check-in failed'),
  })

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/schedules/${id}/check-out`, {}).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkin-visits'] })
      toast.success('Checked out — shift completed!')
      setSelectedId('')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Check-out failed'),
  })

  // Show today + recent visits
  const visits = (data?.data || []).filter((v: any) =>
    ['scheduled', 'in-progress'].includes(v.status)
  )

  const selected = visits.find((v: any) => v._id === selectedId)
  const now = new Date()

  return (
    <div>
      <PageHeader title="Check In / Out" subtitle="Record your arrival and departure for each visit" />

      {/* Current Time */}
      <div className="card p-5 mb-5 flex items-center gap-4" style={{ borderLeft: '4px solid #1B6B8A' }}>
        <Clock size={22} className="text-primary-500 flex-shrink-0" />
        <div>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-caption text-neutral-400">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Visit List */}
      <div className="card p-6 mb-5">
        <h3 className="text-heading-md font-poppins mb-4">Select Visit</h3>

        {isLoading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : visits.length === 0 ? (
          <p className="text-body-sm text-neutral-400">No active visits found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {visits.map((v: any) => (
              <label key={v._id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedId === v._id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-100 hover:border-neutral-200'
                }`}>
                <input
                  type="radio"
                  name="visit"
                  value={v._id}
                  checked={selectedId === v._id}
                  onChange={() => setSelectedId(v._id)}
                  className="accent-primary-500"
                />
                <div className="flex-1">
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">
                    {v.clientId?.firstName} {v.clientId?.lastName}
                  </p>
                  <p className="text-caption text-neutral-400">{v.date} · {v.startTime} – {v.endTime}</p>
                  {v.checkInTime && (
                    <p className="text-caption text-green-600 mt-0.5">
                      ✓ Checked in: {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <StatusBadge status={v.status} />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons — show based on visit state */}
      {selected && (
        <div className="grid grid-cols-2 gap-4">
          {!selected.checkInTime && (
            <button
              onClick={() => checkInMutation.mutate(selected._id)}
              disabled={checkInMutation.isPending}
              className="col-span-2 btn-primary btn-lg flex items-center justify-center gap-2"
            >
              <MapPin size={18} />
              {checkInMutation.isPending ? 'Checking In...' : 'Check In'}
            </button>
          )}

          {selected.checkInTime && !selected.checkOutTime && (
            <>
              <div className="card p-4 flex items-center gap-3" style={{ borderLeft: '4px solid #2DA88A' }}>
                <CheckCircle size={18} className="text-accent-500 flex-shrink-0" />
                <div>
                  <p className="text-caption text-neutral-400">Checked In</p>
                  <p className="text-body-sm font-semibold text-neutral-800">
                    {new Date(selected.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => checkOutMutation.mutate(selected._id)}
                disabled={checkOutMutation.isPending}
                className="btn-primary btn-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96B)' }}
              >
                <LogOut size={18} />
                {checkOutMutation.isPending ? 'Checking Out...' : 'Check Out'}
              </button>
            </>
          )}

          {selected.checkInTime && selected.checkOutTime && (
            <div className="col-span-2 card p-4 text-center" style={{ borderLeft: '4px solid #2DA88A' }}>
              <p className="text-body-sm font-semibold text-green-600">✓ Shift Completed</p>
              <p className="text-caption text-neutral-400 mt-1">
                {new Date(selected.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                {new Date(selected.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="card p-4 mt-5">
        <p className="text-body-sm text-neutral-500">
          Select a visit then tap Check In when you arrive. Check Out will appear after checking in. Your coordinator will see your status in real time.
        </p>
      </div>
    </div>
  )
}
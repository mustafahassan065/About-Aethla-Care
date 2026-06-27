'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { MapPin, Clock, CheckCircle } from 'lucide-react'

export default function CheckInPage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState('')

  const { data: cg } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  const { data: schedules } = useQuery({
    queryKey: ['checkin-schedules', cg?._id],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cg._id}&status=scheduled&limit=10`).then(r => r.data),
    enabled: !!cg?._id,
  })

  const scheduledVisits = schedules?.data || []

  const handleCheckIn = async () => {
    if (!selectedScheduleId) { toast.error('Please select a visit first'); return }
    setLoading(true)
    try {
      const now = new Date().toISOString()
      await apiClient.patch(`/schedules/${selectedScheduleId}`, {
        checkInTime: now,
        status: 'in-progress',
      })
      qc.invalidateQueries({ queryKey: ['checkin-schedules'] })
      toast.success('Checked in successfully!')
      setSelectedScheduleId('')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Check-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!selectedScheduleId) { toast.error('Please select a visit first'); return }
    setLoading(true)
    try {
      const now = new Date().toISOString()
      await apiClient.patch(`/schedules/${selectedScheduleId}`, {
        checkOutTime: now,
        status: 'completed',
      })
      qc.invalidateQueries({ queryKey: ['checkin-schedules'] })
      toast.success('Checked out successfully!')
      setSelectedScheduleId('')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Check-out failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const now = new Date()

  return (
    <div>
      <PageHeader title="Check In / Out" subtitle="Record your arrival and departure for each visit" />

      {/* Current Time */}
      <div className="card p-6 mb-6 text-center" style={{ borderLeft: '4px solid #1B6B8A' }}>
        <div className="flex items-center justify-center gap-3 mb-1">
          <Clock size={20} className="text-primary-500" />
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <p className="text-body-sm text-neutral-400">{now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Select Visit */}
      <div className="card p-6 mb-5">
        <h3 className="text-heading-md font-poppins mb-4">Select Today&apos;s Visit</h3>
        {scheduledVisits.length === 0 ? (
          <p className="text-body-sm text-neutral-400">No scheduled visits found for today.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {scheduledVisits.map((v: any) => (
              <label key={v._id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedScheduleId === v._id ? 'border-primary-500 bg-primary-50' : 'border-neutral-100 hover:border-neutral-200'
                }`}>
                <input type="radio" name="schedule" value={v._id}
                  checked={selectedScheduleId === v._id}
                  onChange={() => setSelectedScheduleId(v._id)}
                  className="accent-primary-500" />
                <div className="flex-1">
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">
                    {v.clientId?.firstName} {v.clientId?.lastName}
                  </p>
                  <p className="text-caption text-neutral-400">{v.date} · {v.startTime} – {v.endTime}</p>
                  {v.checkInTime && (
                    <p className="text-caption text-green-600 mt-0.5">
                      Checked in: {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                {v.checkInTime && !v.checkOutTime && (
                  <span className="px-2 py-1 rounded-full text-caption font-semibold bg-green-50 text-green-600">In Progress</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Check In / Out Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleCheckIn}
          disabled={loading || !selectedScheduleId}
          className="btn-primary btn-lg flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}
        >
          <MapPin size={18} />
          {loading ? 'Processing...' : 'Check In'}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={loading || !selectedScheduleId}
          className="btn-outline btn-lg flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} />
          {loading ? 'Processing...' : 'Check Out'}
        </button>
      </div>

      <div className="card p-4 mt-5">
        <p className="text-body-sm text-neutral-500">
          Select the visit above then tap Check In when you arrive, and Check Out when you leave. Your coordinator will be notified automatically.
        </p>
      </div>
    </div>
  )
}
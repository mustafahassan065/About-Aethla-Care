'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 6am - 10pm
const DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(baseDate: Date) {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function SchedulingPage() {
  const qc = useQueryClient()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [baseDate, setBaseDate] = useState(new Date())
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const weekDates = getWeekDates(baseDate)
  const weekStart = weekDates[0].toISOString().split('T')[0]
  const weekEnd   = weekDates[6].toISOString().split('T')[0]

  const { data, isLoading } = useQuery({
    queryKey: ['schedules', view, filterDate, filterStatus, weekStart],
    queryFn: () => apiClient.get('/schedules', {
      params: view === 'calendar'
        ? { startDate: weekStart, endDate: weekEnd, limit: 200 }
        : { date: filterDate, ...(filterStatus ? { status: filterStatus } : {}), limit: 50 }
    }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => apiClient.patch(`/schedules/${id}`, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); toast.success('Updated'); setSelected(null) },
    onError: () => toast.error('Failed to update'),
  })

  const schedules = data?.data || []

  // Group schedules by date for calendar
  const byDate: Record<string, any[]> = {}
  schedules.forEach((s: any) => {
    if (!byDate[s.date]) byDate[s.date] = []
    byDate[s.date].push(s)
  })

  const statusColor: Record<string, string> = {
    scheduled:   'bg-blue-100 text-blue-700',
    confirmed:   'bg-indigo-100 text-indigo-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed:   'bg-green-100 text-green-700',
    missed:      'bg-red-100 text-red-600',
    cancelled:   'bg-neutral-100 text-neutral-500',
  }

  return (
    <div>
      <PageHeader
        title="Scheduling"
        subtitle={`${data?.total ?? 0} visits`}
        action={
          <Link href="/admin/scheduling/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> New Schedule
          </Link>
        }
      />

      {/* View Toggle */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
          {(['list', 'calendar'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 text-body-sm font-semibold capitalize transition-all ${
                view === v ? 'bg-primary-500 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',       value: schedules.length,                                             color: '#1B6B8A' },
          { label: 'Completed',   value: schedules.filter((s: any) => s.status === 'completed').length, color: '#2DA88A' },
          { label: 'In Progress', value: schedules.filter((s: any) => s.status === 'in-progress').length, color: '#F59E0B' },
          { label: 'Missed',      value: schedules.filter((s: any) => s.status === 'missed').length,   color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <>
          <div className="card p-4 mb-5 flex flex-wrap gap-3 items-end">
            <div>
              <label className="form-label">Date</label>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input">
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          ) : schedules.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-body-md text-neutral-400">No visits for this date.</p>
              <Link href="/admin/scheduling/new" className="btn-primary btn-sm mt-4 inline-block">Schedule a Visit</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((s: any) => (
                <div key={s._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-heading-sm font-poppins text-primary-500">{s.startTime}</p>
                      <p className="text-caption text-neutral-400">{s.endTime}</p>
                    </div>
                    <div>
                      <p className="text-body-sm font-bold font-poppins text-neutral-800">{s.clientId?.firstName} {s.clientId?.lastName}</p>
                      <p className="text-caption text-neutral-500">
                        {s.caregiverId?.userId?.firstName} {s.caregiverId?.userId?.lastName}
                        &nbsp;&middot;&nbsp;<span className="capitalize">{(s.serviceType || '').replace('-', ' ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />
                    <button onClick={() => setSelected(s)} className="btn-outline btn-sm py-1 px-3 text-xs">Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <div className="card overflow-hidden">
          {/* Week Nav */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <button onClick={() => { const d = new Date(baseDate); d.setDate(d.getDate() - 7); setBaseDate(d) }}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"><ChevronLeft size={18} /></button>
            <p className="text-body-sm font-semibold text-neutral-700">
              {weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} —{' '}
              {weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <button onClick={() => { const d = new Date(baseDate); d.setDate(d.getDate() + 7); setBaseDate(d) }}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"><ChevronRight size={18} /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-16 px-3 py-3 text-caption text-neutral-400 text-right border-r border-neutral-100">Time</th>
                  {weekDates.map((d, i) => {
                    const isToday = d.toDateString() === new Date().toDateString()
                    return (
                      <th key={i} className="px-2 py-3 text-caption font-semibold text-center border-r border-neutral-100 last:border-0">
                        <span className={`block text-caption text-neutral-400`}>{DAYS[i]}</span>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-body-sm font-bold mt-0.5 ${
                          isToday ? 'bg-primary-500 text-white' : 'text-neutral-700'
                        }`}>{d.getDate()}</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {HOURS.map(hour => (
                  <tr key={hour} className="border-t border-neutral-50">
                    <td className="px-3 py-2 text-caption text-neutral-400 text-right border-r border-neutral-100 align-top">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    {weekDates.map((d, i) => {
                      const dateStr = d.toISOString().split('T')[0]
                      const daySchedules = (byDate[dateStr] || []).filter((s: any) => {
                        const h = parseInt(s.startTime?.split(':')[0] || '0')
                        return h === hour
                      })
                      return (
                        <td key={i} className="px-1 py-1 border-r border-neutral-50 last:border-0 align-top min-h-[48px]">
                          {daySchedules.map((s: any) => (
                            <div
                              key={s._id}
                              onClick={() => setSelected(s)}
                              className={`mb-1 px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer truncate ${statusColor[s.status] || 'bg-neutral-100 text-neutral-600'}`}
                            >
                              {s.clientId?.firstName} {s.clientId?.lastName?.[0]}.
                            </div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Schedule Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Client',    `${selected.clientId?.firstName || '—'} ${selected.clientId?.lastName || ''}`],
                  ['Caregiver', `${selected.caregiverId?.userId?.firstName || '—'} ${selected.caregiverId?.userId?.lastName || ''}`],
                  ['Date',      selected.date],
                  ['Time',      `${selected.startTime} – ${selected.endTime}`],
                  ['Service',   (selected.serviceType || '—').replace('-', ' ')],
                  ['Notes',     selected.notes || 'None'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize text-right max-w-[60%]">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['scheduled', 'confirmed', 'in-progress', 'completed', 'missed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateMutation.mutate({ id: selected._id, dto: { status: s } })}
                      disabled={selected.status === s || updateMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
              <Link href={`/admin/care-notes/new?scheduleId=${selected._id}&clientId=${selected.clientId?._id}`}
                className="btn-outline w-full text-center block py-2.5">
                Add Care Note for This Visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
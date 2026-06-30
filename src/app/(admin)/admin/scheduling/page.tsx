'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { X, Plus, Clock, CheckCircle, LogOut } from 'lucide-react'

type View = 'list' | 'calendar'

export default function SchedulingPage() {
  const qc = useQueryClient()
  const [view, setView]         = useState<View>('list')
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate]     = useState('')
  const [page, setPage]                 = useState(1)
  const [selected, setSelected]         = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['schedules-admin', filterStatus, filterDate, page],
    queryFn: () => apiClient.get('/schedules', {
      params: {
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(filterDate   ? { date: filterDate }     : {}),
        page, limit: 20,
      }
    }).then(r => r.data),
  })

  // All clients — no limit restriction
  const { data: clientsData } = useQuery({
    queryKey: ['all-clients-scheduling'],
    queryFn: () => apiClient.get('/clients?limit=500&status=active').then(r => r.data),
    enabled: showForm,
  })

  const { data: caregiversData } = useQuery({
    queryKey: ['all-caregivers-scheduling'],
    queryFn: () => apiClient.get('/caregivers?limit=200&status=active').then(r => r.data),
    enabled: showForm,
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      clientId: '', caregiverId: '', date: '', startTime: '',
      endTime: '', serviceType: '', notes: '',
    }
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/schedules', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedules-admin'] })
      toast.success('Schedule created')
      setShowForm(false); reset()
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) =>
      apiClient.patch(`/schedules/${id}`, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedules-admin'] })
      toast.success('Schedule updated')
      setSelected(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const schedules = data?.data || []

  const statusColor: Record<string, string> = {
    scheduled:   'bg-blue-50 text-blue-600',
    'in-progress':'bg-amber-50 text-amber-600',
    completed:   'bg-green-50 text-green-600',
    cancelled:   'bg-red-50 text-red-600',
    missed:      'bg-neutral-100 text-neutral-500',
  }

  return (
    <div>
      <PageHeader
        title="Scheduling"
        subtitle={`${data?.total ?? 0} total schedules`}
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> New Schedule
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }} className="form-input w-auto">
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="missed">Missed</option>
        </select>
        <input type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1) }} className="form-input w-auto" />
        {(filterStatus || filterDate) && (
          <button onClick={() => { setFilterStatus(''); setFilterDate(''); setPage(1) }} className="text-body-sm text-neutral-400 hover:text-neutral-600">Clear</button>
        )}
      </div>

      {/* Schedule List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : schedules.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No schedules found.</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-neutral-50">
            {schedules.map((s: any) => (
              <div key={s._id} className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <p className="text-body-sm font-bold font-poppins text-primary-500">{s.startTime}</p>
                    <p className="text-caption text-neutral-400">{s.date}</p>
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">
                      {s.clientId?.firstName} {s.clientId?.lastName}
                    </p>
                    <p className="text-caption text-neutral-400 capitalize">
                      {(s.serviceType || '').replace('-', ' ')} ·{' '}
                      {s.caregiverId?.userId?.firstName} {s.caregiverId?.userId?.lastName}
                    </p>
                    {/* Checkin/Checkout times */}
                    {s.checkInTime && (
                      <p className="text-caption text-green-600 mt-0.5 flex items-center gap-1">
                        <CheckCircle size={11} />
                        In: {new Date(s.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {s.checkOutTime && (
                          <span className="ml-2 flex items-center gap-1">
                            <LogOut size={11} />
                            Out: {new Date(s.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${statusColor[s.status] || 'bg-neutral-100 text-neutral-500'}`}>
                    {s.status === 'in-progress' ? 'Active Now' : s.status}
                  </span>
                  <button onClick={() => setSelected(s)} className="btn-outline btn-sm py-1 px-3 text-xs">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-5">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-outline btn-sm">← Prev</button>
          <span className="text-body-sm text-neutral-500 py-2">Page {page} of {data.totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page === data.totalPages} className="btn-outline btn-sm">Next →</button>
        </div>
      )}

      {/* Create Schedule Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); reset() }} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">New Schedule</h3>
              <button onClick={() => { setShowForm(false); reset() }} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(dto => createMutation.mutate(dto))} className="p-6 space-y-4">
              <div>
                <label className="form-label">Client <span className="text-red-500">*</span></label>
                <select {...register('clientId', { required: true })} className="form-input">
                  <option value="">Select client...</option>
                  {(clientsData?.data || []).map((c: any) => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
                <p className="text-caption text-neutral-400 mt-1">{clientsData?.total || 0} clients available</p>
              </div>
              <div>
                <label className="form-label">Caregiver <span className="text-red-500">*</span></label>
                <select {...register('caregiverId', { required: true })} className="form-input">
                  <option value="">Select caregiver...</option>
                  {(caregiversData?.data || []).map((cg: any) => (
                    <option key={cg._id} value={cg._id}>
                      {cg.userId?.firstName} {cg.userId?.lastName} — {cg.specializations?.[0] || ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Service Type</label>
                <select {...register('serviceType')} className="form-input">
                  <option value="">Select service...</option>
                  <option value="elderly-care">Elderly Care</option>
                  <option value="newborn-care">Newborn Care</option>
                  <option value="maternity-care">Maternity Care</option>
                  <option value="disability-support">Disability Support</option>
                  <option value="home-wellness">Home Wellness</option>
                  <option value="telehealth">Telehealth</option>
                  <option value="patient-navigation">Patient Navigation</option>
                  <option value="lifestyle-wellness">Lifestyle Wellness</option>
                </select>
              </div>
              <div>
                <label className="form-label">Date <span className="text-red-500">*</span></label>
                <input {...register('date', { required: true })} type="date" className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Time <span className="text-red-500">*</span></label>
                  <input {...register('startTime', { required: true })} type="time" className="form-input" />
                </div>
                <div>
                  <label className="form-label">End Time <span className="text-red-500">*</span></label>
                  <input {...register('endTime', { required: true })} type="time" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Notes</label>
                <textarea {...register('notes')} className="form-input min-h-[60px] resize-y" placeholder="Special instructions..." />
              </div>
              <button type="submit" disabled={isSubmitting || createMutation.isPending} className="btn-primary btn-lg w-full">
                {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Schedule Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Client',    `${selected.clientId?.firstName} ${selected.clientId?.lastName}`],
                  ['Caregiver', `${selected.caregiverId?.userId?.firstName} ${selected.caregiverId?.userId?.lastName}`],
                  ['Date',      selected.date],
                  ['Time',      `${selected.startTime} – ${selected.endTime}`],
                  ['Service',   (selected.serviceType || '').replace('-', ' ')],
                  ['Status',    selected.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize text-right">{v}</dd>
                  </div>
                ))}

                {/* Checkin/Checkout info */}
                {selected.checkInTime && (
                  <div className="flex justify-between py-2 border-b border-neutral-50">
                    <dt className="text-body-sm text-neutral-400">Check In</dt>
                    <dd className="text-body-sm font-semibold text-green-600">
                      {new Date(selected.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </dd>
                  </div>
                )}
                {selected.checkOutTime && (
                  <div className="flex justify-between py-2 border-b border-neutral-50">
                    <dt className="text-body-sm text-neutral-400">Check Out</dt>
                    <dd className="text-body-sm font-semibold text-green-600">
                      {new Date(selected.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </dd>
                  </div>
                )}
                {selected.checkInTime && selected.checkOutTime && (
                  <div className="flex justify-between py-2">
                    <dt className="text-body-sm text-neutral-400">Duration</dt>
                    <dd className="text-body-sm font-semibold text-primary-500">
                      {Math.round((new Date(selected.checkOutTime).getTime() - new Date(selected.checkInTime).getTime()) / 60000)} mins
                    </dd>
                  </div>
                )}
              </dl>

              {/* Status Update */}
              <div>
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['scheduled', 'completed', 'cancelled', 'missed'].map(s => (
                    <button key={s} onClick={() => updateMutation.mutate({ id: selected._id, dto: { status: s } })}
                      disabled={selected.status === s || updateMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
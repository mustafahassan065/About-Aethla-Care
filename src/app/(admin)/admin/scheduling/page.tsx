'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'

export default function SchedulingPage() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['schedules', date, status],
    queryFn: () => apiClient.get('/schedules', {
      params: {
        ...(date ? { date } : {}),
        ...(status ? { status } : {}),
        limit: 50,
      }
    }).then(r => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/schedules/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Status updated!')
      setSelected(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const schedules = data?.data || []
  const byStatus = (s: string) => schedules.filter((d: any) => d.status === s).length

  // Caregiver name helper
  const caregiverName = (row: any) => {
    const cg = row.caregiverId
    if (!cg) return '—'
    const user = cg.userId
    if (!user) return '—'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'
  }

  const clientName = (row: any) => {
    const cl = row.clientId
    if (!cl) return '—'
    return `${cl.firstName || ''} ${cl.lastName || ''}`.trim() || '—'
  }

  return (
    <div>
      <PageHeader
        title="Scheduling"
        subtitle={`${schedules.length} visits on ${date}`}
        action={
          <Link href="/admin/scheduling/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> New Schedule
          </Link>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',       value: schedules.length,        color: '#1B6B8A' },
          { label: 'Completed',   value: byStatus('completed'),   color: '#2DA88A' },
          { label: 'In Progress', value: byStatus('in-progress'), color: '#C9A84C' },
          { label: 'Scheduled',   value: byStatus('scheduled'),   color: '#94A3B8' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <div className="text-caption text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div>
          <label className="form-label">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="form-input">
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

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Caregiver</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="skeleton h-4 rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-neutral-400">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-body-sm">No visits for this date. Click &quot;+ New Schedule&quot; to add one.</p>
                  </td>
                </tr>
              ) : schedules.map((row: any) => (
                <tr key={row._id}>
                  <td>
                    <span className="font-mono text-xs font-semibold text-primary-500">
                      {row.startTime} – {row.endTime}
                    </span>
                  </td>
                  <td>
                    <span className="text-body-sm font-semibold text-neutral-800">
                      {clientName(row)}
                    </span>
                  </td>
                  <td>
                    <span className="text-body-sm text-neutral-600">
                      {caregiverName(row)}
                    </span>
                  </td>
                  <td>
                    <span className="badge-primary capitalize">
                      {(row.serviceType || '—').replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => setSelected(row)}
                      className="btn-outline btn-sm py-1 px-3 text-xs"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins text-neutral-800">Schedule Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Client',    clientName(selected)],
                  ['Caregiver', caregiverName(selected)],
                  ['Date',      selected.date],
                  ['Time',      `${selected.startTime} – ${selected.endTime}`],
                  ['Service',   (selected.serviceType || '—').replace('-', ' ')],
                  ['Status',    selected.status],
                  ['Notes',     selected.notes || 'None'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 text-right max-w-[60%] capitalize">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Status Update */}
              <div className="pt-2">
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['scheduled', 'confirmed', 'in-progress', 'completed', 'missed', 'cancelled'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus.mutate({ id: selected._id, status: s })}
                      disabled={selected.status === s || updateStatus.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50'
                      }`}
                    >
                      {s}
                    </button>
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
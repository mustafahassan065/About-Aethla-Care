'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X } from 'lucide-react'

export default function IncidentsPage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('')
  const [severity, setSeverity] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['incidents', status, severity, page],
    queryFn: () => apiClient.get('/incidents', {
      params: {
        ...(status   ? { status }   : {}),
        ...(severity ? { severity } : {}),
        page, limit: 20,
      }
    }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) =>
      apiClient.patch(`/incidents/${id}`, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident updated')
      setSelected(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const incidents = data?.data || []
  const bySeverity = (s: string) => incidents.filter((i: any) => i.severity === s).length

  const severityColor: Record<string, string> = {
    low:      'bg-blue-50 text-blue-600',
    medium:   'bg-amber-50 text-amber-600',
    high:     'bg-orange-50 text-orange-600',
    critical: 'bg-red-50 text-red-600',
  }

  const columns: Column<any>[] = [
    {
      key: 'type', header: 'Type',
      render: (v) => <span className="text-body-sm font-semibold text-neutral-800 capitalize">{String(v).replace('-', ' ')}</span>
    },
    {
      key: 'clientId', header: 'Client',
      render: (_, row) => <span className="text-body-sm text-neutral-700">{row.clientId?.firstName} {row.clientId?.lastName}</span>
    },
    {
      key: 'severity', header: 'Severity',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${severityColor[String(v)] || 'bg-neutral-100 text-neutral-500'}`}>
          {String(v)}
        </span>
      )
    },
    {
      key: 'status', header: 'Status',
      render: (v) => <StatusBadge status={String(v)} />
    },
    {
      key: 'createdAt', header: 'Reported',
      render: (v) => <span className="text-caption text-neutral-500">{new Date(String(v)).toLocaleDateString()}</span>
    },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <button onClick={() => setSelected(row)} className="btn-outline btn-sm py-1 px-3 text-xs">View</button>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Incident Reports"
        subtitle={`${data?.total ?? 0} total incidents`}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Critical', value: bySeverity('critical'), color: '#EF4444' },
          { label: 'High',     value: bySeverity('high'),     color: '#F97316' },
          { label: 'Medium',   value: bySeverity('medium'),   color: '#F59E0B' },
          { label: 'Low',      value: bySeverity('low'),      color: '#1B6B8A' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <p className="text-caption text-neutral-400 mt-1">{s.label} Severity</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="form-input w-auto">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={severity} onChange={e => { setSeverity(e.target.value); setPage(1) }} className="form-input w-auto">
          <option value="">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={incidents}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No incidents reported."
      />

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Incident Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Type',        (selected.type || '').replace('-', ' ')],
                  ['Client',      `${selected.clientId?.firstName || '—'} ${selected.clientId?.lastName || ''}`],
                  ['Reported By', `${selected.reportedBy?.userId?.firstName || '—'}`],
                  ['Severity',    selected.severity],
                  ['Status',      selected.status],
                  ['Date',        new Date(selected.createdAt).toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v}</dd>
                  </div>
                ))}
              </dl>

              {selected.description && (
                <div className="p-4 rounded-xl bg-neutral-50">
                  <p className="text-caption text-neutral-400 mb-1">Description</p>
                  <p className="text-body-sm text-neutral-700 leading-relaxed">{selected.description}</p>
                </div>
              )}

              {selected.actionTaken && (
                <div className="p-4 rounded-xl bg-green-50">
                  <p className="text-caption text-green-600 mb-1">Action Taken</p>
                  <p className="text-body-sm text-neutral-700 leading-relaxed">{selected.actionTaken}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="form-label">Admin Notes</label>
                <textarea
                  defaultValue={selected.adminNotes || ''}
                  id="admin-notes"
                  className="form-input min-h-[80px] resize-y"
                  placeholder="Add investigation notes..."
                />
              </div>

              {/* Update Status */}
              <div>
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['open', 'investigating', 'resolved', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateMutation.mutate({
                        id: selected._id,
                        dto: {
                          status: s,
                          adminNotes: (document.getElementById('admin-notes') as HTMLTextAreaElement)?.value,
                        }
                      })}
                      disabled={selected.status === s || updateMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50'
                      }`}
                    >{s}</button>
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
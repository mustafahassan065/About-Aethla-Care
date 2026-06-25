'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, Plus } from 'lucide-react'

export default function IncidentsPage() {
  const qc = useQueryClient()
  const [status, setStatus]     = useState('')
  const [severity, setSeverity] = useState('')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<any>(null)

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

  const { data: clientsData } = useQuery({
    queryKey: ['clients-dropdown'],
    queryFn: () => apiClient.get('/clients?limit=100&status=active').then(r => r.data),
    enabled: showForm,
  })

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      type: '', severity: 'medium', description: '',
      actionTaken: '', clientId: '', reportedByName: '',
    }
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/incidents', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident report created')
      setShowForm(false); reset()
    },
    onError: () => toast.error('Failed to create incident'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) =>
      apiClient.patch(`/incidents/${id}`, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident updated')
      setSelected(null); setEditing(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const incidents = data?.data || []

  const severityColor: Record<string, string> = {
    low:      'bg-blue-50 text-blue-600',
    medium:   'bg-amber-50 text-amber-600',
    high:     'bg-orange-50 text-orange-600',
    critical: 'bg-red-50 text-red-600',
  }

  const openEdit = (incident: any) => {
    setEditing(incident)
    setSelected(incident)
  }

  const onSubmit = (data: any) => {
    createMutation.mutate(data)
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
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    {
      key: 'createdAt', header: 'Reported',
      render: (v) => <span className="text-caption text-neutral-500">{new Date(String(v)).toLocaleDateString()}</span>
    },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => setSelected(row)} className="btn-outline btn-sm py-1 px-3 text-xs">View</button>
          <button onClick={() => openEdit(row)} className="btn-primary btn-sm py-1 px-3 text-xs">Edit</button>
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Incident Reports"
        subtitle={`${data?.total ?? 0} total incidents`}
        action={
          <button onClick={() => { setShowForm(true); setEditing(null); reset() }}
            className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> Add Incident
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Critical', value: incidents.filter((i: any) => i.severity === 'critical').length, color: '#EF4444' },
          { label: 'High',     value: incidents.filter((i: any) => i.severity === 'high').length,     color: '#F97316' },
          { label: 'Medium',   value: incidents.filter((i: any) => i.severity === 'medium').length,   color: '#F59E0B' },
          { label: 'Low',      value: incidents.filter((i: any) => i.severity === 'low').length,      color: '#1B6B8A' },
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

      {/* Add Incident Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Add Incident Report</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="form-label">Client</label>
                <select {...register('clientId')} className="form-input">
                  <option value="">Select client...</option>
                  {(clientsData?.data || []).map((c: any) => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Incident Type <span className="text-red-500">*</span></label>
                  <select {...register('type', { required: true })} className="form-input">
                    <option value="">Select type...</option>
                    <option value="fall">Fall</option>
                    <option value="medication-error">Medication Error</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="medical-emergency">Medical Emergency</option>
                    <option value="property-damage">Property Damage</option>
                    <option value="safeguarding">Safeguarding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Severity <span className="text-red-500">*</span></label>
                  <select {...register('severity')} className="form-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Reported By</label>
                <input {...register('reportedByName')} className="form-input" placeholder="Name of person reporting" />
              </div>
              <div>
                <label className="form-label">Description <span className="text-red-500">*</span></label>
                <textarea {...register('description', { required: true })} className="form-input min-h-[90px] resize-y"
                  placeholder="Describe what happened, when, and where..." />
              </div>
              <div>
                <label className="form-label">Action Taken</label>
                <textarea {...register('actionTaken')} className="form-input min-h-[70px] resize-y"
                  placeholder="What steps were taken immediately after the incident?" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg flex-1">
                  {isSubmitting ? 'Saving...' : 'Create Incident Report'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Edit Incident Modal */}
      {selected && !showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setSelected(null); setEditing(null) }} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Incident Details</h3>
              <button onClick={() => { setSelected(null); setEditing(null) }}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Type',        (selected.type || '').replace('-', ' ')],
                  ['Client',      `${selected.clientId?.firstName || '—'} ${selected.clientId?.lastName || ''}`],
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

              {/* Edit fields */}
              <div>
                <label className="form-label">Admin Notes</label>
                <textarea
                  defaultValue={selected.adminNotes || ''}
                  id="admin-notes-field"
                  className="form-input min-h-[80px] resize-y"
                  placeholder="Add investigation notes..." />
              </div>

              <div>
                <label className="form-label">Edit Action Taken</label>
                <textarea
                  defaultValue={selected.actionTaken || ''}
                  id="action-taken-field"
                  className="form-input min-h-[70px] resize-y"
                  placeholder="Update actions taken..." />
              </div>

              <div>
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['open', 'investigating', 'resolved', 'closed'].map(s => (
                    <button key={s} onClick={() => updateMutation.mutate({
                      id: selected._id,
                      dto: {
                        status:      s,
                        adminNotes:  (document.getElementById('admin-notes-field') as HTMLTextAreaElement)?.value,
                        actionTaken: (document.getElementById('action-taken-field') as HTMLTextAreaElement)?.value,
                      }
                    })}
                      disabled={selected.status === s || updateMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => updateMutation.mutate({
                  id: selected._id,
                  dto: {
                    adminNotes:  (document.getElementById('admin-notes-field') as HTMLTextAreaElement)?.value,
                    actionTaken: (document.getElementById('action-taken-field') as HTMLTextAreaElement)?.value,
                  }
                })}
                disabled={updateMutation.isPending}
                className="btn-primary w-full py-3"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
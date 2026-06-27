'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

export default function EmployeeIncidents() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: '', severity: 'medium', description: '', actionTaken: '', clientId: '',
  })

  const { data: cg } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['my-incidents', cg?._id],
    queryFn: () => apiClient.get(`/incidents?caregiverId=${cg._id}&limit=30`).then(r => r.data),
    enabled: !!cg?._id,
  })

  const { data: clients } = useQuery({
    queryKey: ['my-clients-inc', cg?._id],
    queryFn: () => apiClient.get(`/clients?caregiverId=${cg._id}&limit=100`).then(r => r.data),
    enabled: !!cg?._id && showForm,
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/incidents', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-incidents'] })
      toast.success('Incident reported successfully')
      setShowForm(false)
      setForm({ type: '', severity: 'medium', description: '', actionTaken: '', clientId: '' })
    },
    onError: () => toast.error('Failed to submit incident'),
  })

  const severityColor: Record<string, string> = {
    low: 'bg-blue-50 text-blue-600', medium: 'bg-amber-50 text-amber-600',
    high: 'bg-orange-50 text-orange-600', critical: 'bg-red-50 text-red-600',
  }

  const incidents = data?.data || []

  return (
    <div>
      <PageHeader
        title="Incidents"
        subtitle="Report and track care incidents"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> Report Incident
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : incidents.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-400 mb-4">No incidents reported.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">+ Report Incident</button>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc: any) => (
            <div key={inc._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800 capitalize">{(inc.type || '').replace('-', ' ')}</p>
                  <p className="text-caption text-neutral-400">{inc.clientId?.firstName} {inc.clientId?.lastName} · {new Date(inc.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${severityColor[inc.severity] || 'bg-neutral-100 text-neutral-500'}`}>
                    {inc.severity}
                  </span>
                  <StatusBadge status={inc.status} />
                </div>
              </div>
              {inc.description && <p className="text-body-sm text-neutral-600 mt-3 leading-relaxed">{inc.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Report Incident Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Report Incident</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Client</label>
                <select className="form-input" onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                  <option value="">Select client...</option>
                  {(clients?.data || []).map((c: any) => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Incident Type <span className="text-red-500">*</span></label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="form-input" required>
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
                  <label className="form-label">Severity</label>
                  <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))} className="form-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="form-input min-h-[90px] resize-y"
                  placeholder="Describe what happened, when, and where..." required />
              </div>
              <div>
                <label className="form-label">Action Taken</label>
                <textarea value={form.actionTaken} onChange={e => setForm(p => ({ ...p, actionTaken: e.target.value }))}
                  className="form-input min-h-[70px] resize-y"
                  placeholder="What steps did you take immediately after?" />
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-caption text-amber-700">This incident will be reported to the admin and care coordinator immediately.</p>
              </div>
              <button
                onClick={() => createMutation.mutate({ ...form, reportedByName: `${user?.firstName} ${user?.lastName}`, caregiverId: cg?._id })}
                disabled={createMutation.isPending || !form.type || !form.description}
                className="btn-primary btn-lg w-full"
              >
                {createMutation.isPending ? 'Submitting...' : 'Submit Incident Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
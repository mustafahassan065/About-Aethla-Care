'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function EmployeeIncidents() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    clientId: '', type: '', severity: 'low', description: '', actionTaken: '',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const { data: cgData } = useQuery({
    queryKey: ['employee', 'cg-record'],
    queryFn: () => apiClient.get(`/caregivers?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const cg = cgData?.data?.[0]

  const { data: schedules } = useQuery({
    queryKey: ['employee', 'schedules-clients'],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cg._id}&limit=100`).then(r => r.data),
    enabled: !!cg?._id,
  })
  const myClients = (schedules?.data || [])
    .map((s: any) => s.clientId)
    .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((x: any) => x?._id === c?._id) === i)

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['employee', 'incidents', cg?._id],
    queryFn: () => apiClient.get(`/incidents?reportedBy=${cg._id}&limit=30`).then(r => r.data),
    enabled: !!cg?._id,
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/incidents', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employee', 'incidents'] })
      toast.success('Incident reported. Admin has been notified.')
      setShowForm(false)
      setForm({ clientId: '', type: '', severity: 'low', description: '', actionTaken: '' })
    },
    onError: () => toast.error('Failed to report incident'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId || !form.type || !form.description) {
      toast.error('Please fill all required fields')
      return
    }
    createMutation.mutate({ ...form, reportedBy: cg?._id, status: 'open' })
  }

  const severityColors: Record<string, string> = {
    low: 'bg-blue-50 text-blue-600',
    medium: 'bg-amber-50 text-amber-600',
    high: 'bg-orange-50 text-orange-600',
    critical: 'bg-red-50 text-red-600',
  }

  return (
    <div>
      <PageHeader
        title="Incident Reports"
        subtitle="Report and track any incidents during visits"
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-sm">
            {showForm ? 'Cancel' : 'Report Incident'}
          </button>
        }
      />

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="text-heading-md font-poppins mb-5">New Incident Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Client <span className="text-red-500">*</span></label>
                <select value={form.clientId} onChange={e => set('clientId', e.target.value)} className="form-input" required>
                  <option value="">Select client...</option>
                  {myClients.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Incident Type <span className="text-red-500">*</span></label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className="form-input" required>
                  <option value="">Select type...</option>
                  <option value="fall">Fall</option>
                  <option value="medication-error">Medication Error</option>
                  <option value="behaviour">Behaviour Concern</option>
                  <option value="health-change">Health Change</option>
                  <option value="emergency">Emergency</option>
                  <option value="property-damage">Property Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Severity</label>
                <div className="flex gap-3 mt-1">
                  {['low', 'medium', 'high', 'critical'].map(s => (
                    <button key={s} type="button" onClick={() => set('severity', s)}
                      className={`px-4 py-2 rounded-xl text-caption font-semibold capitalize border transition-all ${
                        form.severity === s ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                className="form-input min-h-[90px] resize-y" placeholder="Describe what happened in detail..." required />
            </div>
            <div>
              <label className="form-label">Action Taken</label>
              <textarea value={form.actionTaken} onChange={e => set('actionTaken', e.target.value)}
                className="form-input min-h-[70px] resize-y" placeholder="What steps did you take immediately after the incident?" />
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary btn-lg w-full">
              {createMutation.isPending ? 'Submitting...' : 'Submit Incident Report'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : (incidents?.data || []).length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No incidents reported.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(incidents?.data || []).map((inc: any) => (
            <div key={inc._id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-caption font-semibold capitalize ${severityColors[inc.severity] || 'bg-neutral-100 text-neutral-500'}`}>
                      {inc.severity}
                    </span>
                    <span className="text-caption text-neutral-400 capitalize">{inc.type?.replace('-', ' ')}</span>
                  </div>
                  <p className="text-body-sm font-semibold text-neutral-800">
                    {inc.clientId?.firstName} {inc.clientId?.lastName}
                  </p>
                </div>
                <StatusBadge status={inc.status} />
              </div>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{inc.description}</p>
              <p className="text-caption text-neutral-400 mt-2">
                {new Date(inc.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
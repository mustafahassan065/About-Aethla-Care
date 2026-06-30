'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

const defaultForm = {
  visitDate: '', summary: '', mood: 'good',
  vitals: '', notes: '', familyShared: false, clientId: '',
}

export default function EmployeeCareNotes() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...defaultForm })

  const { data: cg } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['emp-notes', cg?._id],
    queryFn: () => apiClient.get(`/care-notes?caregiverId=${cg._id}&limit=30`).then(r => r.data),
    enabled: !!cg?._id,
  })

  const { data: clientsData } = useQuery({
    queryKey: ['emp-clients', cg?._id],
    queryFn: () => apiClient.get(`/clients?limit=100`).then(r => r.data),
    enabled: showForm,
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/care-notes', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['emp-notes'] })
      toast.success('Care note saved successfully')
      setShowForm(false)
      setForm({ ...defaultForm })
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save note'),
  })

  const handleSubmit = () => {
    if (!form.visitDate) { toast.error('Visit date is required'); return }
    if (!form.summary)   { toast.error('Summary is required'); return }

    const payload: any = {
      visitDate:    form.visitDate,
      summary:      form.summary,
      mood:         form.mood,
      notes:        form.notes,
      vitals:       form.vitals,
      familyShared: form.familyShared,
      caregiverId:  cg?._id,
    }
    if (form.clientId) payload.clientId = form.clientId

    createMutation.mutate(payload)
  }

  const notes = data?.data || []
  const clients = clientsData?.data || []

  return (
    <div>
      <PageHeader
        title="Care Notes"
        subtitle="Document your visit observations"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> Add Note
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : notes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-400 mb-4">No care notes yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">+ Add First Note</button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: any) => (
            <div key={note._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">{note.visitDate}</p>
                  <p className="text-caption text-neutral-400">
                    {note.clientId?.firstName} {note.clientId?.lastName}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                    note.mood === 'good' || note.mood === 'excellent' ? 'bg-green-50 text-green-600' :
                    note.mood === 'fair' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>{note.mood}</span>
                  {note.familyShared && (
                    <span className="px-2 py-1 rounded-full text-caption font-semibold bg-blue-50 text-blue-600">Shared</span>
                  )}
                </div>
              </div>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{note.summary}</p>
              {note.notes && (
                <div className="mt-3 p-3 rounded-xl bg-neutral-50">
                  <p className="text-caption text-neutral-400 mb-1">Additional Notes</p>
                  <p className="text-body-sm text-neutral-600">{note.notes}</p>
                </div>
              )}
              {note.vitals && (
                <div className="mt-2 p-3 rounded-xl" style={{ background: 'rgba(27,107,138,0.06)' }}>
                  <p className="text-caption text-primary-600 mb-1">Vitals</p>
                  <p className="text-body-sm text-neutral-700">{note.vitals}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Add Care Note</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Client</label>
                <select
                  value={form.clientId}
                  onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}
                  className="form-input"
                >
                  <option value="">Select client (optional)...</option>
                  {clients.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Visit Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.visitDate}
                    onChange={e => setForm(p => ({ ...p, visitDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Mood / Condition</label>
                  <select
                    value={form.mood}
                    onChange={e => setForm(p => ({ ...p, mood: e.target.value }))}
                    className="form-input"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Visit Summary <span className="text-red-500">*</span></label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm(p => ({ ...p, summary: e.target.value }))}
                  className="form-input min-h-[80px] resize-y"
                  placeholder="Describe the visit and client condition..."
                />
              </div>

              <div>
                <label className="form-label">Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="form-input min-h-[60px] resize-y"
                  placeholder="Extra observations or personal notes..."
                />
              </div>

              <div>
                <label className="form-label">Vitals (optional)</label>
                <input
                  value={form.vitals}
                  onChange={e => setForm(p => ({ ...p, vitals: e.target.value }))}
                  className="form-input"
                  placeholder="BP: 120/80, Temp: 37°C, HR: 72bpm"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50">
                <input
                  type="checkbox"
                  checked={form.familyShared}
                  onChange={e => setForm(p => ({ ...p, familyShared: e.target.checked }))}
                  className="w-5 h-5 accent-primary-500"
                />
                <div>
                  <p className="text-body-sm font-semibold text-neutral-700">Share with Family</p>
                  <p className="text-caption text-neutral-400">Family can view this note in their portal</p>
                </div>
              </label>

              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="btn-primary btn-lg w-full"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Care Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
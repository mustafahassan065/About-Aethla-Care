'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EmployeeCareNotes() {
  const { user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(!!searchParams.get('clientId'))

  const [form, setForm] = useState({
    clientId:     searchParams.get('clientId') || '',
    caregiverId:  '',
    visitDate:    new Date().toISOString().split('T')[0],
    mood:         'good',
    summary:      '',
    observations: '',
    tasksCompleted: '',
    familyShared: true,
  })

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  // Get this caregiver's record
  const { data: cgData } = useQuery({
    queryKey: ['employee', 'caregiver-record'],
    queryFn: () => apiClient.get(`/caregivers?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const cg = cgData?.data?.[0]

  // Get past notes by this caregiver
  const { data: notes, isLoading } = useQuery({
    queryKey: ['employee', 'notes', cg?._id],
    queryFn: () => apiClient.get(`/care-notes?caregiverId=${cg._id}&limit=30`).then(r => r.data),
    enabled: !!cg?._id,
  })

  // Get my clients for dropdown
  const { data: schedules } = useQuery({
    queryKey: ['employee', 'schedules-all'],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cg._id}&limit=100`).then(r => r.data),
    enabled: !!cg?._id,
  })
  const myClients = (schedules?.data || [])
    .map((s: any) => s.clientId)
    .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((x: any) => x?._id === c?._id) === i)

  const createNote = useMutation({
    mutationFn: (payload: any) => apiClient.post('/care-notes', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employee', 'notes'] })
      toast.success('Care note saved successfully')
      setShowForm(false)
      setForm(p => ({ ...p, summary: '', observations: '', tasksCompleted: '' }))
    },
    onError: () => toast.error('Failed to save care note'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId || !form.summary) { toast.error('Client and summary are required'); return }
    createNote.mutate({
      clientId:   form.clientId,
      caregiverId: cg?._id,
      visitDate:  form.visitDate,
      mood:       form.mood,
      summary:    form.summary,
      observations: form.observations,
      tasksCompleted: form.tasksCompleted.split('\n').filter(Boolean),
      familyShared: form.familyShared,
    })
  }

  const moodOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good',      label: 'Good'      },
    { value: 'fair',      label: 'Fair'      },
    { value: 'poor',      label: 'Poor'      },
  ]

  return (
    <div>
      <PageHeader
        title="Care Notes"
        subtitle="Document visits and share updates with families"
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-sm">
            {showForm ? 'Cancel' : '+ New Note'}
          </button>
        }
      />

      {/* New Note Form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="text-heading-md font-poppins mb-5">New Care Note</h3>
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
                <label className="form-label">Visit Date</label>
                <input type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Client Mood</label>
                <select value={form.mood} onChange={e => set('mood', e.target.value)} className="form-input">
                  {moodOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="shared" checked={form.familyShared as boolean}
                  onChange={e => set('familyShared', e.target.checked)}
                  className="w-5 h-5 rounded accent-primary-500" />
                <label htmlFor="shared" className="text-body-sm font-medium text-neutral-700 cursor-pointer">
                  Share with family portal
                </label>
              </div>
            </div>
            <div>
              <label className="form-label">Visit Summary <span className="text-red-500">*</span></label>
              <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
                className="form-input min-h-[80px] resize-y" placeholder="Brief summary of the visit..." required />
            </div>
            <div>
              <label className="form-label">Observations</label>
              <textarea value={form.observations} onChange={e => set('observations', e.target.value)}
                className="form-input min-h-[80px] resize-y" placeholder="Clinical observations, concerns, behaviour..." />
            </div>
            <div>
              <label className="form-label">Tasks Completed (one per line)</label>
              <textarea value={form.tasksCompleted} onChange={e => set('tasksCompleted', e.target.value)}
                className="form-input min-h-[70px] resize-y" placeholder={`Bathing\nMedication given\nMeal prepared`} />
            </div>
            <button type="submit" disabled={createNote.isPending} className="btn-primary btn-lg w-full">
              {createNote.isPending ? 'Saving...' : 'Save Care Note'}
            </button>
          </form>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : (notes?.data || []).length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No care notes yet. Submit your first note above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(notes?.data || []).map((note: any) => (
            <div key={note._id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">
                    {note.clientId?.firstName} {note.clientId?.lastName}
                  </p>
                  <p className="text-caption text-neutral-400">{note.visitDate} &middot; Mood: {note.mood}</p>
                </div>
                <div className="flex gap-2">
                  {note.familyShared && (
                    <span className="badge-accent text-xs">Shared</span>
                  )}
                </div>
              </div>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{note.summary}</p>
              {note.tasksCompleted?.length > 0 && (
                <p className="text-caption text-neutral-400 mt-2">{note.tasksCompleted.length} tasks completed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
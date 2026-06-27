'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'

export default function PortalCareNotes() {
  const { user } = useAuthStore()
  const [open, setOpen] = useState<string | null>(null)

  const { data: client } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['my-portal-notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&familyShared=true&limit=30`).then(r => r.data),
    enabled: !!client?._id,
  })

  const notes = data?.data || []

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  return (
    <div>
      <PageHeader title="Care Notes" subtitle="Visit notes shared by your care team" />

      {!client ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-500">Account not linked. Contact your coordinator.</p></div>
      ) : notes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500 mb-2">No care notes shared yet.</p>
          <p className="text-body-sm text-neutral-400">Your care team will share visit notes here after each visit.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: any) => (
            <div key={note._id} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === note._id ? null : note._id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-body-sm font-bold font-poppins text-primary-500">{new Date(note.visitDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800 line-clamp-1">{note.summary}</p>
                    <p className="text-caption text-neutral-400 capitalize">Mood: {note.mood}</p>
                  </div>
                </div>
                <span className={`ml-4 text-2xl text-primary-400 transition-transform flex-shrink-0 ${open === note._id ? 'rotate-45' : ''}`}>+</span>
              </button>

              {open === note._id && (
                <div className="px-5 pb-5 border-t border-neutral-100 pt-4 space-y-3">
                  <p className="text-body-sm text-neutral-600 leading-relaxed">{note.summary}</p>

                  {note.notes && (
                    <div className="p-3 rounded-xl bg-neutral-50">
                      <p className="text-caption text-neutral-400 mb-1">Additional Notes</p>
                      <p className="text-body-sm text-neutral-600">{note.notes}</p>
                    </div>
                  )}

                  {note.vitals && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(27,107,138,0.06)' }}>
                      <p className="text-caption text-primary-600 mb-1">Vitals Recorded</p>
                      <p className="text-body-sm text-neutral-700">{note.vitals}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <span className={`px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                      note.mood === 'good' || note.mood === 'excellent' ? 'bg-green-50 text-green-600' :
                      note.mood === 'fair' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>Mood: {note.mood}</span>
                    <span className="px-2 py-1 rounded-full text-caption font-semibold bg-blue-50 text-blue-600">Shared with Family</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
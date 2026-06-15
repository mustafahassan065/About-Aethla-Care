'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'

export default function PortalCareNotes() {
  const { user } = useAuthStore()

  // Get MY client record
  const { data: client } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  // Get care notes for MY client — only familyShared ones
  const { data, isLoading } = useQuery({
    queryKey: ['my-care-notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&familyShared=true&limit=50`)
      .then(r => r.data),
    enabled: !!client?._id,
  })

  const notes = data?.data || []

  if (!client) {
    return (
      <div>
        <PageHeader title="Care Notes" subtitle="Visit summaries from your care team" />
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500">Account not yet linked. Contact your coordinator.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Care Notes"
        subtitle={`Visit summaries for ${client.firstName} ${client.lastName}`}
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : notes.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No care notes shared yet.</p>
          <p className="text-body-sm text-neutral-400 mt-2">Notes appear here after each visit when shared by the caregiver.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: any) => (
            <div key={note._id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">{note.visitDate}</p>
                  <p className="text-caption text-neutral-400 mt-0.5">
                    {note.caregiverId?.userId?.firstName} {note.caregiverId?.userId?.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-caption font-semibold capitalize ${
                  note.mood === 'excellent' ? 'bg-green-50 text-green-600'  :
                  note.mood === 'good'      ? 'bg-blue-50 text-blue-600'    :
                  note.mood === 'fair'      ? 'bg-amber-50 text-amber-600'  :
                  'bg-red-50 text-red-500'
                }`}>Mood: {note.mood}</span>
              </div>

              <p className="text-body-sm text-neutral-700 leading-relaxed mb-3">{note.summary}</p>

              {note.tasksCompleted?.length > 0 && (
                <div className="pt-3 border-t border-neutral-100">
                  <p className="text-caption text-neutral-400 mb-2">Tasks Completed</p>
                  <ul className="flex flex-col gap-1">
                    {note.tasksCompleted.map((task: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-body-sm text-neutral-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {note.vitalSigns && Object.values(note.vitalSigns).some(Boolean) && (
                <div className="pt-3 border-t border-neutral-100 mt-3">
                  <p className="text-caption text-neutral-400 mb-2">Vital Signs</p>
                  <div className="flex flex-wrap gap-4">
                    {note.vitalSigns.temperature && (
                      <div><p className="text-caption text-neutral-400">Temp</p><p className="text-body-sm font-semibold">{note.vitalSigns.temperature}°C</p></div>
                    )}
                    {note.vitalSigns.bloodPressure && (
                      <div><p className="text-caption text-neutral-400">BP</p><p className="text-body-sm font-semibold">{note.vitalSigns.bloodPressure}</p></div>
                    )}
                    {note.vitalSigns.heartRate && (
                      <div><p className="text-caption text-neutral-400">Heart Rate</p><p className="text-body-sm font-semibold">{note.vitalSigns.heartRate} bpm</p></div>
                    )}
                    {note.vitalSigns.oxygenSaturation && (
                      <div><p className="text-caption text-neutral-400">O2 Sat</p><p className="text-body-sm font-semibold">{note.vitalSigns.oxygenSaturation}%</p></div>
                    )}
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
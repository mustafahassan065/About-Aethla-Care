'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'

const moodLabels: Record<string, string> = {
  excellent: 'Excellent', good: 'Good', fair: 'Fair', poor: 'Poor',
}

export default function PortalCareNotes() {
  const { user } = useAuthStore()

  const { data: clientData } = useQuery({
    queryKey: ['portal', 'client-record'],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const client = clientData?.data?.[0]

  const { data, isLoading } = useQuery({
    queryKey: ['portal', 'care-notes', client?._id],
    queryFn: () => apiClient.get(`/care-notes?clientId=${client._id}&limit=50`).then(r => r.data),
    enabled: !!client?._id,
  })

  const notes = (data?.data || []).filter((n: any) => n.familyShared)

  return (
    <div>
      <PageHeader
        title="Care Notes"
        subtitle="Visit summaries shared by your care team"
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : notes.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No care notes have been shared yet.</p>
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
                    Caregiver: {note.caregiverId?.userId?.firstName} {note.caregiverId?.userId?.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-caption font-semibold ${
                  note.mood === 'excellent' ? 'bg-green-50 text-green-600' :
                  note.mood === 'good'      ? 'bg-blue-50 text-blue-600' :
                  note.mood === 'fair'      ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-500'
                }`}>
                  Mood: {moodLabels[note.mood] || note.mood}
                </span>
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
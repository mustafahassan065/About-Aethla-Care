'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCareNotes } from '@/hooks'
import { StatusBadge, PageHeader } from '@/components/ui/index'

const moodMap: Record<string, string> = { excellent: '😊', good: '🙂', fair: '😐', poor: '😔' }

export default function CareNotesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCareNotes({ page, limit: 20 })

  return (
    <div>
      <PageHeader
        title="Care Notes"
        subtitle={`${data?.total ?? 0} notes on file`}
        action={<Link href="/admin/care-notes/new" className="btn-primary btn-sm flex items-center gap-2"><Plus size={15} /> New Note</Link>}
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : data?.data?.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-body-md text-neutral-400">No care notes yet. Create the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.data?.map((note: any) => (
            <div key={note._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{moodMap[note.mood] || '📝'}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-body-sm font-bold font-poppins text-neutral-800">
                        {note.clientId?.firstName} {note.clientId?.lastName}
                      </strong>
                      <span className="text-neutral-300">·</span>
                      <span className="text-caption text-neutral-400">{note.visitDate}</span>
                      {note.familyShared && <span className="badge-accent text-xs">Shared</span>}
                    </div>
                    <p className="text-body-sm text-neutral-600 leading-relaxed line-clamp-2">{note.summary}</p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-caption text-neutral-400">✓ {note.tasksCompleted?.length || 0} tasks</span>
                      {note.vitalSigns && <span className="text-caption text-neutral-400">❤️ Vitals recorded</span>}
                    </div>
                  </div>
                </div>
                <Link href={`/admin/care-notes/${note._id}`} className="btn-outline btn-sm py-1 px-3 text-xs flex-shrink-0">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

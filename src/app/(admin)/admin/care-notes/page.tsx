'use client'
const notes = [
  { id: '1', client: 'Ahmed Al-Rashid',   caregiver: 'Maria Santos',    date: '16 May 2025', mood: 'good',      tasks: 5, vitals: true,  shared: true  },
  { id: '2', client: 'Fatima Hassan',     caregiver: 'Ana Reyes',       date: '16 May 2025', mood: 'excellent', tasks: 4, vitals: false, shared: false },
  { id: '3', client: 'Layla Al-Mansouri', caregiver: 'James Dela Cruz', date: '15 May 2025', mood: 'fair',      tasks: 3, vitals: true,  shared: true  },
  { id: '4', client: 'Mohammed Al-Qah.',  caregiver: 'Sarah Johnson',   date: '15 May 2025', mood: 'good',      tasks: 6, vitals: true,  shared: false },
]
const moodColors: Record<string, string> = { excellent: 'badge-accent', good: 'badge-primary', fair: 'badge-warning', poor: 'badge-error' }
export default function CareNotesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Care Notes</h1>
          <p className="text-body-sm text-neutral-400">Daily care documentation from all visits</p>
        </div>
        <button className="btn-primary btn-sm">+ New Care Note</button>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Client</th><th>Caregiver</th><th>Visit Date</th><th>Mood</th><th>Tasks</th><th>Vitals</th><th>Shared</th><th>Actions</th></tr></thead>
            <tbody>
              {notes.map(n => (
                <tr key={n.id}>
                  <td className="text-body-sm font-semibold text-neutral-800">{n.client}</td>
                  <td className="text-body-sm text-neutral-600">{n.caregiver}</td>
                  <td className="text-body-sm text-neutral-600">{n.date}</td>
                  <td><span className={moodColors[n.mood] || 'badge'}>{n.mood}</span></td>
                  <td className="text-body-sm text-neutral-600">{n.tasks} completed</td>
                  <td>{n.vitals ? <span className="badge-accent">Recorded</span> : <span className="badge">N/A</span>}</td>
                  <td>{n.shared ? <span className="badge-accent">✓ Shared</span> : <button className="text-primary-500 text-body-sm font-semibold hover:underline">Share</button>}</td>
                  <td><button className="btn-outline btn-sm py-1 px-3">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
const shifts = [
  { time: '08:00 – 12:00', client: 'Ahmed Al-Rashid',   caregiver: 'Maria Santos',    service: 'Elderly Care',   status: 'completed', area: 'Doha' },
  { time: '09:00 – 13:00', client: 'Fatima Hassan',     caregiver: 'Ana Reyes',       service: 'Newborn Care',   status: 'in-progress', area: 'Lusail' },
  { time: '10:00 – 14:00', client: 'Layla Al-Mansouri', caregiver: 'James Dela Cruz', service: 'Disability',     status: 'scheduled', area: 'Al Rayyan' },
  { time: '14:00 – 18:00', client: 'Mohammed Al-Qah.',  caregiver: 'Sarah Johnson',   service: 'Maternity Care', status: 'scheduled', area: 'Doha' },
  { time: '16:00 – 20:00', client: 'Yusuf Ibrahim',     caregiver: 'Priya Sharma',    service: 'Wellness',       status: 'scheduled', area: 'Doha' },
]
const statusColors: Record<string, string> = { completed: 'badge-accent', 'in-progress': 'badge-primary', scheduled: 'badge', missed: 'badge-error' }
export default function SchedulingPage() {
  const today = new Date().toLocaleDateString('en-QA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Scheduling</h1>
          <p className="text-body-sm text-neutral-400">{today} · {shifts.length} visits scheduled</p>
        </div>
        <button className="btn-primary btn-sm">+ New Schedule</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Today', value: shifts.length, color: '#1B6B8A' },
          { label: 'Completed', value: shifts.filter(s=>s.status==='completed').length, color: '#2DA88A' },
          { label: 'In Progress', value: shifts.filter(s=>s.status==='in-progress').length, color: '#C9A84C' },
          { label: 'Scheduled', value: shifts.filter(s=>s.status==='scheduled').length, color: '#94A3B8' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <div className="text-caption text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="text-heading-md font-poppins">Today's Visit Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Time</th><th>Client</th><th>Caregiver</th><th>Service</th><th>Area</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {shifts.map((s, i) => (
                <tr key={i}>
                  <td className="font-mono text-body-sm font-semibold text-primary-500">{s.time}</td>
                  <td className="text-body-sm font-semibold text-neutral-800">{s.client}</td>
                  <td className="text-body-sm text-neutral-600">{s.caregiver}</td>
                  <td><span className="badge-primary">{s.service}</span></td>
                  <td className="text-body-sm text-neutral-500">📍 {s.area}</td>
                  <td><span className={statusColors[s.status] || 'badge'}>{s.status}</span></td>
                  <td><button className="btn-outline btn-sm py-1 px-3">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

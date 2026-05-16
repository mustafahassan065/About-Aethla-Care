'use client'
import { useState } from 'react'
const mockStaff = [
  { id: '1', name: 'Maria Santos',   role: 'Registered Nurse',   specialty: 'Elderly Care',   rating: 4.9, clients: 6,  status: 'on-duty',  area: 'Doha' },
  { id: '2', name: 'Ana Reyes',      role: 'Baby Nurse',         specialty: 'Newborn Care',   rating: 5.0, clients: 4,  status: 'on-duty',  area: 'Lusail' },
  { id: '3', name: 'Sarah Johnson',  role: 'Postnatal Nurse',    specialty: 'Maternity',      rating: 4.8, clients: 3,  status: 'off-duty', area: 'Doha' },
  { id: '4', name: 'James Dela Cruz',role: 'Support Worker',     specialty: 'Disability',     rating: 4.7, clients: 5,  status: 'on-duty',  area: 'Al Rayyan' },
  { id: '5', name: 'Priya Sharma',   role: 'Wellness Nurse',     specialty: 'Wellness',       rating: 4.9, clients: 7,  status: 'on-duty',  area: 'Doha' },
  { id: '6', name: 'Juan Cruz',      role: 'Care Assistant',     specialty: 'Elderly Care',   rating: 4.6, clients: 5,  status: 'on-leave', area: 'Doha' },
]
export default function StaffPage() {
  const [search, setSearch] = useState('')
  const filtered = mockStaff.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Staff Management</h1>
          <p className="text-body-sm text-neutral-400">{mockStaff.filter(s=>s.status==='on-duty').length} caregivers currently on duty</p>
        </div>
        <button className="btn-primary btn-sm">+ Add Caregiver</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Staff', value: mockStaff.length, icon: '👥', color: '#1B6B8A' },
          { label: 'On Duty Now', value: mockStaff.filter(s=>s.status==='on-duty').length, icon: '✅', color: '#2DA88A' },
          { label: 'Off Duty', value: mockStaff.filter(s=>s.status==='off-duty').length, icon: '🏠', color: '#94A3B8' },
          { label: 'On Leave', value: mockStaff.filter(s=>s.status==='on-leave').length, icon: '🌴', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <div className="text-caption text-neutral-400">{s.icon} {s.label}</div>
          </div>
        ))}
      </div>
      <div className="card p-4 mb-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff..." className="form-input" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="card card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold font-poppins flex-shrink-0">
                  {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <strong className="block text-body-sm font-bold font-poppins text-neutral-800">{s.name}</strong>
                  <span className="text-caption text-neutral-400">{s.role}</span>
                </div>
              </div>
              <span className={`badge ${s.status==='on-duty'?'badge-accent':s.status==='on-leave'?'badge-warning':'badge'}`}>{s.status}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-primary">{s.specialty}</span>
              <span className="text-caption text-neutral-400">📍 {s.area}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-neutral-500">⭐ {s.rating} · {s.clients} clients</span>
              <button className="text-primary-500 font-semibold hover:underline">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

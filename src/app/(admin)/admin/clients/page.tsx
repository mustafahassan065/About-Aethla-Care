'use client'
import { useState } from 'react'
import Link from 'next/link'
const mockClients = [
  { id: '1', name: 'Ahmed Al-Rashid',   service: 'Elderly Care',     status: 'active',   area: 'Doha',   phone: '+974 5500 1122', caregiver: 'Maria Santos',    nextVisit: 'Today 10:00 AM' },
  { id: '2', name: 'Fatima Hassan',     service: 'Newborn Care',     status: 'active',   area: 'Lusail', phone: '+974 5500 2233', caregiver: 'Ana Reyes',       nextVisit: 'Today 2:00 PM' },
  { id: '3', name: 'Mohammed Al-Qa.',   service: 'Maternity Care',   status: 'active',   area: 'Doha',   phone: '+974 5500 3344', caregiver: 'Sarah Johnson',   nextVisit: 'Tomorrow 9:00 AM' },
  { id: '4', name: 'Layla Al-Mansouri', service: 'Disability',       status: 'active',   area: 'Al Rayyan', phone: '+974 5500 4455', caregiver: 'James Dela Cruz', nextVisit: 'Today 4:00 PM' },
  { id: '5', name: 'Yusuf Ibrahim',     service: 'Home Wellness',    status: 'pending',  area: 'Doha',   phone: '+974 5500 5566', caregiver: 'Unassigned',      nextVisit: 'Pending' },
  { id: '6', name: 'Aisha Al-Thani',   service: 'Elderly Care',     status: 'inactive', area: 'Doha',   phone: '+974 5500 6677', caregiver: 'N/A',             nextVisit: 'N/A' },
]
const statusColors: Record<string, string> = { active: 'badge-accent', pending: 'badge-warning', inactive: 'badge', discharged: 'badge' }
export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filtered = mockClients.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Clients</h1>
          <p className="text-body-sm text-neutral-400">{mockClients.filter(c=>c.status==='active').length} active clients across Qatar</p>
        </div>
        <Link href="/admin/clients/new" className="btn-primary btn-sm">+ Add New Client</Link>
      </div>
      <div className="card p-5 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients by name or phone..." className="form-input flex-1" />
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="form-input w-auto">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th><th>Service</th><th>Caregiver</th><th>Area</th><th>Next Visit</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold font-poppins text-sm flex-shrink-0">
                        {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <strong className="block text-body-sm font-semibold text-neutral-800">{c.name}</strong>
                        <span className="text-caption text-neutral-400">{c.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge-primary">{c.service}</span></td>
                  <td className="text-body-sm text-neutral-600">{c.caregiver}</td>
                  <td className="text-body-sm text-neutral-600">📍 {c.area}</td>
                  <td className="text-body-sm text-neutral-600">{c.nextVisit}</td>
                  <td><span className={statusColors[c.status] || 'badge'}>{c.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/admin/clients/${c.id}`} className="btn-outline btn-sm py-1 px-3">View</Link>
                      <Link href={`/admin/clients/${c.id}/edit`} className="btn-ghost-admin btn-sm py-1 px-3 text-body-sm font-semibold text-neutral-500 hover:text-neutral-700">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

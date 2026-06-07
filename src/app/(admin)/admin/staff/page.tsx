'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { useCaregivers } from '@/hooks'
import { StatusBadge, PageHeader, Avatar } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function StaffPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data, isLoading, error } = useCaregivers({ status, limit: 50 })

  // Fix: Move toast to useEffect to avoid setState during render
  useEffect(() => {
    if (error) {
      toast.error('Failed to load staff data')
      console.error('Staff error:', error)
    }
  }, [error])

  const caregivers = data?.data || []
  const total = data?.total || 0

  const filtered = caregivers.filter((c: any) => {
    if (!search) return true
    const firstName = c.userId?.firstName || ''
    const lastName = c.userId?.lastName || ''
    const name = `${firstName} ${lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  const stats = [
    { label: 'Total Staff', value: total, color: '#1B6B8A' },
    { label: 'Active', value: caregivers.filter((c: any) => c.status === 'active').length, color: '#2DA88A' },
    { label: 'On Leave', value: caregivers.filter((c: any) => c.status === 'on-leave').length, color: '#F59E0B' },
    { label: 'In Training', value: caregivers.filter((c: any) => c.status === 'training').length, color: '#8B5CF6' },
  ]

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle={`${total} caregivers in team`}
        action={
          <Link href="/admin/staff/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> Add Caregiver
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
            <div className="text-caption text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="form-input pl-9"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="form-input w-auto sm:w-40"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="training">Training</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 card p-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-body-md text-neutral-400">No staff found.</p>
            </div>
          ) : (
            filtered.map((c: any) => (
              <div key={c._id} className="card card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={`${c.userId?.firstName || 'U'} ${c.userId?.lastName || ''}`}
                      size="lg"
                    />
                    <div>
                      <strong className="block text-body-sm font-bold font-poppins text-neutral-800">
                        {c.userId?.firstName || 'Unknown'} {c.userId?.lastName || ''}
                      </strong>
                      <span className="text-caption text-neutral-400">
                        {c.specializations?.length > 0 ? c.specializations.join(', ') : 'General Care'}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={c.status || 'inactive'} />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {c.languages?.slice(0, 3).map((l: string, idx: number) => (
                    <span key={idx} className="badge text-xs bg-neutral-100 px-2 py-1 rounded">
                      {l}
                    </span>
                  ))}
                  {c.languages?.length > 3 && (
                    <span className="badge text-xs bg-neutral-100 px-2 py-1 rounded">
                      +{c.languages.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-neutral-500">
                    ⭐ {c.rating?.toFixed(1) || 'N/A'} · {c.currentClients?.length || 0} clients
                  </span>
                  <Link
                    href={`/admin/staff/${c._id}`}
                    className="text-primary-500 font-semibold hover:underline text-xs"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import { PageHeader, Avatar } from '@/components/ui/index'

function daysUntil(dateStr: string): number {
  if (!dateStr) return 999
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ExpiryBadge({ days }: { days: number }) {
  if (days < 0)  return <span className="badge-error">Expired</span>
  if (days <= 30) return <span className="badge-warning">{days}d left</span>
  if (days <= 90) return <span className="badge-primary">{days}d left</span>
  return <span className="badge-accent">Valid</span>
}

export default function CompliancePage() {
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['caregivers', 'compliance'],
    queryFn: () => apiClient.get('/caregivers?limit=100').then(r => r.data),
    retry: 1,
  })

  const caregivers = (data?.data || []) as any[]

  const filtered = caregivers.filter(cg => {
    const days = daysUntil(cg.licenseExpiry)
    if (filter === 'expiring') return days >= 0 && days <= 90
    if (filter === 'expired')  return days < 0
    return true
  })

  const expired  = caregivers.filter(cg => daysUntil(cg.licenseExpiry) < 0).length
  const expiring = caregivers.filter(cg => { const d = daysUntil(cg.licenseExpiry); return d >= 0 && d <= 90 }).length
  const clear    = caregivers.filter(cg => cg.backgroundCheckStatus === 'clear').length
  const pending  = caregivers.filter(cg => cg.backgroundCheckStatus === 'pending').length

  return (
    <div>
      <PageHeader
        title="Compliance Management"
        subtitle="License expiry tracking, background check status, and staff certification overview"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #EF4444' }}>
          <div className="text-2xl font-extrabold font-poppins text-red-500">{expired}</div>
          <p className="text-caption text-neutral-400 mt-1">Licenses Expired</p>
          <p className="text-caption text-red-400 mt-1">Immediate action required</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="text-2xl font-extrabold font-poppins text-amber-500">{expiring}</div>
          <p className="text-caption text-neutral-400 mt-1">Expiring in 90 Days</p>
          <p className="text-caption text-amber-500 mt-1">Renewal recommended</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-2xl font-extrabold font-poppins text-accent-600">{clear}</div>
          <p className="text-caption text-neutral-400 mt-1">Background Checks Clear</p>
          <p className="text-caption text-neutral-400 mt-1">Out of {caregivers.length} staff</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #94A3B8' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-500">{pending}</div>
          <p className="text-caption text-neutral-400 mt-1">Background Checks Pending</p>
          <p className="text-caption text-neutral-400 mt-1">Awaiting clearance</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all',      label: `All Staff (${caregivers.length})` },
            { key: 'expiring', label: `Expiring Soon (${expiring})` },
            { key: 'expired',  label: `Expired (${expired})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-1.5 rounded-lg text-caption font-semibold transition-all ${
                filter === f.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* License Table */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-heading-md font-poppins">License & Certification Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Caregiver</th>
                <th>License No.</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Background Check</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton h-4 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-neutral-400">
                        No records match the selected filter.
                      </td>
                    </tr>
                  )
                  : filtered.map((cg: any) => {
                    const days = daysUntil(cg.licenseExpiry)
                    const user = cg.userId
                    const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown'
                    const expiryDate = cg.licenseExpiry
                      ? new Date(cg.licenseExpiry).toLocaleDateString('en-GB')
                      : '—'

                    return (
                      <tr key={cg._id} className={days < 0 ? 'bg-red-50/50' : days <= 30 ? 'bg-amber-50/30' : ''}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Avatar name={name || 'U'} size="sm" />
                            <span className="text-body-sm font-semibold text-neutral-800">{name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-neutral-600">{cg.licenseNumber || '—'}</span>
                        </td>
                        <td>
                          <span className="text-body-sm text-neutral-600">{expiryDate}</span>
                        </td>
                        <td>
                          <span className={`text-body-sm font-semibold ${days < 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-neutral-700'}`}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : `${days} days`}
                          </span>
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                            cg.backgroundCheckStatus === 'clear'   ? 'bg-green-50 text-green-600' :
                            cg.backgroundCheckStatus === 'pending' ? 'bg-amber-50 text-amber-600' :
                            cg.backgroundCheckStatus === 'failed'  ? 'bg-red-50 text-red-600' :
                            'bg-neutral-100 text-neutral-500'
                          }`}>
                            {cg.backgroundCheckStatus || 'Not Set'}
                          </span>
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-semibold capitalize ${
                            cg.status === 'active'   ? 'bg-green-50 text-green-600' :
                            cg.status === 'inactive' ? 'bg-neutral-100 text-neutral-500' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {cg.status || '—'}
                          </span>
                        </td>
                        <td>
                          <a href={`/admin/staff/${cg._id}`} className="btn-outline btn-sm py-1 px-3 text-xs">
                            View
                          </a>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Background Check Summary */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-5">Background Check Overview</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Clear',       count: clear,                                                                 color: '#2DA88A' },
              { label: 'Pending',     count: pending,                                                               color: '#F59E0B' },
              { label: 'In Progress', count: caregivers.filter(c => c.backgroundCheckStatus === 'in-progress').length, color: '#1B6B8A' },
              { label: 'Failed',      count: caregivers.filter(c => c.backgroundCheckStatus === 'failed').length,  color: '#EF4444' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-neutral-600 font-medium">{s.label}</span>
                  <span className="font-bold font-poppins" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: caregivers.length ? `${(s.count / caregivers.length) * 100}%` : '0%',
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-5">Compliance Checklist</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'All licenses valid (not expired)',           done: expired === 0 },
              { label: 'All background checks cleared',              done: pending === 0 },
              { label: 'No staff expiring within 30 days',           done: caregivers.filter(c => { const d = daysUntil(c.licenseExpiry); return d >= 0 && d <= 30 }).length === 0 },
              { label: 'All active staff have license numbers',      done: caregivers.filter(c => c.status === 'active' && !c.licenseNumber).length === 0 },
              { label: 'All active staff have license expiry dates', done: caregivers.filter(c => c.status === 'active' && !c.licenseExpiry).length === 0 },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 py-2 border-b border-neutral-50 last:border-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.done ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {item.done
                    ? <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  }
                </div>
                <span className={`text-body-sm ${item.done ? 'text-neutral-600' : 'text-red-600 font-medium'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
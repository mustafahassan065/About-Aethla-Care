'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'

const moduleColors: Record<string, string> = {
  auth:       'bg-blue-50 text-blue-600',
  clients:    'bg-green-50 text-green-600',
  caregivers: 'bg-purple-50 text-purple-600',
  schedules:  'bg-amber-50 text-amber-600',
  billing:    'bg-rose-50 text-rose-600',
  incidents:  'bg-red-50 text-red-600',
  blog:       'bg-teal-50 text-teal-600',
  users:      'bg-indigo-50 text-indigo-600',
}

const levelColors: Record<string, string> = {
  success: 'bg-green-50 text-green-600',
  warning: 'bg-amber-50 text-amber-600',
  error:   'bg-red-50 text-red-600',
}

export default function ActivityPage() {
  const [module, setModule]   = useState('')
  const [level, setLevel]     = useState('')
  const [page, setPage]       = useState(1)

  const { data: stats } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: () => apiClient.get('/activity/stats').then(r => r.data),
    refetchInterval: 30000, // refresh every 30s
  })

  const { data, isLoading } = useQuery({
    queryKey: ['activity', module, level, page],
    queryFn: () => apiClient.get('/activity', {
      params: { ...(module ? { module } : {}), ...(level ? { level } : {}), page, limit: 50 }
    }).then(r => r.data),
    refetchInterval: 10000, // auto refresh every 10s
  })

  const columns: Column<any>[] = [
    {
      key: 'createdAt', header: 'Time',
      render: (v) => (
        <div>
          <p className="text-body-sm font-semibold text-neutral-800">
            {new Date(String(v)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-caption text-neutral-400">
            {new Date(String(v)).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'userEmail', header: 'User',
      render: (_, row) => (
        <div>
          <p className="text-body-sm font-semibold text-neutral-800">{row.userEmail || '—'}</p>
          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize ${
            row.userRole === 'admin'       ? 'bg-primary-50 text-primary-600' :
            row.userRole === 'caregiver'   ? 'bg-green-50 text-green-600'    :
            row.userRole === 'family'      ? 'bg-amber-50 text-amber-600'    :
            row.userRole === 'coordinator' ? 'bg-blue-50 text-blue-600'      :
            'bg-neutral-100 text-neutral-500'
          }`}>{row.userRole || 'system'}</span>
        </div>
      )
    },
    {
      key: 'module', header: 'Module',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-caption font-semibold capitalize ${moduleColors[String(v)] || 'bg-neutral-100 text-neutral-500'}`}>
          {String(v)}
        </span>
      )
    },
    {
      key: 'action', header: 'Action',
      render: (v) => <span className="font-mono text-xs text-neutral-600">{String(v)}</span>
    },
    {
      key: 'description', header: 'Description',
      render: (v) => <span className="text-body-sm text-neutral-600">{String(v)}</span>
    },
    {
      key: 'level', header: 'Level',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-caption font-semibold capitalize ${levelColors[String(v)] || 'bg-neutral-100 text-neutral-500'}`}>
          {String(v)}
        </span>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Activity Log"
        subtitle="Real-time system activity and audit trail"
        action={
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-caption text-neutral-500">Live — refreshes every 10s</span>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{stats?.todayCount ?? '—'}</div>
          <p className="text-caption text-neutral-400 mt-1">Actions Today</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{stats?.totalCount ?? '—'}</div>
          <p className="text-caption text-neutral-400 mt-1">Total Logged</p>
        </div>
        {(stats?.byModule || []).slice(0, 2).map((m: any) => (
          <div key={m._id} className="card p-5" style={{ borderLeft: '4px solid #C9A84C' }}>
            <div className="text-2xl font-extrabold font-poppins text-neutral-800">{m.count}</div>
            <p className="text-caption text-neutral-400 mt-1 capitalize">{m._id} actions</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3">
        <div>
          <label className="form-label">Module</label>
          <select value={module} onChange={e => { setModule(e.target.value); setPage(1) }} className="form-input w-auto">
            <option value="">All Modules</option>
            {['auth', 'clients', 'caregivers', 'schedules', 'billing', 'incidents', 'users', 'blog'].map(m => (
              <option key={m} value={m} className="capitalize">{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Level</label>
          <select value={level} onChange={e => { setLevel(e.target.value); setPage(1) }} className="form-input w-auto">
            <option value="">All Levels</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={50}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No activity logged yet. Actions will appear here as users interact with the system."
      />
    </div>
  )
}
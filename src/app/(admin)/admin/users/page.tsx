'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, Eye, EyeOff } from 'lucide-react'

const roles = [
  { value: 'admin',       label: 'Admin',        desc: 'Full system access'                    },
  { value: 'coordinator', label: 'Coordinator',   desc: 'Scheduling & client management'        },
  { value: 'caregiver',   label: 'Caregiver',     desc: 'Employee portal — care delivery'       },
  { value: 'family',      label: 'Family Member', desc: 'Family portal — view their client only' },
  { value: 'accountant',  label: 'Accountant',    desc: 'Finance module access'                 },
]

export default function UsersPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [filterRole, setFilterRole] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['users', filterRole, page],
    queryFn: () => apiClient.get('/users', {
      params: { ...(filterRole ? { role: filterRole } : {}), page, limit: 20 }
    }).then(r => r.data),
    retry: 1,
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', role: '', phone: '' }
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/users', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
      setShowForm(false)
      reset()
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create user'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/users/${id}`, { isActive }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated')
    },
    onError: () => toast.error('Failed to update user'),
  })

  const onSubmit = (data: any) => {
    createMutation.mutate({ ...data, isActive: true, isVerified: true })
  }

  const getPortalUrl = (role: string) => {
    if (role === 'caregiver' || role === 'coordinator') return '/employee/login'
    if (role === 'family') return '/portal/login'
    return '/admin/login'
  }

  const columns: Column<any>[] = [
    {
      key: 'firstName', header: 'Name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="text-body-sm font-semibold text-neutral-800">{row.firstName} {row.lastName}</p>
            <p className="text-caption text-neutral-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role', header: 'Role',
      render: (v) => {
        const r = roles.find(r => r.value === v)
        return (
          <div>
            <span className="badge-primary text-xs capitalize">{r?.label || String(v)}</span>
            <p className="text-caption text-neutral-400 mt-0.5">{r?.desc}</p>
          </div>
        )
      }
    },
    {
      key: 'role', header: 'Portal Access',
      render: (v) => (
        <a href={getPortalUrl(String(v))} target="_blank" rel="noopener noreferrer"
          className="text-body-sm text-primary-500 hover:underline font-mono text-xs">
          {getPortalUrl(String(v))}
        </a>
      )
    },
    {
      key: 'isActive', header: 'Status',
      render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} />
    },
    {
      key: 'createdAt', header: 'Created',
      render: (v) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span>
    },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => toggleActiveMutation.mutate({ id: row._id, isActive: !row.isActive })}
          className={`btn-sm py-1 px-3 text-xs ${row.isActive ? 'btn-outline text-red-400 border-red-200 hover:bg-red-50' : 'btn-primary'}`}
        >
          {row.isActive ? 'Deactivate' : 'Activate'}
        </button>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Users & Access"
        subtitle="Manage all portal users — admin, staff, and family members"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
            + Create User
          </button>
        }
      />

      {/* Portal Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { portal: 'Admin Panel',     url: '/admin/login',    roles: 'Admin, Coordinator, Accountant', color: '#1B6B8A' },
          { portal: 'Employee Portal', url: '/employee/login', roles: 'Caregiver, Coordinator',         color: '#2DA88A' },
          { portal: 'Family Portal',   url: '/portal/login',   roles: 'Family Member',                  color: '#C9A84C' },
        ].map(p => (
          <div key={p.portal} className="card p-5" style={{ borderLeft: `4px solid ${p.color}` }}>
            <p className="text-body-sm font-bold font-poppins text-neutral-800 mb-1">{p.portal}</p>
            <p className="text-caption text-neutral-500 mb-2">{p.roles}</p>
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className="text-caption font-mono text-primary-500 hover:underline">
              aethlacare.com{p.url}
            </a>
          </div>
        ))}
      </div>

      {/* Role Filter */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {[{ v: '', l: 'All Users' }, ...roles.map(r => ({ v: r.value, l: r.label }))].map(f => (
            <button key={f.v} onClick={() => { setFilterRole(f.v); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                filterRole === f.v ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}>{f.l}</button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No users found."
      />

      {/* Create User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); reset() }} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Create New User</h3>
              <button onClick={() => { setShowForm(false); reset() }}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First Name <span className="text-red-500">*</span></label>
                  <input {...register('firstName', { required: true })} className="form-input" placeholder="Ahmed" />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input {...register('lastName')} className="form-input" placeholder="Al-Rashid" />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                <input {...register('email', { required: true })} type="email" className="form-input" placeholder="user@aethlacare.qa" />
              </div>

              <div>
                <label className="form-label">Phone</label>
                <input {...register('phone')} type="tel" className="form-input" placeholder="+974" />
              </div>

              <div>
                <label className="form-label">Role <span className="text-red-500">*</span></label>
                <select {...register('role', { required: true })} className="form-input">
                  <option value="">Select role...</option>
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    {...register('password', { required: true, minLength: 8 })}
                    type={showPw ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-caption text-red-500 mt-1">Password must be at least 8 characters</p>}
              </div>

              {/* Portal info based on role */}
              <div className="p-3 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                <p className="text-caption text-primary-700 font-medium">
                  This user will log in at:{' '}
                  <strong className="font-mono">aethlacare.com{getPortalUrl('')}</strong>
                </p>
                <p className="text-caption text-neutral-500 mt-0.5">
                  Share the email and password with the user after creation.
                </p>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full">
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
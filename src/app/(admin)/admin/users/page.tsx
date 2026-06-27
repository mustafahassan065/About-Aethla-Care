'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'

const roles = [
  { value: 'admin',       label: 'Admin',         desc: 'Full system access',                           portal: '/admin/login'    },
  { value: 'coordinator', label: 'Coordinator',    desc: 'Scheduling & client management',               portal: '/admin/login'    },
  { value: 'caregiver',   label: 'Caregiver',      desc: 'Employee portal — care delivery',              portal: '/employee/login' },
  { value: 'family',      label: 'Family Member',  desc: 'Family portal — view their client only',       portal: '/portal/login'   },
  { value: 'accountant',  label: 'Accountant',     desc: 'Finance module — billing & reports',           portal: '/admin/login'    },
]

type LastAction = { id: string; action: 'deactivated' | 'activated' | 'deleted'; prevState: boolean }

export default function UsersPage() {
  const qc = useQueryClient()
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = (currentUser as any)?.isSuperAdmin === true
  const [showForm, setShowForm]         = useState(false)
  const [showPw, setShowPw]             = useState(false)
  const [filterRole, setFilterRole]     = useState('')
  const [page, setPage]                 = useState(1)
  const [selectedRole, setSelectedRole] = useState('')
  const [lastAction, setLastAction]     = useState<LastAction | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users', filterRole, page],
    queryFn: () => apiClient.get('/users', {
      params: { ...(filterRole ? { role: filterRole } : {}), page, limit: 20 }
    }).then(r => r.data),
    retry: 1,
  })

  const { data: clientsList } = useQuery({
    queryKey: ['users-clients-list'],
    queryFn: () => apiClient.get('/users/clients-list').then(r => r.data),
    enabled: showForm && selectedRole === 'family',
  })

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', role: '', phone: '', clientId: '' }
  })
  const watchRole = watch('role')

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/users', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
      closeForm()
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create user'),
  })

  // Deactivate / Activate
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/users/${id}`, { isActive }).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setLastAction({ id: vars.id, action: vars.isActive ? 'activated' : 'deactivated', prevState: !vars.isActive })
      toast.success(vars.isActive ? 'User activated' : 'User deactivated', { duration: 6000 })
    },
    onError: () => toast.error('Failed to update user'),
  })

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted permanently')
      setLastAction(null)
    },
    onError: () => toast.error('Failed to delete user'),
  })

  // Undo — toggle back
  const undoMutation = useMutation({
    mutationFn: ({ id, prevState }: { id: string; prevState: boolean }) =>
      apiClient.patch(`/users/${id}`, { isActive: prevState }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Action undone')
      setLastAction(null)
    },
    onError: () => toast.error('Failed to undo'),
  })

  const closeForm = () => { setShowForm(false); setSelectedRole(''); setShowPw(false); reset() }

  const onSubmit = (data: any) => {
    const payload: any = { ...data, isActive: true, isVerified: true }
    if (data.role !== 'family') delete payload.clientId
    createMutation.mutate(payload)
  }

  const getPortal = (role: string) => roles.find(r => r.value === role)?.portal || '/admin/login'

  const columns: Column<any>[] = [
    {
      key: 'firstName', header: 'User',
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
        return <span className="badge-primary text-xs capitalize">{r?.label || String(v)}</span>
      }
    },
    {
      key: 'linkedClient', header: 'Linked Client',
      render: (_, row) => row.linkedClient
        ? <span className="text-body-sm text-neutral-700">{row.linkedClient.firstName} {row.linkedClient.lastName}</span>
        : row.role === 'family'
          ? <span className="text-caption text-amber-500">Not linked</span>
          : <span className="text-caption text-neutral-300">—</span>
    },
    {
      key: 'role', header: 'Portal',
      render: (v) => (
        <a href={getPortal(String(v))} target="_blank" rel="noopener noreferrer"
          className="text-caption font-mono text-primary-500 hover:underline">
          {getPortal(String(v))}
        </a>
      )
    },
    { key: 'isActive', header: 'Status', render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} /> },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          {isSuperAdmin && (
            <button
              onClick={() => toggleMutation.mutate({ id: row._id, isActive: !row.isActive })}
              className={`btn-sm py-1 px-3 text-xs ${row.isActive ? 'btn-outline text-amber-500 border-amber-200 hover:bg-amber-50' : 'btn-primary'}`}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => { if (confirm(`Permanently delete ${row.firstName}? This cannot be undone.`)) deleteMutation.mutate(row._id) }}
              className="btn-sm py-1 px-3 text-xs border border-red-200 text-red-400 rounded-lg hover:bg-red-50 transition-all"
            >
              Delete
            </button>
          )}
          {!isSuperAdmin && (
            <span className="text-caption text-neutral-400">View only</span>
          )}
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Users & Access"
        subtitle="Manage portal users — admin, staff, and family members"
        action={<button onClick={() => setShowForm(true)} className="btn-primary btn-sm">+ Create User</button>}
      />

      {/* Undo Banner */}
      {lastAction && (
        <div className="card p-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: '#FFF8E1', borderLeft: '4px solid #F59E0B' }}>
          <p className="text-body-sm text-amber-700">
            Last action: User <strong>{lastAction.action}</strong>.
          </p>
          <button
            onClick={() => undoMutation.mutate({ id: lastAction.id, prevState: lastAction.prevState })}
            disabled={undoMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold text-body-sm hover:bg-amber-200 transition-all"
          >
            <RotateCcw size={15} /> Undo Action
          </button>
        </div>
      )}

      {/* Portal Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { portal: 'Admin Panel',     url: '/admin/login',    roles: 'Admin, Coordinator, Accountant', color: '#1B6B8A' },
          { portal: 'Employee Portal', url: '/employee/login', roles: 'Caregiver, Coordinator',         color: '#2DA88A' },
          { portal: 'Family Portal',   url: '/portal/login',   roles: 'Family Member',                  color: '#C9A84C' },
        ].map(p => (
          <div key={p.portal} className="card p-4" style={{ borderLeft: `4px solid ${p.color}` }}>
            <p className="text-body-sm font-bold font-poppins text-neutral-800 mb-0.5">{p.portal}</p>
            <p className="text-caption text-neutral-500 mb-1">{p.roles}</p>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-caption font-mono text-primary-500 hover:underline">
              aethlacare.com{p.url}
            </a>
          </div>
        ))}
      </div>

      {/* Filter */}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Create New User</h3>
              <button onClick={closeForm} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
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
                <label className="form-label">Email <span className="text-red-500">*</span></label>
                <input {...register('email', { required: true })} type="email" className="form-input" placeholder="user@email.com" />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input {...register('phone')} type="tel" className="form-input" placeholder="+974" />
              </div>
              <div>
                <label className="form-label">Role <span className="text-red-500">*</span></label>
                <select {...register('role', { required: true })} className="form-input"
                  onChange={e => { register('role').onChange(e); setSelectedRole(e.target.value) }}>
                  <option value="">Select role...</option>
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
                </select>
              </div>

              {watchRole === 'family' && (
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  <label className="form-label">Link to Client <span className="text-red-500">*</span></label>
                  <p className="text-caption text-neutral-400 mb-2">Select the client this family member will track in the portal</p>
                  <select {...register('clientId')} className="form-input">
                    <option value="">Select client...</option>
                    {(clientsList || []).map((c: any) => (
                      <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.status})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="form-label">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input {...register('password', { required: true, minLength: 8 })}
                    type={showPw ? 'text' : 'password'} className="form-input pr-10" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {watchRole && (
                <div className="p-3 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                  <p className="text-caption text-primary-700">
                    Portal: <strong className="font-mono">aethlacare.com{getPortal(watchRole)}</strong>
                  </p>
                </div>
              )}

              <button type="submit" disabled={isSubmitting || createMutation.isPending} className="btn-primary btn-lg w-full">
                {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
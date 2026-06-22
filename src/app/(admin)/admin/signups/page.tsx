'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, RotateCcw } from 'lucide-react'

type SignupType = 'employee' | 'patient'

// Action history for undo
type ActionRecord = {
  id: string
  type: SignupType
  action: 'approved' | 'rejected'
  prevStatus: string
}

export default function SignupRequestsPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<SignupType>('employee')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)
  const [clientId, setClientId] = useState('')
  const [lastAction, setLastAction] = useState<ActionRecord | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['signups', activeTab, status, page],
    queryFn: () => apiClient.get(
      activeTab === 'employee' ? '/public/employee-signups' : '/public/patient-signups',
      { params: { ...(status ? { status } : {}), page, limit: 20 } }
    ).then(r => r.data),
  })

  const { data: clientsList } = useQuery({
    queryKey: ['clients-for-signup'],
    queryFn: () => apiClient.get('/clients?limit=100').then(r => r.data),
    enabled: !!selected && activeTab === 'patient',
  })

  // Approve
  const approveMutation = useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId?: string }) =>
      apiClient.post(
        activeTab === 'patient'
          ? `/public/patient-signups/${id}/approve`
          : `/public/employee-signups/${id}/approve`,
        activeTab === 'patient' ? { clientId } : {}
      ).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      setLastAction({ id: vars.id, type: activeTab, action: 'approved', prevStatus: 'pending' })
      toast.success('Approved — account created', {
        duration: 6000,
        icon: '✅',
      })
      setSelected(null)
      setClientId('')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to approve'),
  })

  // Reject
  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(
        activeTab === 'patient' ? `/public/patient-signups/${id}` : `/public/employee-signups/${id}`,
        { status: 'rejected' }
      ).then(r => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      setLastAction({ id, type: activeTab, action: 'rejected', prevStatus: 'pending' })
      toast.success('Request rejected', { duration: 6000 })
      setSelected(null)
    },
    onError: () => toast.error('Failed to reject'),
  })

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(
        activeTab === 'patient' ? `/public/patient-signups/${id}` : `/public/employee-signups/${id}`
      ).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      toast.success('Request deleted')
      setSelected(null)
      setLastAction(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  // Undo — revert to pending
  const undoMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: SignupType }) =>
      apiClient.patch(
        type === 'patient' ? `/public/patient-signups/${id}` : `/public/employee-signups/${id}`,
        { status: 'pending' }
      ).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      toast.success('Action undone — status reverted to pending')
      setLastAction(null)
    },
    onError: () => toast.error('Failed to undo'),
  })

  const employeeColumns: Column<any>[] = [
    {
      key: 'firstName', header: 'Applicant',
      render: (_, r) => (
        <div>
          <strong className="text-body-sm font-semibold text-neutral-800">{r.firstName} {r.lastName}</strong>
          <p className="text-caption text-neutral-400">{r.email}</p>
          <p className="text-caption text-neutral-400">{r.phone || '—'}</p>
        </div>
      )
    },
    { key: 'specialization', header: 'Specialization', render: (v) => <span className="text-body-sm text-neutral-700">{String(v || '—')}</span> },
    { key: 'licenseNumber', header: 'License', render: (v) => <span className="font-mono text-xs text-neutral-600">{String(v || '—')}</span> },
    { key: 'experience', header: 'Experience', render: (v) => <span className="text-caption text-neutral-500">{String(v || '—')}</span> },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'createdAt', header: 'Applied', render: (v) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span> },
    {
      key: '_id', header: 'Actions',
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setSelected(r)} className="btn-outline btn-sm py-1 px-3 text-xs">Review</button>
          <button onClick={() => { if (confirm('Delete this request?')) deleteMutation.mutate(r._id) }}
            className="text-red-400 hover:text-red-600 text-caption font-semibold px-2 py-1">Delete</button>
        </div>
      )
    },
  ]

  const patientColumns: Column<any>[] = [
    {
      key: 'firstName', header: 'Applicant',
      render: (_, r) => (
        <div>
          <strong className="text-body-sm font-semibold text-neutral-800">{r.firstName} {r.lastName}</strong>
          <p className="text-caption text-neutral-400">{r.email}</p>
          <p className="text-caption text-neutral-400">{r.phone || '—'}</p>
        </div>
      )
    },
    { key: 'accountType', header: 'Account Type', render: (v) => <span className="badge-primary capitalize text-xs">{String(v)}</span> },
    {
      key: 'isSelf', header: 'For Patient',
      render: (_, r) => r.isSelf
        ? <span className="text-body-sm text-neutral-600">Themselves</span>
        : <span className="text-body-sm text-neutral-600">{r.patientFirstName} {r.patientLastName}<br/><span className="text-caption text-neutral-400">({r.relationship})</span></span>
    },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'createdAt', header: 'Applied', render: (v) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span> },
    {
      key: '_id', header: 'Actions',
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setSelected(r)} className="btn-outline btn-sm py-1 px-3 text-xs">Review</button>
          <button onClick={() => { if (confirm('Delete this request?')) deleteMutation.mutate(r._id) }}
            className="text-red-400 hover:text-red-600 text-caption font-semibold px-2 py-1">Delete</button>
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Signup Requests"
        subtitle="Review and approve new employee and patient applications"
      />

      {/* Undo Banner */}
      {lastAction && (
        <div className="card p-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: '#FFF8E1', borderLeft: '4px solid #F59E0B' }}>
          <p className="text-body-sm text-amber-700">
            Last action: <strong className="capitalize">{lastAction.action}</strong> a {lastAction.type} request.
          </p>
          <button
            onClick={() => undoMutation.mutate({ id: lastAction.id, type: lastAction.type })}
            disabled={undoMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold text-body-sm hover:bg-amber-200 transition-all"
          >
            <RotateCcw size={15} />
            Undo Action
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200">
        {([
          { k: 'employee', l: 'Employee Applications' },
          { k: 'patient',  l: 'Patient Requests'      },
        ] as const).map(t => (
          <button key={t.k} onClick={() => { setActiveTab(t.k); setPage(1); setStatus('') }}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 ${
              activeTab === t.k ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>{t.l}</button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      <DataTable
        columns={activeTab === 'employee' ? employeeColumns : patientColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No signup requests."
      />

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">
                Review {activeTab === 'employee' ? 'Employee' : 'Patient'} Application
              </h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {(activeTab === 'employee' ? [
                  ['Name',           `${selected.firstName} ${selected.lastName}`],
                  ['Email',          selected.email],
                  ['Phone',          selected.phone || '—'],
                  ['Specialization', selected.specialization || '—'],
                  ['License No.',    selected.licenseNumber || '—'],
                  ['Experience',     selected.experience || '—'],
                  ['Applied',        new Date(selected.createdAt).toLocaleString()],
                  ['Current Status', selected.status],
                ] : [
                  ['Name',         `${selected.firstName} ${selected.lastName}`],
                  ['Email',        selected.email],
                  ['Phone',        selected.phone || '—'],
                  ['Account Type', selected.accountType],
                  ['For Patient',  selected.isSelf ? 'Themselves' : `${selected.patientFirstName} ${selected.patientLastName}`],
                  ['Relationship', selected.isSelf ? 'Self' : selected.relationship],
                  ['Applied',      new Date(selected.createdAt).toLocaleString()],
                  ['Current Status', selected.status],
                ]).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize text-right max-w-[60%]">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Link to client — patient only */}
              {activeTab === 'patient' && selected.status === 'pending' && (
                <div>
                  <label className="form-label">Link to Client Record (Optional)</label>
                  <p className="text-caption text-neutral-400 mb-2">
                    Select the client this user will track in the family portal
                  </p>
                  <select value={clientId} onChange={e => setClientId(e.target.value)} className="form-input">
                    <option value="">No client link — can link later</option>
                    {(clientsList?.data || []).map((c: any) => (
                      <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => approveMutation.mutate({ id: selected._id, clientId: clientId || undefined })}
                    disabled={approveMutation.isPending}
                    className="btn-primary btn-lg flex-1"
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve & Create Account'}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(selected._id)}
                    disabled={rejectMutation.isPending}
                    className="px-5 py-3 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selected.status !== 'pending' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl" style={{
                    background: selected.status === 'approved' ? 'rgba(45,168,138,0.1)' : 'rgba(239,68,68,0.1)'
                  }}>
                    <p className="text-body-sm font-semibold capitalize" style={{
                      color: selected.status === 'approved' ? '#2DA88A' : '#EF4444'
                    }}>Status: {selected.status}</p>
                  </div>
                  {/* Undo from modal */}
                  <button
                    onClick={() => { undoMutation.mutate({ id: selected._id, type: activeTab }); setSelected(null) }}
                    className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl border border-amber-200 text-amber-600 font-semibold hover:bg-amber-50 transition-all"
                  >
                    <RotateCcw size={15} /> Undo — Revert to Pending
                  </button>
                </div>
              )}

              {/* Delete */}
              <button
                onClick={() => { if (confirm('Permanently delete this request?')) { deleteMutation.mutate(selected._id); setSelected(null) } }}
                className="w-full py-2.5 rounded-xl border border-red-100 text-red-400 text-body-sm font-semibold hover:bg-red-50 transition-all"
              >
                Delete Request Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
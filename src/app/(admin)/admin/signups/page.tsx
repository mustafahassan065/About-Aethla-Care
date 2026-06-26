'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, RotateCcw } from 'lucide-react'

type SignupType = 'admin' | 'employee' | 'patient'
type LastAction = { id: string; type: SignupType; action: string }

export default function SignupRequestsPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab]   = useState<SignupType>('admin')
  const [status, setStatus]         = useState('')
  const [page, setPage]             = useState(1)
  const [selected, setSelected]     = useState<any>(null)
  const [clientId, setClientId]     = useState('')
  const [lastAction, setLastAction] = useState<LastAction | null>(null)

  const endpointMap: Record<SignupType, string> = {
    admin:    '/public/admin-signups',
    employee: '/public/employee-signups',
    patient:  '/public/patient-signups',
  }

  const { data, isLoading } = useQuery({
    queryKey: ['signups', activeTab, status, page],
    queryFn: () => apiClient.get(endpointMap[activeTab], {
      params: { ...(status ? { status } : {}), page, limit: 20 }
    }).then(r => r.data),
  })

  const { data: clientsList } = useQuery({
    queryKey: ['clients-for-signup'],
    queryFn: () => apiClient.get('/clients?limit=100').then(r => r.data),
    enabled: !!selected && activeTab === 'patient',
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId?: string }) =>
      apiClient.post(`${endpointMap[activeTab]}/${id}/approve`,
        activeTab === 'patient' ? { clientId } : {}
      ).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      setLastAction({ id: vars.id, type: activeTab, action: 'approved' })
      toast.success('Approved — account created', { duration: 6000 })
      setSelected(null); setClientId('')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to approve'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`${endpointMap[activeTab]}/${id}`, { status }).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      setLastAction({ id: vars.id, type: activeTab, action: vars.status })
      toast.success(`Status updated to ${vars.status}`, { duration: 6000 })
      setSelected(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`${endpointMap[activeTab]}/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      toast.success('Deleted permanently')
      setSelected(null); setLastAction(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const PortalBadge = ({ type }: { type: SignupType }) => {
    const map = {
      admin:    { label: 'Admin Portal',    color: 'bg-purple-50 text-purple-600'  },
      employee: { label: 'Employee Portal', color: 'bg-blue-50 text-blue-600'    },
      patient:  { label: 'Patient Portal',  color: 'bg-amber-50 text-amber-600'  },
    }
    return <span className={`px-2 py-1 rounded-full text-caption font-semibold ${map[type].color}`}>{map[type].label}</span>
  }

  const commonColumns = (type: SignupType): Column<any>[] => [
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
    { key: '_portal', header: 'Portal', render: () => <PortalBadge type={type} /> },
    ...(type === 'employee' ? [
      { key: 'specialization', header: 'Specialization', render: (v: any) => <span className="text-body-sm text-neutral-700">{String(v || '—')}</span> },
      { key: 'licenseNumber',  header: 'License',        render: (v: any) => <span className="font-mono text-xs text-neutral-600">{String(v || '—')}</span> },
    ] : []),
    ...(type === 'patient' ? [
      { key: 'accountType', header: 'Account Type', render: (v: any) => <span className="badge-primary capitalize text-xs">{String(v)}</span> },
    ] : []),
    { key: 'status', header: 'Status', render: (v: any) => <StatusBadge status={String(v)} /> },
    { key: 'createdAt', header: 'Applied', render: (v: any) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span> },
    {
      key: '_id', header: 'Actions',
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setSelected(r)} className="btn-outline btn-sm py-1 px-3 text-xs">Review</button>
          <button onClick={() => { if (confirm('Delete permanently?')) deleteMutation.mutate(r._id) }}
            className="text-red-400 hover:text-red-600 text-caption font-semibold px-2 py-1">Delete</button>
        </div>
      )
    },
  ]

  const tabs = [
    { k: 'admin'    as SignupType, l: 'Admin Portal Requests',    color: 'bg-purple-50 text-purple-600' },
    { k: 'employee' as SignupType, l: 'Employee Portal Requests', color: 'bg-blue-50 text-blue-600'   },
    { k: 'patient'  as SignupType, l: 'Patient Portal Requests',  color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div>
      <PageHeader title="Signup Requests" subtitle="Review and approve access requests from all portals" />

      {/* Undo Banner */}
      {lastAction && (
        <div className="card p-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: '#FFF8E1', borderLeft: '4px solid #F59E0B' }}>
          <p className="text-body-sm text-amber-700">
            Last action: <strong className="capitalize">{lastAction.action}</strong> a {lastAction.type} request.
          </p>
          <button
            onClick={() => updateMutation.mutate({ id: lastAction.id, status: 'pending' })}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold text-body-sm hover:bg-amber-200 transition-all"
          >
            <RotateCcw size={15} /> Undo Action
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.k} onClick={() => { setActiveTab(t.k); setPage(1); setStatus('') }}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
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
        columns={commonColumns(activeTab)}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage={`No ${activeTab} portal signup requests.`}
      />

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div>
                <h3 className="text-heading-md font-poppins">Review Application</h3>
                <PortalBadge type={activeTab} />
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Name',   `${selected.firstName} ${selected.lastName}`],
                  ['Email',  selected.email],
                  ['Phone',  selected.phone || '—'],
                  ['Portal', activeTab === 'admin' ? 'Administration Portal' : activeTab === 'employee' ? 'Employee Portal' : 'Patient Portal'],
                  ...(activeTab === 'employee' ? [
                    ['Specialization', selected.specialization || '—'],
                    ['License',        selected.licenseNumber  || '—'],
                    ['Experience',     selected.experience     || '—'],
                  ] : []),
                  ...(activeTab === 'patient' ? [
                    ['Account Type', selected.accountType],
                    ['For Patient',  selected.isSelf ? 'Themselves' : `${selected.patientFirstName} ${selected.patientLastName}`],
                  ] : []),
                  ['Applied', new Date(selected.createdAt).toLocaleString()],
                  ['Status',  selected.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize text-right max-w-[60%]">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Client link for patient */}
              {activeTab === 'patient' && selected.status === 'pending' && (
                <div>
                  <label className="form-label">Link to Client Record (Optional)</label>
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
                    onClick={() => updateMutation.mutate({ id: selected._id, status: 'rejected' })}
                    className="px-5 py-3 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all"
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
                  <button
                    onClick={() => { updateMutation.mutate({ id: selected._id, status: 'pending' }); setSelected(null) }}
                    className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl border border-amber-200 text-amber-600 font-semibold hover:bg-amber-50 transition-all"
                  >
                    <RotateCcw size={15} /> Undo — Revert to Pending
                  </button>
                </div>
              )}

              <button
                onClick={() => { if (confirm('Permanently delete?')) { deleteMutation.mutate(selected._id); setSelected(null) } }}
                className="w-full py-2.5 rounded-xl border border-red-100 text-red-400 text-body-sm font-semibold hover:bg-red-50 transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
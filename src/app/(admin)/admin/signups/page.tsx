'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X } from 'lucide-react'

export default function SignupRequestsPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'patient' | 'employee'>('patient')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)
  const [clientId, setClientId] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['signups', activeTab, status, page],
    queryFn: () => apiClient.get(
      activeTab === 'patient' ? '/public/patient-signups' : '/public/employee-signups',
      { params: { ...(status ? { status } : {}), page, limit: 20 } }
    ).then(r => r.data),
  })

  const { data: clientsList } = useQuery({
    queryKey: ['clients-for-signup'],
    queryFn: () => apiClient.get('/clients?limit=100&status=active').then(r => r.data),
    enabled: !!selected && activeTab === 'patient',
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId?: string }) =>
      apiClient.post(
        activeTab === 'patient'
          ? `/public/patient-signups/${id}/approve`
          : `/public/employee-signups/${id}/approve`,
        activeTab === 'patient' ? { clientId } : {}
      ).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['signups'] })
      toast.success('Approved — user account created')
      setSelected(null)
      setClientId('')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to approve'),
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(
        activeTab === 'patient' ? `/public/patient-signups/${id}` : `/public/employee-signups/${id}`,
        { status: 'rejected' }
      ).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['signups'] }); toast.success('Rejected'); setSelected(null) },
    onError: () => toast.error('Failed to reject'),
  })

  const patientColumns: Column<any>[] = [
    { key: 'firstName', header: 'Name',
      render: (_, r) => <div><strong className="text-body-sm font-semibold text-neutral-800">{r.firstName} {r.lastName}</strong><p className="text-caption text-neutral-400">{r.email}</p></div> },
    { key: 'accountType', header: 'Type', render: (v) => <span className="badge-primary capitalize text-xs">{String(v)}</span> },
    { key: 'isSelf', header: 'For',
      render: (_, r) => r.isSelf
        ? <span className="text-body-sm text-neutral-600">Themselves</span>
        : <span className="text-body-sm text-neutral-600">{r.patientFirstName} {r.patientLastName} ({r.relationship})</span> },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'createdAt', header: 'Date', render: (v) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span> },
    { key: '_id', header: 'Actions', render: (_, r) => (
      <button onClick={() => setSelected(r)} className="btn-outline btn-sm py-1 px-3 text-xs">Review</button>
    )},
  ]

  const employeeColumns: Column<any>[] = [
    { key: 'firstName', header: 'Name',
      render: (_, r) => <div><strong className="text-body-sm font-semibold text-neutral-800">{r.firstName} {r.lastName}</strong><p className="text-caption text-neutral-400">{r.email}</p></div> },
    { key: 'specialization', header: 'Specialization', render: (v) => <span className="text-body-sm text-neutral-700">{String(v || '—')}</span> },
    { key: 'licenseNumber', header: 'License', render: (v) => <span className="font-mono text-xs text-neutral-600">{String(v || '—')}</span> },
    { key: 'experience', header: 'Experience', render: (v) => <span className="text-caption text-neutral-500">{String(v || '—')}</span> },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: '_id', header: 'Actions', render: (_, r) => (
      <button onClick={() => setSelected(r)} className="btn-outline btn-sm py-1 px-3 text-xs">Review</button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Signup Requests" subtitle="Review and approve new patient and employee applications" />

      {/* Tab */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200">
        {([{ k: 'patient', l: 'Patient Requests' }, { k: 'employee', l: 'Employee Applications' }] as const).map(t => (
          <button key={t.k} onClick={() => { setActiveTab(t.k); setPage(1); setStatus('') }}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 ${
              activeTab === t.k ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent'
            }`}>{t.l}</button>
        ))}
      </div>

      {/* Status filter */}
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
        columns={activeTab === 'patient' ? patientColumns : employeeColumns}
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
              <h3 className="text-heading-md font-poppins">Review {activeTab === 'patient' ? 'Patient' : 'Employee'} Application</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {activeTab === 'patient' ? [
                  ['Name',         `${selected.firstName} ${selected.lastName}`],
                  ['Email',        selected.email],
                  ['Phone',        selected.phone || '—'],
                  ['Account Type', selected.accountType],
                  ['For Patient',  selected.isSelf ? 'Themselves' : `${selected.patientFirstName} ${selected.patientLastName}`],
                  ['Relationship', selected.isSelf ? 'Self' : selected.relationship],
                  ['Applied',      new Date(selected.createdAt).toLocaleString()],
                ] : [
                  ['Name',           `${selected.firstName} ${selected.lastName}`],
                  ['Email',          selected.email],
                  ['Phone',          selected.phone || '—'],
                  ['Specialization', selected.specialization || '—'],
                  ['License',        selected.licenseNumber || '—'],
                  ['Experience',     selected.experience || '—'],
                  ['Applied',        new Date(selected.createdAt).toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 capitalize">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Patient — link to client */}
              {activeTab === 'patient' && selected.status === 'pending' && (
                <div>
                  <label className="form-label">Link to Client Record (Optional)</label>
                  <p className="text-caption text-neutral-400 mb-2">
                    Select the client this user will track in the family portal
                  </p>
                  <select value={clientId} onChange={e => setClientId(e.target.value)} className="form-input">
                    <option value="">No client link (can link later)</option>
                    {(clientsList?.data || []).map((c: any) => (
                      <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

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
                    className="px-5 py-3 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selected.status !== 'pending' && (
                <div className="p-4 rounded-xl" style={{ background: selected.status === 'approved' ? 'rgba(45,168,138,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  <p className="text-body-sm font-semibold capitalize" style={{ color: selected.status === 'approved' ? '#2DA88A' : '#EF4444' }}>
                    Status: {selected.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
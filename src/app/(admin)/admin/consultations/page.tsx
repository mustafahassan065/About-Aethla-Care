'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'

const statusColors: Record<string, string> = {
  new:       'badge-error',
  contacted: 'badge-warning',
  converted: 'badge-accent',
  closed:    'badge',
}

export default function ConsultationsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['consultations', status, page],
    queryFn: () => apiClient.get('/public/consultations', {
      params: { ...(status ? { status } : {}), page, limit: 20 }
    }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) =>
      apiClient.patch(`/public/consultations/${id}`, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['consultations'] })
      toast.success('Updated successfully')
      setSelected(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const columns: Column<any>[] = [
    {
      key: 'firstName', header: 'Name',
      render: (_, row) => (
        <div>
          <strong className="block text-body-sm font-semibold text-neutral-800">
            {row.firstName} {row.lastName}
          </strong>
          <span className="text-caption text-neutral-400">{row.email}</span>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone',
      render: (v) => <a href={`tel:${v}`} className="text-body-sm text-primary-500 hover:underline">{String(v)}</a> },
    { key: 'service', header: 'Service',
      render: (v) => <span className="badge-primary capitalize">{String(v).replace('-', ' ')}</span> },
    { key: 'location', header: 'Location',
      render: (v) => <span className="text-body-sm text-neutral-600">{String(v)}</span> },
    { key: 'status', header: 'Status',
      render: (v) => <span className={statusColors[String(v)] || 'badge'}>{String(v)}</span> },
    { key: 'createdAt', header: 'Received',
      render: (v) => <span className="text-caption text-neutral-400">{new Date(String(v)).toLocaleDateString()}</span> },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <button onClick={() => setSelected(row)} className="btn-outline btn-sm py-1 px-3 text-xs">
          View
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Consultation Requests"
        subtitle={`${data?.total ?? 0} total requests from website`}
      />

      {/* Filter */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['', 'new', 'contacted', 'converted', 'closed'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}>
              {s || 'All'}
            </button>
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
        emptyMessage="No consultation requests yet. They appear here when someone submits the form on the website."
      />

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">Consultation Request</h3>
              <button onClick={() => setSelected(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3">
                {[
                  ['Name',     `${selected.firstName} ${selected.lastName}`],
                  ['Phone',    selected.phone],
                  ['Email',    selected.email],
                  ['Service',  selected.service],
                  ['Location', selected.location],
                  ['Received', new Date(selected.createdAt).toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 text-right max-w-[60%]">{v}</dd>
                  </div>
                ))}
              </dl>

              {selected.message && (
                <div className="p-4 rounded-xl bg-neutral-50">
                  <p className="text-caption text-neutral-400 mb-1">Message</p>
                  <p className="text-body-sm text-neutral-700">{selected.message}</p>
                </div>
              )}

              {/* Update Status */}
              <div>
                <p className="text-overline text-neutral-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'converted', 'closed'].map(s => (
                    <button key={s} onClick={() => updateMutation.mutate({ id: selected._id, dto: { status: s } })}
                      disabled={selected.status === s || updateMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                        selected.status === s
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a href={`tel:${selected.phone}`} className="btn-primary btn-sm flex-1 text-center">
                  Call Client
                </a>
                <a href={`mailto:${selected.email}`} className="btn-outline btn-sm flex-1 text-center">
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
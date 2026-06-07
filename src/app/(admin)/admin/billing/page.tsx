'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'

export default function BillingPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  // NOTE: clientId filter bilkul nahi bhej rahe — sirf status aur page
  const { data, isLoading } = useQuery({
    queryKey: ['invoices', status, page],
    queryFn: () => apiClient.get('/billing/invoices', {
      params: {
        ...(status && status !== '' ? { status } : {}),
        page,
        limit: 20,
      }
    }).then(r => r.data),
  })

  const sendMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/billing/invoices/${id}/send`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Invoice sent!') },
    onError: () => toast.error('Failed to send invoice'),
  })

  const invoices = data?.data || []
  const totalRevenue = invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + (i.total || 0), 0)
  const pending = invoices.filter((i: any) => i.status === 'sent').reduce((s: number, i: any) => s + (i.total || 0), 0)
  const overdue = invoices.filter((i: any) => i.status === 'overdue').reduce((s: number, i: any) => s + (i.total || 0), 0)

  const columns: Column<any>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true,
      render: (v) => <span className="font-mono text-xs font-semibold text-primary-500">{String(v || '—')}</span> },
    { key: 'clientId', header: 'Client',
      render: (_, row) => (
        <span className="text-body-sm font-semibold text-neutral-800">
          {row.clientId?.firstName || '—'} {row.clientId?.lastName || ''}
        </span>
      )},
    { key: 'total', header: 'Amount', sortable: true,
      render: (v) => <span className="font-bold font-poppins text-neutral-800">QAR {Number(v || 0).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'dueDate', header: 'Due Date', sortable: true,
      render: (v) => <span className="text-body-sm text-neutral-600">{String(v || '—')}</span> },
    { key: '_id', header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className="btn-outline btn-sm py-1 px-3 text-xs">View</button>
          {row.status === 'draft' && (
            <button
              onClick={() => sendMutation.mutate(row._id)}
              disabled={sendMutation.isPending}
              className="btn-primary btn-sm py-1 px-3 text-xs"
            >Send</button>
          )}
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader
        title="Billing & Finance"
        subtitle={`${data?.total ?? 0} total invoices`}
        action={
          <Link href="/admin/billing/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> New Invoice
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <p className="text-caption text-neutral-400 mb-1">Revenue (Paid)</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalRevenue.toLocaleString()}</p>
          <span className="badge-accent mt-1 inline-block">Paid</span>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <p className="text-caption text-neutral-400 mb-1">Pending Payments</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {pending.toLocaleString()}</p>
          <span className="badge-primary mt-1 inline-block">Awaiting</span>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #EF4444' }}>
          <p className="text-caption text-neutral-400 mb-1">Overdue Amount</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {overdue.toLocaleString()}</p>
          <span className="badge-error mt-1 inline-block">Action Required</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['', 'paid', 'sent', 'overdue', 'draft', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No invoices yet. Create your first invoice."
      />
    </div>
  )
}
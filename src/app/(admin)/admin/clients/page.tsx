'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Filter } from 'lucide-react'
import { useClients, useDeleteClient } from '@/hooks'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge, PageHeader, Avatar, ConfirmDialog } from '@/components/ui/index'
import type { Client } from '@/types'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useClients({ search, status, page, limit: 20 })
  const deleteMutation = useDeleteClient()

  const columns: Column<Client>[] = [
    {
      key: 'firstName',
      header: 'Client',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} />
          <div>
            <strong className="block text-body-sm font-semibold text-neutral-800">
              {row.firstName} {row.lastName}
            </strong>
            <span className="text-caption text-neutral-400">{row.phone}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'careType',
      header: 'Service',
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.careType?.slice(0, 2).map(t => (
            <span key={t} className="badge-primary capitalize">{t.replace('-', ' ')}</span>
          ))}
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Area',
      render: (_, row) => (
        <span className="text-body-sm text-neutral-600">📍 {row.address?.area || row.address?.city || '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={String(val)} />,
      sortable: true,
    },
    {
      key: '_id',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Link href={`/admin/clients/${row._id}`} className="btn-outline btn-sm py-1 px-3 text-xs">View</Link>
          <Link href={`/admin/clients/${row._id}/edit`} className="text-body-sm text-primary-500 hover:underline px-2 py-1">Edit</Link>
          <button onClick={() => setDeleteId(row._id)} className="text-body-sm text-red-400 hover:text-red-600 hover:underline px-2 py-1">Deactivate</button>
        </div>
      ),
      width: '200px',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${data?.total ?? 0} total clients`}
        action={
          <Link href="/admin/clients/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus size={15} /> Add Client
          </Link>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or phone..."
              className="form-input pl-9"
            />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="form-input w-auto">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="discharged">Discharged</option>
          </select>
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
        emptyMessage="No clients found. Add your first client."
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate Client"
        message="Are you sure you want to deactivate this client? They can be reactivated later."
        confirmLabel="Deactivate"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteId) {
            await deleteMutation.mutateAsync(deleteId)
            setDeleteId(null)
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

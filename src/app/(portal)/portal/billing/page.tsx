'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'

export default function PortalBilling() {
  const { user } = useAuthStore()

  const { data: clientData } = useQuery({
    queryKey: ['portal', 'client-record'],
    queryFn: () => apiClient.get(`/clients?userId=${user?._id}&limit=1`).then(r => r.data),
    enabled: !!user,
  })
  const client = clientData?.data?.[0]

  const { data, isLoading } = useQuery({
    queryKey: ['portal', 'invoices', client?._id],
    queryFn: () => apiClient.get(`/billing/invoices?clientId=${client._id}&limit=50`).then(r => r.data),
    enabled: !!client?._id,
  })

  const invoices = data?.data || []
  const totalPaid    = invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + i.total, 0)
  const totalPending = invoices.filter((i: any) => ['sent','overdue'].includes(i.status)).reduce((s: number, i: any) => s + i.total, 0)

  return (
    <div>
      <PageHeader title="Billing" subtitle="Your invoices and payment history" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <p className="text-caption text-neutral-400 mb-1">Total Paid</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalPaid.toLocaleString()}</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #F59E0B' }}>
          <p className="text-caption text-neutral-400 mb-1">Outstanding</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalPending.toLocaleString()}</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <p className="text-caption text-neutral-400 mb-1">Total Invoices</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">{invoices.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : invoices.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No invoices yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv._id}>
                    <td>
                      <p className="font-mono text-xs font-semibold text-primary-500">{inv.invoiceNumber}</p>
                      <p className="text-caption text-neutral-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td>
                      <p className="text-body-sm font-bold font-poppins text-neutral-800">QAR {(inv.total || 0).toLocaleString()}</p>
                    </td>
                    <td>
                      <p className="text-body-sm text-neutral-600">{inv.dueDate}</p>
                    </td>
                    <td><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card p-5 mt-5">
        <p className="text-body-sm text-neutral-600">
          For billing enquiries, please contact your care coordinator on{' '}
          <a href="tel:+97440000000" className="text-primary-500 hover:underline font-semibold">+974 4000 0000</a>
        </p>
      </div>
    </div>
  )
}
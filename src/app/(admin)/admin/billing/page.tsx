'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Plus } from 'lucide-react'

const tabs = ['Invoices', 'Insurance Claims', 'Expenses', 'Payroll Summary']

export default function BillingPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('Invoices')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  // Invoices
  const { data: invoiceData, isLoading: invLoading } = useQuery({
    queryKey: ['invoices', status, page],
    queryFn: () => apiClient.get('/billing/invoices', {
      params: { ...(status ? { status } : {}), page, limit: 20 }
    }).then(r => r.data),
    enabled: activeTab === 'Invoices',
  })

  // Expenses (static for now — backend can be extended)
  const [expenses] = useState([
    { id: 1, description: 'Caregiver uniform allowance', amount: 500,  date: '2026-06-01', category: 'Staff',     status: 'approved' },
    { id: 2, description: 'Medical supplies — client kits', amount: 1200, date: '2026-06-03', category: 'Supplies',  status: 'pending'  },
    { id: 3, description: 'Training — First Aid refresher', amount: 750,  date: '2026-06-05', category: 'Training',  status: 'approved' },
  ])

  // Insurance claims (static)
  const [claims] = useState([
    { id: 1, client: 'Ahmed Al-Rashid',  insurer: 'Daman',      amount: 4200, submitted: '2026-06-01', status: 'submitted'  },
    { id: 2, client: 'Fatima Hassan',    insurer: 'SEHA',        amount: 2800, submitted: '2026-05-28', status: 'approved'   },
    { id: 3, client: 'Khalid Al-Mansoori', insurer: 'Qatar Insurance', amount: 6500, submitted: '2026-05-20', status: 'pending' },
  ])

  const sendMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/billing/invoices/${id}/send`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Invoice sent') },
    onError: () => toast.error('Failed to send'),
  })

  const invoices = invoiceData?.data || []
  const totalRevenue = invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + (i.total || 0), 0)
  const pending      = invoices.filter((i: any) => i.status === 'sent').reduce((s: number, i: any) => s + (i.total || 0), 0)
  const overdue      = invoices.filter((i: any) => i.status === 'overdue').reduce((s: number, i: any) => s + (i.total || 0), 0)

  const invoiceColumns: Column<any>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (v) => <span className="font-mono text-xs font-semibold text-primary-500">{String(v || '—')}</span> },
    { key: 'clientId', header: 'Client', render: (_, r) => <span className="text-body-sm font-semibold">{r.clientId?.firstName} {r.clientId?.lastName}</span> },
    { key: 'total', header: 'Amount', render: (v) => <span className="font-bold font-poppins">QAR {Number(v || 0).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: '_id', header: 'Actions',
      render: (_, r) => (
        <div className="flex gap-2">
          {r.status === 'draft' && (
            <button onClick={() => sendMutation.mutate(r._id)} className="btn-primary btn-sm py-1 px-3 text-xs">Send</button>
          )}
          <button className="btn-outline btn-sm py-1 px-3 text-xs">View</button>
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Billing & Finance"
        subtitle="Invoices, insurance claims, expenses, and payroll"
        action={
          activeTab === 'Invoices'
            ? <Link href="/admin/billing/new" className="btn-primary btn-sm flex items-center gap-2"><Plus size={15} /> New Invoice</Link>
            : null
        }
      />

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <p className="text-caption text-neutral-400 mb-1">Revenue Collected</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <p className="text-caption text-neutral-400 mb-1">Pending Payments</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {pending.toLocaleString()}</p>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #EF4444' }}>
          <p className="text-caption text-neutral-400 mb-1">Overdue Amount</p>
          <p className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {overdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
              activeTab === t ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>{t}</button>
        ))}
      </div>

      {/* Invoices Tab */}
      {activeTab === 'Invoices' && (
        <>
          <div className="card p-4 mb-5">
            <div className="flex gap-2 flex-wrap">
              {['', 'paid', 'sent', 'overdue', 'draft', 'cancelled'].map(s => (
                <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                    status === s ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}>{s || 'All'}</button>
              ))}
            </div>
          </div>
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            isLoading={invLoading}
            total={invoiceData?.total ?? 0}
            page={page}
            limit={20}
            onPageChange={setPage}
            rowKey={r => r._id}
            emptyMessage="No invoices found."
          />
        </>
      )}

      {/* Insurance Claims Tab */}
      {activeTab === 'Insurance Claims' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-body-sm text-neutral-500">{claims.length} claims</p>
            <button className="btn-primary btn-sm">+ New Claim</button>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Insurer</th>
                  <th>Amount (QAR)</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c.id}>
                    <td className="text-body-sm font-semibold text-neutral-800">{c.client}</td>
                    <td className="text-body-sm text-neutral-600">{c.insurer}</td>
                    <td className="font-bold font-poppins text-neutral-800">QAR {c.amount.toLocaleString()}</td>
                    <td className="text-caption text-neutral-500">{c.submitted}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><button className="btn-outline btn-sm py-1 px-3 text-xs">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'Expenses' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-body-sm text-neutral-500">{expenses.length} expenses</p>
            <button className="btn-primary btn-sm">+ Add Expense</button>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount (QAR)</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td className="text-body-sm font-semibold text-neutral-800">{e.description}</td>
                    <td><span className="badge-primary capitalize text-xs">{e.category}</span></td>
                    <td className="font-bold font-poppins text-neutral-800">QAR {e.amount.toLocaleString()}</td>
                    <td className="text-caption text-neutral-500">{e.date}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td><button className="btn-outline btn-sm py-1 px-3 text-xs">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-4 mt-4 flex justify-between">
            <span className="text-body-sm text-neutral-500">Total Expenses</span>
            <span className="text-body-sm font-bold font-poppins text-neutral-800">QAR {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Payroll Summary Tab */}
      {activeTab === 'Payroll Summary' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Staff',        value: '12',          color: '#1B6B8A' },
              { label: 'Payroll This Month', value: 'QAR 48,500',  color: '#2DA88A' },
              { label: 'Pending Approvals',  value: '3',           color: '#F59E0B' },
              { label: 'Processed',          value: '9',           color: '#94A3B8' },
            ].map(s => (
              <div key={s.label} className="card p-4" style={{ borderLeft: `4px solid ${s.color}` }}>
                <div className="text-xl font-extrabold font-poppins text-neutral-800">{s.value}</div>
                <p className="text-caption text-neutral-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-heading-md font-poppins">Payroll Breakdown</h3>
              <button className="btn-outline btn-sm">Export Payroll</button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Role</th>
                    <th>Hours</th>
                    <th>Rate (QAR/hr)</th>
                    <th>Amount (QAR)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Maria Santos',    role: 'Caregiver',   hours: 160, rate: 45, status: 'processed' },
                    { name: 'James Dela Cruz', role: 'Caregiver',   hours: 140, rate: 45, status: 'processed' },
                    { name: 'Fatima Al-Ali',   role: 'Coordinator', hours: 176, rate: 60, status: 'pending'   },
                  ].map(p => (
                    <tr key={p.name}>
                      <td className="text-body-sm font-semibold text-neutral-800">{p.name}</td>
                      <td><span className="badge-primary capitalize text-xs">{p.role}</span></td>
                      <td className="text-body-sm text-neutral-600">{p.hours}h</td>
                      <td className="text-body-sm text-neutral-600">QAR {p.rate}</td>
                      <td className="font-bold font-poppins text-neutral-800">QAR {(p.hours * p.rate).toLocaleString()}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState } from 'react'
const mockInvoices = [
  { id: 'INV-0012', client: 'Ahmed Al-Rashid',   amount: 3200,  status: 'paid',    due: '1 May 2025',  issued: '15 Apr 2025' },
  { id: 'INV-0013', client: 'Fatima Hassan',     amount: 2800,  status: 'sent',    due: '20 May 2025', issued: '1 May 2025' },
  { id: 'INV-0014', client: 'Mohammed Al-Qah.',  amount: 4500,  status: 'overdue', due: '10 May 2025', issued: '25 Apr 2025' },
  { id: 'INV-0015', client: 'Layla Al-Mansouri', amount: 2100,  status: 'draft',   due: '30 May 2025', issued: '15 May 2025' },
  { id: 'INV-0016', client: 'Yusuf Ibrahim',     amount: 1800,  status: 'paid',    due: '1 May 2025',  issued: '16 Apr 2025' },
]
const statusBadge: Record<string, string> = { paid: 'badge-accent', sent: 'badge-primary', overdue: 'badge-error', draft: 'badge' }
export default function BillingPage() {
  const [filter, setFilter] = useState('all')
  const filtered = mockInvoices.filter(i => filter === 'all' || i.status === filter)
  const totalRevenue = mockInvoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0)
  const pending = mockInvoices.filter(i=>i.status==='sent').reduce((s,i)=>s+i.amount,0)
  const overdue = mockInvoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0)
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Billing & Finance</h1>
          <p className="text-body-sm text-neutral-400">Invoices, payments, and financial overview</p>
        </div>
        <button className="btn-primary btn-sm">+ Create Invoice</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-caption text-neutral-400 mb-1">Total Revenue (Month)</div>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {totalRevenue.toLocaleString()}</div>
          <span className="badge-accent mt-1">Paid</span>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <div className="text-caption text-neutral-400 mb-1">Pending Payments</div>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {pending.toLocaleString()}</div>
          <span className="badge-primary mt-1">Awaiting</span>
        </div>
        <div className="card p-5" style={{ borderLeft: '4px solid #EF4444' }}>
          <div className="text-caption text-neutral-400 mb-1">Overdue Amount</div>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">QAR {overdue.toLocaleString()}</div>
          <span className="badge-error mt-1">Action Required</span>
        </div>
      </div>
      <div className="card mb-4 p-4">
        <div className="flex gap-2 flex-wrap">
          {['all','paid','sent','overdue','draft'].map(s => (
            <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${filter===s?'bg-primary-500 text-white':'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th><th>Due Date</th><th>Issued</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono text-body-sm font-semibold text-primary-500">{inv.id}</td>
                  <td className="text-body-sm text-neutral-700">{inv.client}</td>
                  <td className="text-body-sm font-bold font-poppins text-neutral-800">QAR {inv.amount.toLocaleString()}</td>
                  <td><span className={statusBadge[inv.status] || 'badge'}>{inv.status}</span></td>
                  <td className="text-body-sm text-neutral-600">{inv.due}</td>
                  <td className="text-body-sm text-neutral-500">{inv.issued}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-outline btn-sm py-1 px-3">View</button>
                      {inv.status === 'draft' && <button className="btn-primary btn-sm py-1 px-3">Send</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

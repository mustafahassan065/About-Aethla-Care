'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'

interface Client {
  _id: string
  firstName: string
  lastName: string
}

interface InvoiceItem {
  description: string
  date: string
  hours: number
  rate: number
  amount: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', date: new Date().toISOString().split('T')[0], hours: 0, rate: 0, amount: 0 }
  ])

  // Clients fetch karo
  useEffect(() => {
    apiClient.get('/clients?limit=100&status=active')
      .then(res => setClients(res.data?.data || []))
      .catch(() => toast.error('Could not load clients'))
  }, [])

  const updateItem = (i: number, field: keyof InvoiceItem, val: string | number) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: val }
    if (field === 'hours' || field === 'rate') {
      next[i].amount = Number(next[i].hours) * Number(next[i].rate)
    }
    setItems(next)
  }

  const addItem = () => {
    setItems([...items, { description: '', date: new Date().toISOString().split('T')[0], hours: 0, rate: 0, amount: 0 }])
  }

  const removeItem = (i: number) => {
    setItems(items.filter((_, j) => j !== i))
  }

  const subtotal = items.reduce((s, i) => s + i.amount, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const handleSubmit = async () => {
    if (!clientId) { toast.error('Please select a client'); return }
    if (!dueDate) { toast.error('Please select due date'); return }
    if (items.some(i => !i.description)) { toast.error('All items need a description'); return }

    setIsSubmitting(true)
    try {
      await apiClient.post('/billing/invoices', {
        clientId,
        items,
        subtotal,
        tax: Math.round(tax),
        total: Math.round(total),
        dueDate,
        notes,
        currency: 'QAR',
        status: 'draft',
      })
      toast.success('Invoice created successfully!')
      router.push('/admin/billing')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Create Invoice</h1>
          <p className="text-body-sm text-neutral-400">New client invoice</p>
        </div>
        <Link href="/admin/billing" className="btn-outline btn-sm">← Back</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Invoice Details */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Client Dropdown */}
              <div>
                <label className="form-label">Select Client <span className="text-red-500">*</span></label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-caption text-neutral-400 mt-1">No active clients found. Add clients first.</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="form-label">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-heading-md font-poppins">Line Items</h3>
              <button type="button" onClick={addItem} className="btn-outline btn-sm">+ Add Item</button>
            </div>

            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="col-span-2">
                      <label className="form-label">Description</label>
                      <input
                        value={item.description}
                        onChange={e => updateItem(i, 'description', e.target.value)}
                        className="form-input"
                        placeholder="e.g. Elderly care visit - Morning shift"
                      />
                    </div>
                    <div>
                      <label className="form-label">Visit Date</label>
                      <input
                        type="date"
                        value={item.date}
                        onChange={e => updateItem(i, 'date', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.hours}
                        onChange={e => updateItem(i, 'hours', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <label className="form-label">Rate (QAR/hr)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="form-label">Amount (QAR)</label>
                      <input
                        value={`QAR ${item.amount.toLocaleString()}`}
                        readOnly
                        className="form-input bg-neutral-100 font-semibold text-primary-500"
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-caption text-red-400 hover:text-red-600 font-semibold"
                    >
                      × Remove item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="form-input min-h-[80px] resize-y"
              placeholder="Payment terms, bank details, additional information..."
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Summary</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-semibold">QAR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-500">VAT (5%)</span>
                <span className="font-semibold">QAR {tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex justify-between text-body-md font-bold font-poppins">
                <span>Total</span>
                <span className="text-primary-500">QAR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary btn-lg w-full"
            >
              {isSubmitting ? '⏳ Creating...' : '✅ Create Invoice'}
            </button>
            <Link href="/admin/billing" className="btn-outline w-full text-center block py-3">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'

interface Client { _id: string; firstName: string; lastName: string }
interface Caregiver { _id: string; userId: { firstName: string; lastName: string } }

export default function NewSchedulePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    clientId: '', caregiverId: '', date: '',
    startTime: '', endTime: '', serviceType: '', notes: '',
  })

  useEffect(() => {
    apiClient.get('/clients?limit=100&status=active')
      .then(res => setClients(res.data?.data || []))
      .catch(() => toast.error('Could not load clients'))
    apiClient.get('/caregivers?limit=100&status=active')
      .then(res => setCaregivers(res.data?.data || []))
      .catch(() => toast.error('Could not load caregivers'))
  }, [])

  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }))

  const handleSubmit = async () => {
    if (!form.clientId) { toast.error('Select a client'); return }
    if (!form.caregiverId) { toast.error('Select a caregiver'); return }
    if (!form.date) { toast.error('Select a date'); return }
    if (!form.startTime || !form.endTime) { toast.error('Select start and end time'); return }
    if (!form.serviceType) { toast.error('Select service type'); return }
    setIsSubmitting(true)
    try {
      await apiClient.post('/schedules', { ...form, status: 'scheduled' })
      toast.success('Schedule created!')
      router.push('/admin/scheduling')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create schedule')
    } finally { setIsSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">New Schedule</h1>
          <p className="text-body-sm text-neutral-400">Create a new visit</p>
        </div>
        <Link href="/admin/scheduling" className="btn-outline btn-sm">← Back</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Select Client & Caregiver</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Client <span className="text-red-500">*</span></label>
                <select value={form.clientId} onChange={e => set('clientId', e.target.value)} className="form-input">
                  <option value="">-- Select Client --</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
                </select>
                {clients.length === 0 && <p className="text-caption text-amber-500 mt-1">No active clients found. Add clients first.</p>}
              </div>
              <div>
                <label className="form-label">Caregiver <span className="text-red-500">*</span></label>
                <select value={form.caregiverId} onChange={e => set('caregiverId', e.target.value)} className="form-input">
                  <option value="">-- Select Caregiver --</option>
                  {caregivers.map(c => <option key={c._id} value={c._id}>{c.userId?.firstName} {c.userId?.lastName}</option>)}
                </select>
                {caregivers.length === 0 && <p className="text-caption text-amber-500 mt-1">No active caregivers found. Add caregivers first.</p>}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Schedule Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">Visit Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Start Time <span className="text-red-500">*</span></label>
                <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">End Time <span className="text-red-500">*</span></label>
                <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} className="form-input" />
              </div>
              <div className="col-span-2">
                <label className="form-label">Service Type <span className="text-red-500">*</span></label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)} className="form-input">
                  <option value="">-- Select Service --</option>
                  <option value="elderly">Elderly Care</option>
                  <option value="disability">Disability Support</option>
                  <option value="newborn">Newborn Care</option>
                  <option value="maternity">Maternity Care</option>
                  <option value="wellness">Home Wellness</option>
                  <option value="telehealth">Telehealth</option>
                  <option value="navigation">Patient Navigation</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Notes (Optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="form-input min-h-[80px] resize-y" placeholder="Special instructions..." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {(form.clientId || form.date) && (
            <div className="card p-5">
              <h3 className="text-heading-sm font-poppins mb-3">Preview</h3>
              {form.clientId && <div className="mb-2"><p className="text-caption text-neutral-400">Client</p><p className="text-body-sm font-semibold">{clients.find(c => c._id === form.clientId)?.firstName} {clients.find(c => c._id === form.clientId)?.lastName}</p></div>}
              {form.caregiverId && <div className="mb-2"><p className="text-caption text-neutral-400">Caregiver</p><p className="text-body-sm font-semibold">{caregivers.find(c => c._id === form.caregiverId)?.userId?.firstName} {caregivers.find(c => c._id === form.caregiverId)?.userId?.lastName}</p></div>}
              {form.date && <div><p className="text-caption text-neutral-400">Date & Time</p><p className="text-body-sm font-semibold">{form.date} · {form.startTime} – {form.endTime}</p></div>}
            </div>
          )}
          <div className="card p-5 space-y-3">
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary btn-lg w-full">
              {isSubmitting ? '⏳ Creating...' : '✅ Create Schedule'}
            </button>
            <Link href="/admin/scheduling" className="btn-outline w-full text-center block py-3">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
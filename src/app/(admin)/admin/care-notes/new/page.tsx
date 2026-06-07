'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'

interface Client { _id: string; firstName: string; lastName: string }
interface Caregiver { _id: string; userId: { firstName: string; lastName: string } }

export default function NewCareNotePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    clientId: '',
    caregiverId: '',
    visitDate: '',
    mood: 'good',
    summary: '',
    observations: '',
    tasksCompleted: '',
    familyShared: false,
    // Vitals
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    oxygenSaturation: '',
  })

  useEffect(() => {
    apiClient.get('/clients?limit=100&status=active')
      .then(res => setClients(res.data?.data || []))
      .catch(() => toast.error('Could not load clients'))

    apiClient.get('/caregivers?limit=100&status=active')
      .then(res => setCaregivers(res.data?.data || []))
      .catch(() => toast.error('Could not load caregivers'))
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.clientId) { toast.error('Please select a client'); return }
    if (!form.caregiverId) { toast.error('Please select a caregiver'); return }
    if (!form.visitDate) { toast.error('Please select visit date'); return }
    if (!form.summary || form.summary.length < 10) { toast.error('Summary must be at least 10 characters'); return }
    if (!form.observations) { toast.error('Observations are required'); return }

    const tasks = form.tasksCompleted
      ? form.tasksCompleted.split('\n').map(t => t.trim()).filter(Boolean)
      : []

    const vitalSigns: any = {}
    if (form.temperature) vitalSigns.temperature = parseFloat(form.temperature)
    if (form.bloodPressure) vitalSigns.bloodPressure = form.bloodPressure
    if (form.heartRate) vitalSigns.heartRate = parseInt(form.heartRate)
    if (form.oxygenSaturation) vitalSigns.oxygenSaturation = parseInt(form.oxygenSaturation)

    setIsSubmitting(true)
    try {
      await apiClient.post('/care-notes', {
        clientId: form.clientId,
        caregiverId: form.caregiverId,
        visitDate: form.visitDate,
        mood: form.mood,
        summary: form.summary,
        observations: form.observations,
        tasksCompleted: tasks,
        familyShared: form.familyShared,
        vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
        medications: [],
        incidents: [],
        photos: [],
      })
      toast.success('Care note saved successfully!')
      router.push('/admin/care-notes')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save care note')
    } finally {
      setIsSubmitting(false)
    }
  }

  const moodOptions = [
    { value: 'excellent', label: '😊 Excellent', color: 'text-green-600' },
    { value: 'good',      label: '🙂 Good',      color: 'text-blue-600' },
    { value: 'fair',      label: '😐 Fair',      color: 'text-yellow-600' },
    { value: 'poor',      label: '😔 Poor',      color: 'text-red-600' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">New Care Note</h1>
          <p className="text-body-sm text-neutral-400">Document today's visit</p>
        </div>
        <Link href="/admin/care-notes" className="btn-outline btn-sm">← Back</Link>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Client & Caregiver */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Visit Information</h3>
              <div className="grid grid-cols-2 gap-4">

                {/* Client Dropdown */}
                <div>
                  <label className="form-label">Client <span className="text-red-500">*</span></label>
                  <select
                    value={form.clientId}
                    onChange={e => handleChange('clientId', e.target.value)}
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
                    <p className="text-caption text-neutral-400 mt-1">No active clients found.</p>
                  )}
                </div>

                {/* Caregiver Dropdown */}
                <div>
                  <label className="form-label">Caregiver <span className="text-red-500">*</span></label>
                  <select
                    value={form.caregiverId}
                    onChange={e => handleChange('caregiverId', e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- Select Caregiver --</option>
                    {caregivers.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.userId?.firstName} {c.userId?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Visit Date */}
                <div>
                  <label className="form-label">Visit Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.visitDate}
                    onChange={e => handleChange('visitDate', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="form-label">Client Mood <span className="text-red-500">*</span></label>
                  <select
                    value={form.mood}
                    onChange={e => handleChange('mood', e.target.value)}
                    className="form-input"
                  >
                    {moodOptions.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Summary & Observations */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Visit Notes</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Summary <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.summary}
                    onChange={e => handleChange('summary', e.target.value)}
                    className="form-input min-h-[90px] resize-y"
                    placeholder="Brief summary of the visit and client's condition..."
                  />
                </div>
                <div>
                  <label className="form-label">Observations <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.observations}
                    onChange={e => handleChange('observations', e.target.value)}
                    className="form-input min-h-[90px] resize-y"
                    placeholder="Detailed clinical observations, behaviour, any concerns..."
                  />
                </div>
                <div>
                  <label className="form-label">Tasks Completed</label>
                  <p className="text-caption text-neutral-400 mb-1">One task per line</p>
                  <textarea
                    value={form.tasksCompleted}
                    onChange={e => handleChange('tasksCompleted', e.target.value)}
                    className="form-input min-h-[80px] resize-y"
                    placeholder={`Bathing\nMedication administered\nExercises completed\nMeal prepared`}
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-2">Vital Signs</h3>
              <p className="text-caption text-neutral-400 mb-4">Optional — fill if measured</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.temperature}
                    onChange={e => handleChange('temperature', e.target.value)}
                    className="form-input"
                    placeholder="37.0"
                  />
                </div>
                <div>
                  <label className="form-label">Blood Pressure</label>
                  <input
                    value={form.bloodPressure}
                    onChange={e => handleChange('bloodPressure', e.target.value)}
                    className="form-input"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="form-label">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={form.heartRate}
                    onChange={e => handleChange('heartRate', e.target.value)}
                    className="form-input"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="form-label">Oxygen Saturation (%)</label>
                  <input
                    type="number"
                    value={form.oxygenSaturation}
                    onChange={e => handleChange('oxygenSaturation', e.target.value)}
                    className="form-input"
                    placeholder="98"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Options */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Options</h3>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.familyShared}
                  onChange={e => handleChange('familyShared', e.target.checked)}
                  className="w-5 h-5 rounded accent-primary-500"
                />
                <div>
                  <strong className="block text-body-sm font-semibold">Share with Family</strong>
                  <span className="text-caption text-neutral-400">Visible in family portal</span>
                </div>
              </label>
            </div>

            {/* Preview */}
            {form.clientId && (
              <div className="card p-5">
                <h3 className="text-heading-sm font-poppins mb-3">Preview</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-caption text-neutral-400">Client</p>
                    <p className="text-body-sm font-semibold">
                      {clients.find(c => c._id === form.clientId)?.firstName}{' '}
                      {clients.find(c => c._id === form.clientId)?.lastName}
                    </p>
                  </div>
                  {form.caregiverId && (
                    <div>
                      <p className="text-caption text-neutral-400">Caregiver</p>
                      <p className="text-body-sm font-semibold">
                        {caregivers.find(c => c._id === form.caregiverId)?.userId?.firstName}{' '}
                        {caregivers.find(c => c._id === form.caregiverId)?.userId?.lastName}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-caption text-neutral-400">Mood</p>
                    <p className="text-body-sm font-semibold">
                      {moodOptions.find(m => m.value === form.mood)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="card p-5 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn-lg w-full"
              >
                {isSubmitting ? '⏳ Saving...' : '✅ Save Care Note'}
              </button>
              <Link href="/admin/care-notes" className="btn-outline w-full text-center block py-3">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
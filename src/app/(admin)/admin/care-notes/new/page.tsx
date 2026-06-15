'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Mic, MicOff, Upload } from 'lucide-react'

export default function NewCareNotePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    clientId: '', caregiverId: '', visitDate: new Date().toISOString().split('T')[0],
    mood: 'good', summary: '', observations: '', tasksCompleted: '',
    familyShared: true,
    temperature: '', bloodPressure: '', heartRate: '', oxygenSaturation: '',
    medications: '', incidents: '',
  })
  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  // Load clients and caregivers
  const { data: clientData } = useQuery({
    queryKey: ['clients-dropdown'],
    queryFn: () => apiClient.get('/clients?limit=100&status=active').then(r => r.data),
  })
  const { data: cgData } = useQuery({
    queryKey: ['caregivers-dropdown'],
    queryFn: () => apiClient.get('/caregivers?limit=100&status=active').then(r => r.data),
  })

  const clients = clientData?.data || []
  const caregivers = cgData?.data || []

  // Voice to text
  const startVoiceToText = (field: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    setIsRecording(true)
    recognition.start()
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join(' ')
      set(field, form[field as keyof typeof form] + ' ' + transcript)
    }
    recognition.onerror = () => { setIsRecording(false); toast.error('Voice recognition error') }
    recognition.onend = () => setIsRecording(false)
    setTimeout(() => { recognition.stop(); setIsRecording(false) }, 30000)
  }

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId || !form.caregiverId) { toast.error('Select client and caregiver'); return }
    if (!form.summary || form.summary.length < 10) { toast.error('Summary must be at least 10 characters'); return }

    setIsSubmitting(true)
    try {
      const tasks = form.tasksCompleted.split('\n').map(t => t.trim()).filter(Boolean)
      const meds = form.medications.split('\n').map(m => m.trim()).filter(Boolean)

      const vitalSigns: any = {}
      if (form.temperature)     vitalSigns.temperature     = parseFloat(form.temperature)
      if (form.bloodPressure)   vitalSigns.bloodPressure   = form.bloodPressure
      if (form.heartRate)       vitalSigns.heartRate       = parseInt(form.heartRate)
      if (form.oxygenSaturation) vitalSigns.oxygenSaturation = parseInt(form.oxygenSaturation)

      await apiClient.post('/care-notes', {
        clientId: form.clientId,
        caregiverId: form.caregiverId,
        visitDate: form.visitDate,
        mood: form.mood,
        summary: form.summary,
        observations: form.observations,
        tasksCompleted: tasks,
        medications: meds,
        familyShared: form.familyShared,
        photos,
        vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
        incidents: form.incidents ? [form.incidents] : [],
      })
      toast.success('Care note saved successfully')
      router.push('/admin/care-notes')
    } catch {
      toast.error('Failed to save care note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">New Care Note</h1>
          <p className="text-body-sm text-neutral-400">Document today&apos;s visit</p>
        </div>
        <Link href="/admin/care-notes" className="btn-outline btn-sm">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Visit Info */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Visit Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Client <span className="text-red-500">*</span></label>
                  <select value={form.clientId} onChange={e => set('clientId', e.target.value)} className="form-input" required>
                    <option value="">Select client...</option>
                    {clients.map((c: any) => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Caregiver <span className="text-red-500">*</span></label>
                  <select value={form.caregiverId} onChange={e => set('caregiverId', e.target.value)} className="form-input" required>
                    <option value="">Select caregiver...</option>
                    {caregivers.map((c: any) => <option key={c._id} value={c._id}>{c.userId?.firstName} {c.userId?.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Visit Date</label>
                  <input type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Client Mood</label>
                  <select value={form.mood} onChange={e => set('mood', e.target.value)} className="form-input">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes with Voice-to-Text */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Visit Notes</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">Summary <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => startVoiceToText('summary')}
                      className={`flex items-center gap-1.5 text-caption font-semibold px-3 py-1 rounded-lg transition-all ${
                        isRecording ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}>
                      {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                      {isRecording ? 'Recording...' : 'Voice to Text'}
                    </button>
                  </div>
                  <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
                    className="form-input min-h-[90px] resize-y" placeholder="Summary of the visit..." required />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">Observations</label>
                    <button type="button" onClick={() => startVoiceToText('observations')}
                      className="flex items-center gap-1.5 text-caption font-semibold px-3 py-1 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">
                      <Mic size={13} /> Voice to Text
                    </button>
                  </div>
                  <textarea value={form.observations} onChange={e => set('observations', e.target.value)}
                    className="form-input min-h-[90px] resize-y" placeholder="Clinical observations, behaviour, concerns..." />
                </div>

                <div>
                  <label className="form-label">Tasks Completed (one per line)</label>
                  <textarea value={form.tasksCompleted} onChange={e => set('tasksCompleted', e.target.value)}
                    className="form-input min-h-[80px] resize-y" placeholder={`Bathing\nMedication administered\nMeal prepared`} />
                </div>

                <div>
                  <label className="form-label">Medications Administered (one per line)</label>
                  <textarea value={form.medications} onChange={e => set('medications', e.target.value)}
                    className="form-input min-h-[60px] resize-y" placeholder={`Metformin 500mg — 8:00 AM\nParacetamol 1g — 12:00 PM`} />
                </div>

                <div>
                  <label className="form-label">Incident Report (if any)</label>
                  <textarea value={form.incidents} onChange={e => set('incidents', e.target.value)}
                    className="form-input min-h-[60px] resize-y" placeholder="Describe any incidents that occurred during this visit..." />
                </div>
              </div>
            </div>

            {/* Photo Attachments */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-2">Photo Attachments</h3>
              <p className="text-body-sm text-neutral-400 mb-4">Upload photos from the visit — wound care, medication, or any relevant documentation.</p>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <Upload size={24} className="text-neutral-400 mx-auto mb-2" />
                <p className="text-body-sm text-neutral-500">Click to upload photos</p>
                <p className="text-caption text-neutral-400 mt-1">JPG, PNG — max 5MB each</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {photos.map((p, i) => (
                    <div key={i} className="relative">
                      <img src={p} alt="" className="w-20 h-20 object-cover rounded-xl" />
                      <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vital Signs */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-2">Vital Signs</h3>
              <p className="text-caption text-neutral-400 mb-4">Optional — fill if measured during visit</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Temperature (°C)</label>
                  <input type="number" step="0.1" value={form.temperature} onChange={e => set('temperature', e.target.value)} className="form-input" placeholder="37.0" />
                </div>
                <div>
                  <label className="form-label">Blood Pressure</label>
                  <input value={form.bloodPressure} onChange={e => set('bloodPressure', e.target.value)} className="form-input" placeholder="120/80" />
                </div>
                <div>
                  <label className="form-label">Heart Rate (bpm)</label>
                  <input type="number" value={form.heartRate} onChange={e => set('heartRate', e.target.value)} className="form-input" placeholder="72" />
                </div>
                <div>
                  <label className="form-label">Oxygen Saturation (%)</label>
                  <input type="number" value={form.oxygenSaturation} onChange={e => set('oxygenSaturation', e.target.value)} className="form-input" placeholder="98" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Options</h3>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <input type="checkbox" checked={form.familyShared as boolean}
                  onChange={e => set('familyShared', e.target.checked)}
                  className="w-5 h-5 rounded accent-primary-500" />
                <div>
                  <strong className="block text-body-sm font-semibold">Share with Family Portal</strong>
                  <span className="text-caption text-neutral-400">Family can see this note</span>
                </div>
              </label>
            </div>
            <div className="card p-5 space-y-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full">
                {isSubmitting ? 'Saving...' : 'Save Care Note'}
              </button>
              <Link href="/admin/care-notes" className="btn-outline w-full text-center block py-3">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { Upload, X, Plus } from 'lucide-react'

const skillSuggestions = [
  'Time Management', 'Baby Sitting', 'Elderly Care', 'First Aid & CPR',
  'Medication Administration', 'Wound Care', 'Physiotherapy Support',
  'Dementia Care', 'Palliative Care', 'Cooking & Meal Preparation',
  'Personal Hygiene Assistance', 'Mobility Support', 'Vital Signs Monitoring',
  'Manual Handling', 'Communication Skills', 'Arabic Language', 'English Language',
  'Tagalog Language', 'Hindi Language', 'Urdu Language',
]

const idTypes = ['Passport', 'Qatar ID (QID)', "Driver's Licence", 'National ID Card', 'Residence Permit', 'Other']

export default function EmployeeProfilePage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const certFileRef = useRef<HTMLInputElement>(null)
  const idFileRef   = useRef<HTMLInputElement>(null)

  const [editBio, setEditBio]   = useState(false)
  const [bio, setBio]           = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)
  const [selectedIdType, setSelectedIdType] = useState('Passport')
  const [idPreview, setIdPreview] = useState<string>('')

  const { data: cg, isLoading } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  useEffect(() => { if (cg?.bio) setBio(cg.bio) }, [cg])

  const updateMutation = useMutation({
    mutationFn: (dto: any) => apiClient.patch(`/caregivers/${cg._id}`, dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-cg'] }); toast.success('Profile updated') },
    onError: () => toast.error('Failed to update'),
  })

  const addSkill = (skill: string) => {
    if (!skill.trim()) return
    const current = cg?.skills || []
    if (current.includes(skill.trim())) { toast.error('Skill already added'); return }
    updateMutation.mutate({ skills: [...current, skill.trim()] })
    setNewSkill('')
    setShowSkillSuggestions(false)
  }

  const removeSkill = (skill: string) => {
    const current = cg?.skills || []
    updateMutation.mutate({ skills: current.filter((s: string) => s !== skill) })
  }

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const current = cg?.certificates || []
      updateMutation.mutate({
        certificates: [...current, {
          name: file.name,
          data: ev.target?.result,
          uploadedAt: new Date().toISOString(),
        }]
      })
    }
    reader.readAsDataURL(file)
  }

  const removeCert = (index: number) => {
    const current = [...(cg?.certificates || [])]
    current.splice(index, 1)
    updateMutation.mutate({ certificates: current })
  }

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const data = ev.target?.result as string
      setIdPreview(data)
      updateMutation.mutate({
        identificationCard: { type: selectedIdType, data, uploadedAt: new Date().toISOString() }
      })
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  if (!cg) return (
    <div>
      <PageHeader title="My Profile" subtitle="Your employee profile" />
      <div className="card p-12 text-center">
        <p className="text-body-md text-neutral-500">Profile not yet set up. Contact admin.</p>
      </div>
    </div>
  )

  const cgUser = cg.userId
  const filteredSuggestions = skillSuggestions.filter(s =>
    s.toLowerCase().includes(newSkill.toLowerCase()) && !(cg?.skills || []).includes(s)
  )

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your professional caregiver profile" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Profile Card */}
        <div className="space-y-5">
          <div className="card p-6 text-center">
            <Avatar name={`${cgUser?.firstName || ''} ${cgUser?.lastName || ''}`} size="lg" />
            <h3 className="text-heading-lg font-poppins text-neutral-800 mt-4">{cgUser?.firstName} {cgUser?.lastName}</h3>
            <p className="text-body-sm text-neutral-500 mt-1">{cg.specializations?.join(', ')}</p>
            <StatusBadge status={cg.status} />
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-neutral-100">
              <div>
                <p className="text-2xl font-extrabold font-poppins text-primary-500">{cg.rating?.toFixed(1) || '—'}</p>
                <p className="text-caption text-neutral-400">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-poppins text-accent-600">{cg.experience || 0}</p>
                <p className="text-caption text-neutral-400">Years Exp.</p>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Professional Details</h3>
            <dl className="space-y-3">
              {[
                ['Email',           cgUser?.email || '—'],
                ['Phone',           cgUser?.phone || '—'],
                ['License No.',     cg.licenseNumber || '—'],
                ['License Expiry',  cg.licenseExpiry ? new Date(cg.licenseExpiry).toLocaleDateString() : '—'],
                ['Languages',       cg.languages?.join(', ') || '—'],
                ['Hourly Rate',     cg.hourlyRate ? `QAR ${cg.hourlyRate}/hr` : '—'],
                ['Background Check', cg.backgroundCheckStatus || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                  <dt className="text-caption text-neutral-400">{k}</dt>
                  <dd className="text-body-sm font-semibold text-neutral-700 capitalize text-right max-w-[60%]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Right — Editable Sections */}
        <div className="lg:col-span-2 space-y-5">

          {/* Bio */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-heading-md font-poppins">About Me</h3>
              <button onClick={() => setEditBio(!editBio)} className={editBio ? 'btn-outline btn-sm' : 'btn-primary btn-sm'}>
                {editBio ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editBio ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  className="form-input min-h-[100px] resize-y mb-3"
                  placeholder="Tell patients and coordinators about yourself, your experience, and your approach to care..." />
                <button onClick={() => { updateMutation.mutate({ bio }); setEditBio(false) }}
                  disabled={updateMutation.isPending} className="btn-primary btn-sm">Save Bio</button>
              </div>
            ) : (
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                {cg.bio || 'No bio added yet. Click Edit to add one.'}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-2">Skills</h3>
            <p className="text-body-sm text-neutral-400 mb-4">List your skills — these appear on your profile when patients view it.</p>

            {/* Existing skills */}
            {(cg?.skills || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(cg.skills || []).map((skill: string) => (
                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-semibold bg-primary-50 text-primary-600 border border-primary-200">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-primary-400 hover:text-red-500 transition-colors">
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add skill */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={e => { setNewSkill(e.target.value); setShowSkillSuggestions(true) }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(newSkill) } }}
                  className="form-input flex-1"
                  placeholder="Type a skill or select below (e.g. Time Management, First Aid)"
                  onFocus={() => setShowSkillSuggestions(true)}
                />
                <button onClick={() => addSkill(newSkill)} className="btn-primary btn-sm flex items-center gap-1">
                  <Plus size={15} /> Add
                </button>
              </div>

              {/* Suggestions */}
              {showSkillSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map(s => (
                    <button key={s} onClick={() => addSkill(s)}
                      className="w-full text-left px-4 py-2.5 text-body-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certifications & Credentials */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-2">Certifications & Credentials</h3>
            <p className="text-body-sm text-neutral-400 mb-4">Upload your certificates, credentials, and compliance documents. These are visible to admin and shown on your profile.</p>

            {/* Existing */}
            {(cg?.certificates || []).length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {(cg.certificates || []).map((cert: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-neutral-800">{cert.name}</p>
                        <p className="text-caption text-neutral-400">{cert.uploadedAt ? new Date(cert.uploadedAt).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <button onClick={() => removeCert(i)} className="text-red-400 hover:text-red-600 p-1"><X size={16} /></button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => certFileRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <Upload size={24} className="text-neutral-400 mx-auto mb-2" />
              <p className="text-body-sm text-neutral-500">Click to upload certificate or credential</p>
              <p className="text-caption text-neutral-400 mt-1">PDF, JPG, PNG — max 5MB</p>
            </div>
            <input ref={certFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleCertUpload} className="hidden" />
          </div>

          {/* ID Card Upload */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-2">Identification Document</h3>
            <p className="text-body-sm text-neutral-400 mb-4">Upload your identification document. Select the type of document before uploading.</p>

            <div className="mb-4">
              <label className="form-label">Document Type</label>
              <select value={selectedIdType} onChange={e => setSelectedIdType(e.target.value)} className="form-input w-auto">
                {idTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {(cg?.identificationCard?.data || idPreview) ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-800">{cg?.identificationCard?.type || selectedIdType} — Uploaded</p>
                      <p className="text-caption text-neutral-400">{cg?.identificationCard?.uploadedAt ? new Date(cg.identificationCard.uploadedAt).toLocaleDateString() : 'Just uploaded'}</p>
                    </div>
                  </div>
                  <button onClick={() => idFileRef.current?.click()} className="btn-outline btn-sm text-xs">Replace</button>
                </div>
              </div>
            ) : (
              <div onClick={() => idFileRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
                <Upload size={24} className="text-neutral-400 mx-auto mb-2" />
                <p className="text-body-sm text-neutral-500">Click to upload {selectedIdType}</p>
                <p className="text-caption text-neutral-400 mt-1">JPG, PNG, PDF — max 5MB</p>
              </div>
            )}
            <input ref={idFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleIdUpload} className="hidden" />
          </div>

          {/* Compliance Documents */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-2">Compliance Documents</h3>
            <p className="text-body-sm text-neutral-400 mb-4">Upload any compliance-related documents required by Aethla Care or Qatar Ministry of Health.</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Background Check Certificate', key: 'backgroundCheck' },
                { label: 'Health Screening Certificate', key: 'healthScreening' },
                { label: 'Professional Indemnity Insurance', key: 'insurance' },
              ].map(doc => (
                <div key={doc.key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100">
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{doc.label}</p>
                    <p className="text-caption text-neutral-400">
                      {cg?.[doc.key] ? 'Uploaded' : 'Not yet uploaded'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-caption font-semibold ${cg?.[doc.key] ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    {cg?.[doc.key] ? 'On file' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-caption text-neutral-400 mt-3">Contact admin to update compliance document status.</p>
          </div>

          {/* Availability */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Availability</h3>
            <div className="flex flex-wrap gap-3">
              {['Full-Time', 'Part-Time', 'Live-In', 'Overnight', 'Weekends', 'On-Call'].map(a => {
                const selected = (cg?.availability || []).includes(a)
                return (
                  <button key={a} onClick={() => {
                    const current = cg?.availability || []
                    const updated = selected ? current.filter((x: string) => x !== a) : [...current, a]
                    updateMutation.mutate({ availability: updated })
                  }}
                    className={`px-4 py-2 rounded-full text-body-sm font-semibold border transition-all ${
                      selected ? 'bg-primary-500 text-white border-primary-500' : 'border-neutral-200 text-neutral-600 hover:border-primary-300'
                    }`}>
                    {a}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
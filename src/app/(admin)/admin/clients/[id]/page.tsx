'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import { X, Plus, Trash2, ArrowLeft } from 'lucide-react'

type Tab = 'overview' | 'care-plan' | 'caregivers' | 'consent' | 'medical'

const consentForms = [
  { key: 'careConsent',       label: 'Care Services Consent'             },
  { key: 'dataProtection',    label: 'Data Protection Agreement'         },
  { key: 'photoConsent',      label: 'Photo & Documentation Consent'     },
  { key: 'medicationConsent', label: 'Medication Administration Consent' },
  { key: 'emergencyConsent',  label: 'Emergency Response Consent'        },
]

export default function ClientDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()
  const qc       = useQueryClient()
  const [tab, setTab]               = useState<Tab>('overview')
  const [showAssign, setShowAssign] = useState(false)
  const [selectedCg, setSelectedCg] = useState('')

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => apiClient.get(`/clients/${id}`).then(r => r.data),
  })

  const { data: allCaregivers } = useQuery({
    queryKey: ['caregivers-list'],
    queryFn: () => apiClient.get('/caregivers?limit=200&status=active').then(r => r.data),
    enabled: showAssign,
  })

  const { register: regCP, handleSubmit: handleCP } = useForm()
  const { register: regInfo, handleSubmit: handleInfo } = useForm()

  const updateMutation = useMutation({
    mutationFn: (dto: any) => apiClient.patch(`/clients/${id}`, dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['client', id] }); toast.success('Updated') },
    onError: () => toast.error('Update failed'),
  })

  const assignMutation = useMutation({
    mutationFn: (caregiverId: string) =>
      apiClient.post(`/clients/${id}/assign-caregiver`, { caregiverId }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', id] })
      toast.success('Caregiver assigned successfully')
      setShowAssign(false); setSelectedCg('')
    },
    onError: () => toast.error('Failed to assign caregiver'),
  })

  const removeCgMutation = useMutation({
    mutationFn: (caregiverId: string) =>
      apiClient.delete(`/clients/${id}/caregivers/${caregiverId}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', id] })
      toast.success('Caregiver removed')
    },
    onError: () => toast.error('Failed to remove'),
  })

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
  if (!client) return <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">Client not found.</p></div>

  const assignedIds = (client.assignedCaregivers || []).map((cg: any) => cg._id?.toString())
  const availableCgs = (allCaregivers?.data || []).filter((cg: any) => !assignedIds.includes(cg._id?.toString()))

  const tabs: { k: Tab; l: string }[] = [
    { k: 'overview',   l: 'Overview'         },
    { k: 'caregivers', l: 'Assigned Workers' },
    { k: 'care-plan',  l: 'Care Plan'        },
    { k: 'medical',    l: 'Medical Info'     },
    { k: 'consent',    l: 'Consent Forms'    },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </button>
        <PageHeader
          title={`${client.firstName} ${client.lastName}`}
          subtitle={`Client · ${client.status}`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
              tab === t.k ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>{t.l}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Client Information</h3>
            <form onSubmit={handleInfo(dto => updateMutation.mutate(dto))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input {...regInfo('firstName')} defaultValue={client.firstName} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input {...regInfo('lastName')} defaultValue={client.lastName} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <input {...regInfo('email')} defaultValue={client.email} type="email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input {...regInfo('phone')} defaultValue={client.phone} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input {...regInfo('dateOfBirth')} defaultValue={client.dateOfBirth} type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select {...regInfo('gender')} defaultValue={client.gender} className="form-input">
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select {...regInfo('status')} defaultValue={client.status} className="form-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="discharged">Discharged</option>
                </select>
              </div>
              <div>
                <label className="form-label">Care Type</label>
                <select {...regInfo('careType')} defaultValue={client.careType?.[0]} className="form-input">
                  <option value="">Select...</option>
                  <option value="elderly-care">Elderly Care</option>
                  <option value="newborn">Newborn Care</option>
                  <option value="maternity">Maternity Care</option>
                  <option value="disability">Disability Support</option>
                  <option value="wellness">Home Wellness</option>
                  <option value="telehealth">Telehealth</option>
                  <option value="navigation">Patient Navigation</option>
                  <option value="lifestyle">Lifestyle Wellness</option>
                </select>
              </div>
              <div>
                <label className="form-label">Notes</label>
                <textarea {...regInfo('notes')} defaultValue={client.notes} className="form-input min-h-[70px] resize-y" />
              </div>
              <button type="submit" disabled={updateMutation.isPending} className="btn-primary btn-sm">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Quick Info</h3>
              <dl className="space-y-3">
                {[
                  ['Status',          client.status],
                  ['Care Type',       client.careType?.join(', ')    || '—'],
                  ['Portal Linked',   client.userId ? 'Yes ✓' : 'No — not linked to portal'],
                  ['Consent Signed',  client.consentSigned ? 'Yes' : 'No'],
                  ['Created',         new Date(client.createdAt).toLocaleDateString()],
                  ['Area',            client.address?.area           || '—'],
                  ['Caregivers',      `${(client.assignedCaregivers || []).length} assigned`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-neutral-50 last:border-0">
                    <dt className="text-body-sm text-neutral-400">{k}</dt>
                    <dd className="text-body-sm font-semibold text-neutral-700 text-right max-w-[60%] capitalize">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Emergency Contacts */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Emergency Contacts</h3>
              {(client.emergencyContacts || []).length === 0
                ? <p className="text-body-sm text-neutral-400">None on record.</p>
                : (client.emergencyContacts || []).map((ec: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-neutral-50 mb-2">
                    <p className="text-body-sm font-semibold text-neutral-800">{ec.name}</p>
                    <p className="text-caption text-neutral-500 capitalize">{ec.relationship}</p>
                    <a href={`tel:${ec.phone}`} className="text-body-sm text-primary-500">{ec.phone}</a>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* CAREGIVERS TAB — Main feature for Issue 3 */}
      {tab === 'caregivers' && (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-heading-lg font-poppins text-neutral-800">Assigned Workers</h3>
              <p className="text-body-sm text-neutral-400 mt-1">Assign caregivers to this client. They will appear in the client&apos;s portal.</p>
            </div>
            <button onClick={() => setShowAssign(true)} className="btn-primary btn-sm flex items-center gap-2">
              <Plus size={15} /> Assign Worker
            </button>
          </div>

          {(client.assignedCaregivers || []).length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-body-md text-neutral-400 mb-4">No caregivers assigned yet.</p>
              <button onClick={() => setShowAssign(true)} className="btn-primary btn-sm">+ Assign a Worker</button>
            </div>
          ) : (
            <div className="space-y-3">
              {(client.assignedCaregivers || []).map((cg: any) => (
                <div key={cg._id} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${cg.userId?.firstName} ${cg.userId?.lastName}`} size="md" />
                    <div>
                      <p className="text-body-sm font-bold font-poppins text-neutral-800">
                        {cg.userId?.firstName} {cg.userId?.lastName}
                      </p>
                      <p className="text-caption text-neutral-400">{cg.userId?.email}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {(cg.specializations || []).slice(0, 2).map((s: string) => (
                          <span key={s} className="badge-primary text-xs">{s}</span>
                        ))}
                        <StatusBadge status={cg.status} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (confirm('Remove this caregiver from client?')) removeCgMutation.mutate(cg._id) }}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Assign Caregiver Modal */}
          {showAssign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAssign(false)} />
              <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-heading-md font-poppins">Assign Worker to {client.firstName}</h3>
                  <button onClick={() => setShowAssign(false)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {availableCgs.length === 0 ? (
                    <p className="text-body-sm text-neutral-400 text-center py-6">All available caregivers are already assigned.</p>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3">
                        {availableCgs.map((cg: any) => (
                          <label key={cg._id}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedCg === cg._id ? 'border-primary-500 bg-primary-50' : 'border-neutral-100 hover:border-neutral-200'
                            }`}>
                            <input type="radio" name="caregiver" value={cg._id}
                              checked={selectedCg === cg._id}
                              onChange={() => setSelectedCg(cg._id)}
                              className="accent-primary-500" />
                            <div className="flex-1">
                              <p className="text-body-sm font-bold font-poppins text-neutral-800">
                                {cg.userId?.firstName} {cg.userId?.lastName}
                              </p>
                              <p className="text-caption text-neutral-400">{cg.specializations?.join(', ') || '—'}</p>
                              <div className="flex gap-2 mt-1">
                                <StatusBadge status={cg.status} />
                                {cg.rating > 0 && <span className="text-caption text-amber-500">★ {cg.rating?.toFixed(1)}</span>}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={() => { if (selectedCg) assignMutation.mutate(selectedCg) }}
                        disabled={!selectedCg || assignMutation.isPending}
                        className="btn-primary btn-lg w-full"
                      >
                        {assignMutation.isPending ? 'Assigning...' : 'Assign Selected Worker'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CARE PLAN */}
      {tab === 'care-plan' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Care Plan</h3>
            <form onSubmit={handleCP(dto => updateMutation.mutate({ carePlan: dto }))} className="space-y-4">
              <div>
                <label className="form-label">Care Goals</label>
                <textarea {...regCP('goals')} defaultValue={client.carePlan?.goals} className="form-input min-h-[80px] resize-y"
                  placeholder="List the primary care goals for this client..." />
              </div>
              <div>
                <label className="form-label">Risk Assessment</label>
                <textarea {...regCP('riskAssessment')} defaultValue={client.carePlan?.riskAssessment} className="form-input min-h-[80px] resize-y"
                  placeholder="Describe any risks or safety considerations..." />
              </div>
              <div>
                <label className="form-label">Coordinator Notes</label>
                <textarea {...regCP('notes')} defaultValue={client.carePlan?.notes} className="form-input min-h-[80px] resize-y"
                  placeholder="Additional notes for caregivers..." />
              </div>
              <button type="submit" disabled={updateMutation.isPending} className="btn-primary btn-sm">
                {updateMutation.isPending ? 'Saving...' : 'Save Care Plan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MEDICAL INFO */}
      {tab === 'medical' && (
        <div className="grid lg:grid-cols-2 gap-5 max-w-3xl">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medical Conditions</h3>
            {(client.medicalConditions || []).length === 0
              ? <p className="text-body-sm text-neutral-400">None on record.</p>
              : <div className="flex flex-wrap gap-2">{(client.medicalConditions || []).map((c: string) => <span key={c} className="badge-primary">{c}</span>)}</div>
            }
          </div>
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Allergies</h3>
            {(client.allergies || []).length === 0
              ? <p className="text-body-sm text-neutral-400">None on record.</p>
              : <div className="flex flex-wrap gap-2">{(client.allergies || []).map((a: string) => <span key={a} className="px-3 py-1 rounded-full text-body-sm font-semibold bg-red-50 text-red-600">{a}</span>)}</div>
            }
          </div>
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medications</h3>
            {(client.medications || []).length === 0
              ? <p className="text-body-sm text-neutral-400">None on record.</p>
              : <ul className="space-y-1">{(client.medications || []).map((m: any, i: number) => <li key={i} className="text-body-sm text-neutral-700">{typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`}</li>)}</ul>
            }
          </div>
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Emergency Contacts</h3>
            {(client.emergencyContacts || []).length === 0
              ? <p className="text-body-sm text-neutral-400">None on record.</p>
              : <div className="space-y-2">{(client.emergencyContacts || []).map((ec: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-neutral-50">
                    <p className="text-body-sm font-semibold text-neutral-800">{ec.name}</p>
                    <p className="text-caption text-neutral-500 capitalize">{ec.relationship}</p>
                    <a href={`tel:${ec.phone}`} className="text-body-sm text-primary-500">{ec.phone}</a>
                  </div>
                ))}</div>
            }
          </div>
        </div>
      )}

      {/* CONSENT FORMS */}
      {tab === 'consent' && (
        <div className="max-w-2xl space-y-4">
          <div className="card p-5 mb-2">
            <p className="text-body-sm text-neutral-500">
              Consent forms are signed by the client through their family portal.
              Status shown here reflects what they have signed.
            </p>
          </div>
          {consentForms.map(f => (
            <div key={f.key} className="card p-5 flex items-center justify-between gap-4">
              <p className="text-body-sm font-semibold text-neutral-800">{f.label}</p>
              <span className={`px-3 py-1 rounded-full text-caption font-semibold ${
                client[`consent_${f.key}`] ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {client[`consent_${f.key}`] ? 'Signed' : 'Pending'}
              </span>
            </div>
          ))}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-semibold text-neutral-700">Overall Consent Status</p>
              <span className={`px-3 py-1 rounded-full text-caption font-semibold ${
                client.consentSigned ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {client.consentSigned ? 'Consent Signed' : 'Awaiting Consent'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
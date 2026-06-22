'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'

export default function PortalMedical() {
  const { user } = useAuthStore()

  const { data: client, isLoading } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  return (
    <div>
      <PageHeader title="Medical Records" subtitle="Your health information and emergency contacts" />

      {!client ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-500">Account not linked. Contact your coordinator.</p></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Medical Conditions */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medical Conditions</h3>
            {client.medicalConditions?.length > 0
              ? <div className="flex flex-wrap gap-2">{client.medicalConditions.map((c: string) => <span key={c} className="badge-primary">{c}</span>)}</div>
              : <p className="text-body-sm text-neutral-400">None on record.</p>
            }
          </div>

          {/* Allergies */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Allergies</h3>
            {client.allergies?.length > 0
              ? <div className="flex flex-wrap gap-2">{client.allergies.map((a: string) => <span key={a} className="px-3 py-1 rounded-full text-body-sm font-semibold bg-red-50 text-red-600">{a}</span>)}</div>
              : <p className="text-body-sm text-neutral-400">None on record.</p>
            }
          </div>

          {/* Medications */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Medications</h3>
            {client.medications?.length > 0
              ? <ul className="flex flex-col gap-2">{client.medications.map((m: any, i: number) => (
                  <li key={i} className="text-body-sm text-neutral-700 py-2 border-b border-neutral-50 last:border-0">
                    {typeof m === 'string' ? m : `${m.name || ''} ${m.dosage || ''}`}
                  </li>
                ))}</ul>
              : <p className="text-body-sm text-neutral-400">None on record.</p>
            }
          </div>

          {/* Emergency Contacts */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Emergency Contacts</h3>
            {client.emergencyContacts?.length > 0
              ? <div className="flex flex-col gap-3">
                  {client.emergencyContacts.map((ec: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-neutral-50">
                      <p className="text-body-sm font-semibold text-neutral-800">{ec.name}</p>
                      <p className="text-caption text-neutral-500 capitalize">{ec.relationship}</p>
                      <a href={`tel:${ec.phone}`} className="text-body-sm text-primary-500 hover:underline">{ec.phone}</a>
                    </div>
                  ))}
                </div>
              : <p className="text-body-sm text-neutral-400">None on record.</p>
            }
          </div>

          {/* Risk Assessment */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-heading-md font-poppins mb-4">Risk Assessment</h3>
            {client.carePlan?.riskAssessment ? (
              <div className="prose text-body-sm text-neutral-600 leading-relaxed">
                <p>{client.carePlan.riskAssessment}</p>
              </div>
            ) : (
              <p className="text-body-sm text-neutral-400">Risk assessment not yet completed. Your care coordinator will update this after the initial assessment.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
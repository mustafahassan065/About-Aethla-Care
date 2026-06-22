'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'

export default function PortalCarePlan() {
  const { user } = useAuthStore()

  const { data: client, isLoading } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  const carePlan = client?.carePlan

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  return (
    <div>
      <PageHeader title="My Care Plan" subtitle="Your personalised care plan from Aethla Care" />

      {!client ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-500">Account not linked. Contact your coordinator.</p></div>
      ) : !carePlan ? (
        <div className="card p-12 text-center">
          <p className="text-body-md text-neutral-500 mb-2">Your care plan has not been set up yet.</p>
          <p className="text-body-sm text-neutral-400">Your care coordinator will add your care plan after the initial assessment.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Care Goals */}
          {carePlan.goals && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Care Goals</h3>
              <ul className="flex flex-col gap-2">
                {(Array.isArray(carePlan.goals) ? carePlan.goals : [carePlan.goals]).map((g: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-body-sm text-neutral-700">
                    <div className="w-5 h-5 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {client.careType && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Services Included</h3>
              <div className="flex flex-wrap gap-2">
                {client.careType.map((t: string) => (
                  <span key={t} className="badge-primary capitalize">{t.replace('-', ' ')}</span>
                ))}
              </div>
            </div>
          )}

          {/* Medical Conditions */}
          {client.medicalConditions?.length > 0 && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Medical Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {client.medicalConditions.map((c: string) => <span key={c} className="badge-primary">{c}</span>)}
              </div>
            </div>
          )}

          {/* Allergies */}
          {client.allergies?.length > 0 && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {client.allergies.map((a: string) => (
                  <span key={a} className="px-3 py-1 rounded-full text-body-sm font-semibold bg-red-50 text-red-600">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {carePlan.notes && (
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-3">Care Notes from Coordinator</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{carePlan.notes}</p>
            </div>
          )}

          <div className="card p-5">
            <p className="text-body-sm text-neutral-500">To discuss or update your care plan, contact your coordinator on <a href="tel:+97440000000" className="text-primary-500 font-semibold">+974 4000 0000</a></p>
          </div>
        </div>
      )}
    </div>
  )
}
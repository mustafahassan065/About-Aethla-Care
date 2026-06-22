'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'

const consentForms = [
  { key: 'careConsent',        title: 'Care Services Consent',              desc: 'I consent to receive home healthcare services from Aethla Care as outlined in my care plan.' },
  { key: 'dataProtection',     title: 'Data Protection Agreement',          desc: 'I consent to the collection and use of my personal and health data for care delivery purposes.' },
  { key: 'photoConsent',       title: 'Photo & Documentation Consent',      desc: 'I consent to photographs being taken for care documentation and medical record purposes.' },
  { key: 'medicationConsent',  title: 'Medication Administration Consent',  desc: 'I consent to caregivers administering my prescribed medications during visits.' },
  { key: 'emergencyConsent',   title: 'Emergency Response Consent',         desc: 'I consent to emergency services being contacted if required during a care visit.' },
]

export default function PortalConsent() {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const { data: client, isLoading } = useQuery({
    queryKey: ['my-client', user?._id],
    queryFn: () => apiClient.get('/clients/me').then(r => r.data),
    enabled: !!user,
  })

  const [signed, setSigned] = useState<Record<string, boolean>>({})

  const updateMutation = useMutation({
    mutationFn: (dto: any) => apiClient.patch(`/clients/${client._id}`, dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-client'] }); toast.success('Consent updated') },
    onError: () => toast.error('Failed to update'),
  })

  const handleSign = (key: string, value: boolean) => {
    setSigned(p => ({ ...p, [key]: value }))
    updateMutation.mutate({ [`consent_${key}`]: value, consentSigned: true })
  }

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  return (
    <div>
      <PageHeader title="Consent Forms" subtitle="Review and sign your care consent documents" />

      {!client ? (
        <div className="card p-12 text-center"><p className="text-body-md text-neutral-500">Account not linked. Contact your coordinator.</p></div>
      ) : (
        <div className="space-y-4">
          <div className="card p-5 mb-2">
            <p className="text-body-sm text-neutral-500">
              Please review each consent form carefully. Your digital signature is recorded with a timestamp and stored securely as part of your care record.
            </p>
          </div>

          {consentForms.map(f => {
            const isSigned = signed[f.key] ?? false
            return (
              <div key={f.key} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-heading-sm font-poppins text-neutral-800 mb-1">{f.title}</h3>
                    <p className="text-body-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`block text-caption font-semibold px-2 py-1 rounded-full mb-3 ${isSigned ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                      {isSigned ? 'Signed' : 'Pending'}
                    </span>
                    {!isSigned ? (
                      <button onClick={() => handleSign(f.key, true)} className="btn-primary btn-sm py-1.5 px-4 text-xs">
                        Sign & Agree
                      </button>
                    ) : (
                      <button onClick={() => handleSign(f.key, false)} className="btn-outline btn-sm py-1.5 px-4 text-xs text-red-400 border-red-200">
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="card p-5">
            <p className="text-caption text-neutral-400">All consent signatures are recorded with date, time, and your account details for compliance purposes. Contact your care coordinator if you have any questions about these forms.</p>
          </div>
        </div>
      )}
    </div>
  )
}
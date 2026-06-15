'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import Link from 'next/link'

export default function EmployeeClients() {
  const { user } = useAuthStore()

  // Get MY caregiver record
  const { data: cgData } = useQuery({
    queryKey: ['my-cg', user?._id],
    queryFn: () => apiClient.get('/caregivers/me').then(r => r.data),
    enabled: !!user,
  })

  // Get all MY schedules to find MY assigned clients
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['my-clients', cgData?._id],
    queryFn: () => apiClient.get(`/schedules?caregiverId=${cgData._id}&limit=200`)
      .then(r => r.data),
    enabled: !!cgData?._id,
  })

  // Extract unique clients from MY schedules
  const clients = (() => {
    const seen = new Set()
    const result: any[] = []
    for (const s of scheduleData?.data || []) {
      const c = s.clientId
      if (c && !seen.has(c._id)) {
        seen.add(c._id)
        result.push(c)
      }
    }
    return result
  })()

  return (
    <div>
      <PageHeader title="My Clients" subtitle={`${clients.length} clients assigned to you`} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No clients assigned yet.</p>
          <p className="text-body-sm text-neutral-400 mt-2">Contact your coordinator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client: any) => (
            <div key={client._id} className="card card-hover p-5">
              <div className="flex items-start gap-4">
                <Avatar name={`${client.firstName} ${client.lastName}`} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-heading-sm font-poppins text-neutral-800">
                      {client.firstName} {client.lastName}
                    </h3>
                    <StatusBadge status={client.status} />
                  </div>
                  <p className="text-caption text-neutral-500 mb-1">
                    {client.careType?.join(', ')}
                  </p>
                  <p className="text-caption text-neutral-400">
                    {client.address?.area || 'Doha'}, Qatar
                  </p>
                  <div className="flex gap-2 mt-3">
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="btn-outline btn-sm py-1 px-3 text-xs">Call</a>
                    )}
                    <Link href={`/employee/care-notes?clientId=${client._id}`}
                      className="btn-primary btn-sm py-1 px-3 text-xs">Add Note</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
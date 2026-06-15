'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import Link from 'next/link'

export default function EmployeeClients() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['employee', 'clients'],
    queryFn: async () => {
      // Get caregiver record
      const cgRes = await apiClient.get(`/caregivers?userId=${user?._id}&limit=1`)
      const cg = cgRes.data?.data?.[0]
      if (!cg) return { data: [] }
      // Get schedules to find which clients this caregiver is assigned to
      const schedRes = await apiClient.get(`/schedules?caregiverId=${cg._id}&limit=100`)
      const schedules = schedRes.data?.data || []
      // Extract unique client IDs
      const clientIds = [...new Set(schedules.map((s: any) => s.clientId?._id).filter(Boolean))]
      const clients = schedules
        .map((s: any) => s.clientId)
        .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((x: any) => x?._id === c?._id) === i)
      return { data: clients }
    },
    enabled: !!user,
  })

  const clients = data?.data || []

  return (
    <div>
      <PageHeader title="My Clients" subtitle={`${clients.length} clients currently assigned to you`} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400">No clients assigned yet.</p>
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
                  <p className="text-caption text-neutral-500 mb-2">
                    {client.careType?.join(', ')} &middot; {client.address?.area || 'Doha'}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${client.phone}`}
                      className="btn-outline btn-sm py-1 px-3 text-xs">Call</a>
                    <Link href={`/employee/care-notes/new?clientId=${client._id}`}
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
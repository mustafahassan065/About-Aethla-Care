'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import { PageHeader, Avatar, StatusBadge } from '@/components/ui/index'
import { ExternalLink } from 'lucide-react'

export default function ViewAsPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'patients'>('employees')
  const [search, setSearch] = useState('')

  const { data: employees, isLoading: empLoading } = useQuery({
    queryKey: ['view-as-employees'],
    queryFn: () => apiClient.get('/caregivers?limit=100').then(r => r.data),
    enabled: activeTab === 'employees',
  })

  const { data: patients, isLoading: patLoading } = useQuery({
    queryKey: ['view-as-patients'],
    queryFn: () => apiClient.get('/users?role=family&limit=100').then(r => r.data),
    enabled: activeTab === 'patients',
  })

  const empList: any[] = (employees?.data || []).filter((e: any) => {
    if (!search) return true
    const name = `${e.userId?.firstName} ${e.userId?.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase()) || e.userId?.email?.includes(search.toLowerCase())
  })

  const patList: any[] = (patients?.data || []).filter((p: any) => {
    if (!search) return true
    const name = `${p.firstName} ${p.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase()) || p.email?.includes(search.toLowerCase())
  })

  const openEmployeeView = (cg: any) => {
    // Store temp view token in sessionStorage then open employee dashboard
    sessionStorage.setItem('adminViewAs', JSON.stringify({
      type: 'employee',
      caregiverId: cg._id,
      userId: cg.userId?._id,
      name: `${cg.userId?.firstName} ${cg.userId?.lastName}`,
    }))
    window.open('/admin/view-as/employee', '_blank')
  }

  const openPatientView = (patient: any) => {
    sessionStorage.setItem('adminViewAs', JSON.stringify({
      type: 'patient',
      userId: patient._id,
      name: `${patient.firstName} ${patient.lastName}`,
    }))
    window.open('/admin/view-as/patient', '_blank')
  }

  return (
    <div>
      <PageHeader
        title="View As User"
        subtitle="Open any employee or patient dashboard in read-only view"
      />

      <div className="card p-4 mb-5">
        <p className="text-body-sm text-neutral-500 mb-3">
          Click any user below to open their portal dashboard. This is a read-only admin view — no actions will affect the actual account.
        </p>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-caption text-amber-700 font-semibold">Admin View Only — Changes made in these views do NOT affect user accounts.</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          placeholder="Search by name or email..."
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200">
        {([{ k: 'employees', l: 'Employees' }, { k: 'patients', l: 'Patients / Family' }] as const).map(t => (
          <button key={t.k} onClick={() => { setActiveTab(t.k); setSearch('') }}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 ${
              activeTab === t.k ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-neutral-500 border-transparent'
            }`}>{t.l}</button>
        ))}
      </div>

      {/* Employees */}
      {activeTab === 'employees' && (
        empLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : empList.length === 0 ? (
          <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No employees found.</p></div>
        ) : (
          <div className="space-y-3">
            {empList.map((cg: any) => (
              <div key={cg._id} className="card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={`${cg.userId?.firstName} ${cg.userId?.lastName}`} size="md" />
                  <div>
                    <p className="text-body-sm font-bold font-poppins text-neutral-800">
                      {cg.userId?.firstName} {cg.userId?.lastName}
                    </p>
                    <p className="text-caption text-neutral-400">{cg.userId?.email}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {cg.specializations?.slice(0, 2).map((s: string) => (
                        <span key={s} className="badge-primary text-xs">{s}</span>
                      ))}
                      <StatusBadge status={cg.status} />
                    </div>
                  </div>
                </div>
                <button onClick={() => openEmployeeView(cg)}
                  className="btn-primary btn-sm flex items-center gap-2 flex-shrink-0">
                  <ExternalLink size={14} /> View Dashboard
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Patients */}
      {activeTab === 'patients' && (
        patLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : patList.length === 0 ? (
          <div className="card p-12 text-center"><p className="text-body-md text-neutral-400">No family portal users found.</p></div>
        ) : (
          <div className="space-y-3">
            {patList.map((p: any) => (
              <div key={p._id} className="card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={`${p.firstName} ${p.lastName}`} size="md" />
                  <div>
                    <p className="text-body-sm font-bold font-poppins text-neutral-800">{p.firstName} {p.lastName}</p>
                    <p className="text-caption text-neutral-400">{p.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="badge-primary text-xs">Family</span>
                      {p.linkedClient && (
                        <span className="text-caption text-neutral-500">
                          Client: {p.linkedClient.firstName} {p.linkedClient.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => openPatientView(p)}
                  className="btn-primary btn-sm flex items-center gap-2 flex-shrink-0">
                  <ExternalLink size={14} /> View Dashboard
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
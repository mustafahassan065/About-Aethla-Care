'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

const COLORS = ['#1B6B8A', '#2DA88A', '#C9A84C', '#EF4444', '#8B5CF6', '#F59E0B']

function StatCard({ label, value, color, isLoading }: {
  label: string; value: string | number; color: string; isLoading?: boolean
}) {
  return (
    <div className="card p-5" style={{ borderLeft: `4px solid ${color}` }}>
      <p className="text-caption text-neutral-400 mb-2">{label}</p>
      {isLoading
        ? <div className="skeleton h-8 w-20 rounded-lg" />
        : <div className="text-3xl font-extrabold font-poppins text-neutral-800 leading-none">{value ?? '—'}</div>
      }
    </div>
  )
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get('/dashboard/stats').then(r => r.data),
    retry: 1,
  })

  const { data: revenue, isLoading: revLoading } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => apiClient.get('/dashboard/revenue').then(r => r.data),
    retry: 1,
  })

  const { data: serviceDistribution } = useQuery({
    queryKey: ['dashboard', 'service-distribution'],
    queryFn: () => apiClient.get('/dashboard/service-distribution').then(r => r.data),
    retry: 1,
  })

  const revenueData = Array.isArray(revenue) ? revenue : []
  const serviceData = Array.isArray(serviceDistribution) ? serviceDistribution : []

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Dashboard</h1>
          <p className="text-body-sm text-neutral-400">
            {new Date().toLocaleDateString('en-QA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn-primary btn-sm">+ New Client</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Clients"      value={stats?.activeClients}   color="#1B6B8A" isLoading={statsLoading} />
        <StatCard label="Staff on Duty"       value={stats?.staffOnDuty}     color="#2DA88A" isLoading={statsLoading} />
        <StatCard label="Open Incidents"      value={stats?.openIncidents}   color="#F59E0B" isLoading={statsLoading} />
        <StatCard label="Revenue (QAR)"       value={stats?.monthlyRevenue ? `${Math.round(stats.monthlyRevenue / 1000)}K` : '—'} color="#8B5CF6" isLoading={statsLoading} />
        <StatCard label="Pending Invoices"    value={stats?.pendingInvoices} color="#C9A84C" isLoading={statsLoading} />
        <StatCard label="Satisfaction Rate"   value={stats?.satisfactionRate ? `${stats.satisfactionRate}%` : '—'} color="#2DA88A" isLoading={statsLoading} />
        <StatCard label="Visits Today"        value={stats?.visitsToday}     color="#1B6B8A" isLoading={statsLoading} />
        <StatCard label="Missed Visits"       value={stats?.missedVisits}    color="#EF4444" isLoading={statsLoading} />
      </div>

      {/* Charts — only show if real data exists */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Revenue Chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-heading-md font-poppins mb-1">Revenue Overview</h3>
          <p className="text-caption text-neutral-400 mb-4">QAR — Monthly revenue vs invoiced</p>
          {revLoading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : revenueData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-body-sm text-neutral-400">
              No revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B6B8A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1B6B8A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gr2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DA88A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2DA88A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`QAR ${v.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="revenue"  stroke="#1B6B8A" strokeWidth={2} fill="url(#gr1)" name="Revenue" />
                <Area type="monotone" dataKey="invoiced" stroke="#2DA88A" strokeWidth={2} fill="url(#gr2)" name="Invoiced" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Service Distribution */}
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-1">Service Distribution</h3>
          <p className="text-caption text-neutral-400 mb-4">Active clients by service type</p>
          {serviceData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-body-sm text-neutral-400">
              No clients yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={serviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="count" strokeWidth={0}>
                    {serviceData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Clients']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {serviceData.map((s: any, i: number) => (
                  <div key={s.service} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-caption text-neutral-600 capitalize">{s.service}</span>
                    </div>
                    <span className="text-caption font-semibold text-neutral-700">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-heading-md font-poppins mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: '/admin/clients/new',         label: 'Add Client'        },
            { href: '/admin/staff/new',            label: 'Add Caregiver'    },
            { href: '/admin/scheduling/new',       label: 'New Schedule'     },
            { href: '/admin/care-notes/new',       label: 'New Care Note'    },
            { href: '/admin/billing/new',          label: 'New Invoice'      },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center justify-center p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center">
              <span className="text-body-sm font-semibold text-neutral-600">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
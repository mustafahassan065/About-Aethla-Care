'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#1B6B8A', '#2DA88A', '#C9A84C', '#EF4444', '#8B5CF6', '#F59E0B']

const revenueData = [
  { month: 'Jan', revenue: 85000, invoiced: 92000 },
  { month: 'Feb', revenue: 92000, invoiced: 98000 },
  { month: 'Mar', revenue: 88000, invoiced: 95000 },
  { month: 'Apr', revenue: 105000, invoiced: 112000 },
  { month: 'May', revenue: 118000, invoiced: 125000 },
  { month: 'Jun', revenue: 132000, invoiced: 140000 },
  { month: 'Jul', revenue: 145000, invoiced: 152000 },
]

const serviceData = [
  { name: 'Elderly Care', value: 35 },
  { name: 'Newborn Care', value: 22 },
  { name: 'Maternity', value: 18 },
  { name: 'Disability', value: 13 },
  { name: 'Wellness', value: 8 },
  { name: 'Telehealth', value: 4 },
]

const staffPerformance = [
  { name: 'Punctuality', value: 94 },
  { name: 'Care Quality', value: 97 },
  { name: 'Documentation', value: 89 },
  { name: 'Communication', value: 92 },
  { name: 'Client Rating', value: 98 },
]

const recentActivity = [
  { type: 'visit',    icon: '✅', message: 'Maria Santos completed visit for Ahmed Al-Rashid', time: '2m ago', color: 'text-green-600' },
  { type: 'incident', icon: '⚠️', message: 'Minor incident reported for client #C-1042', time: '18m ago', color: 'text-amber-600' },
  { type: 'checkin',  icon: '📍', message: 'James Dela Cruz checked in at 09:02 AM', time: '32m ago', color: 'text-blue-600' },
  { type: 'invoice',  icon: '🧾', message: 'Invoice #INV-2847 sent to Al-Mansouri family', time: '1h ago', color: 'text-purple-600' },
  { type: 'new',      icon: '🆕', message: 'New client onboarded: Fatima Hassan, Elderly Care', time: '2h ago', color: 'text-primary-500' },
  { type: 'match',    icon: '🤖', message: 'AI matched caregiver for new disability case', time: '3h ago', color: 'text-accent-600' },
]

function StatCard({ label, value, change, icon, color }: { label: string; value: string; change?: string; icon: string; color: string }) {
  const isPositive = change?.startsWith('+')
  return (
    <div className="card p-6" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}15` }}>{icon}</div>
        {change && (
          <span className={`text-caption font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-extrabold font-poppins text-neutral-800 leading-none mb-1">{value}</div>
      <div className="text-caption text-neutral-400">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Dashboard</h1>
          <p className="text-body-sm text-neutral-400">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 rounded-xl p-1">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-caption font-semibold capitalize transition-all ${
                  period === p ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Link href="/admin/clients/new" className="btn-primary btn-sm">+ New Client</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Clients" value="284" change="+12" icon="👥" color="#1B6B8A" />
        <StatCard label="Staff on Duty" value="47" icon="🏃" color="#2DA88A" />
        <StatCard label="Open Incidents" value="3" change="-2" icon="⚠️" color="#F59E0B" />
        <StatCard label="Monthly Revenue" value="QAR 132K" change="+18%" icon="💰" color="#8B5CF6" />
        <StatCard label="Missed Visits" value="2" change="-1" icon="❌" color="#EF4444" />
        <StatCard label="Pending Invoices" value="18" icon="🧾" color="#C9A84C" />
        <StatCard label="Satisfaction Rate" value="98%" change="+1%" icon="⭐" color="#2DA88A" />
        <StatCard label="Visits Today" value="63" change="+5" icon="📍" color="#1B6B8A" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Revenue chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-heading-md font-poppins">Revenue Overview</h3>
              <p className="text-caption text-neutral-400">QAR — Revenue vs Invoiced</p>
            </div>
            <span className="badge-accent">↑ 18% vs last month</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B6B8A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B6B8A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DA88A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2DA88A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip formatter={(v: number) => [`QAR ${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#1B6B8A" strokeWidth={2} fill="url(#colorRev)" name="Revenue" />
              <Area type="monotone" dataKey="invoiced" stroke="#2DA88A" strokeWidth={2} fill="url(#colorInv)" name="Invoiced" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service distribution */}
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-2">Service Distribution</h3>
          <p className="text-caption text-neutral-400 mb-4">Active clients by service type</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {serviceData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-3">
            {serviceData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-caption text-neutral-600">{s.name}</span>
                </div>
                <span className="text-caption font-semibold text-neutral-700">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Staff performance */}
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-6">Staff Performance KPIs</h3>
          <div className="flex flex-col gap-4">
            {staffPerformance.map((kpi) => (
              <div key={kpi.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-body-sm text-neutral-600">{kpi.name}</span>
                  <span className="text-body-sm font-bold font-poppins text-neutral-800">{kpi.value}%</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${kpi.value}%`, background: kpi.value >= 95 ? '#2DA88A' : kpi.value >= 90 ? '#1B6B8A' : '#F59E0B' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-heading-md font-poppins">Recent Activity</h3>
            <Link href="/admin/reports" className="text-body-sm text-primary-500 hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <span className="text-xl flex-shrink-0 mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-neutral-700 leading-snug">{a.message}</p>
                  <span className="text-caption text-neutral-400">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h3 className="text-heading-md font-poppins mb-5">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: '/admin/clients/new',    icon: '👤', label: 'New Client'   },
            { href: '/admin/staff/new',      icon: '🏃', label: 'Add Staff'    },
            { href: '/admin/scheduling',     icon: '📅', label: 'Scheduling'   },
            { href: '/admin/care-notes',     icon: '📝', label: 'Care Notes'   },
            { href: '/admin/billing',        icon: '🧾', label: 'Billing'      },
            { href: '/admin/reports',        icon: '📊', label: 'Reports'      },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-caption font-semibold text-neutral-600">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

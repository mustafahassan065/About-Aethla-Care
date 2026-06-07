'use client'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
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

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => apiClient.get('/dashboard/alerts').then(r => r.data),
    retry: 1,
  })

  const chartData = Array.isArray(revenue) ? revenue : []
  const hasRevenue = chartData.length > 0

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Live operational performance metrics"
        action={
          <button className="btn-primary btn-sm" onClick={() => window.print()}>
            Export Report
          </button>
        }
      />

      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Clients',   value: stats?.activeClients,   color: '#1B6B8A' },
          { label: 'Staff on Duty',    value: stats?.staffOnDuty,     color: '#2DA88A' },
          { label: 'Open Incidents',   value: stats?.openIncidents,   color: '#F59E0B' },
          { label: 'Pending Invoices', value: stats?.pendingInvoices, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="card p-5" style={{ borderLeft: `4px solid ${s.color}` }}>
            <p className="text-caption text-neutral-400 mb-1">{s.label}</p>
            {statsLoading
              ? <div className="skeleton h-7 w-16 rounded" />
              : <div className="text-2xl font-extrabold font-poppins text-neutral-800">{s.value ?? '—'}</div>
            }
          </div>
        ))}
      </div>

      {/* Revenue Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-1">Monthly Visits</h3>
          <p className="text-caption text-neutral-400 mb-4">Total visits completed per month</p>
          {revLoading ? (
            <div className="skeleton h-52 rounded-xl" />
          ) : !hasRevenue ? (
            <div className="h-52 flex items-center justify-center text-body-sm text-neutral-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="visits" fill="#1B6B8A" radius={[4,4,0,0]} name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-1">Revenue Trend (QAR)</h3>
          <p className="text-caption text-neutral-400 mb-4">Monthly revenue over time</p>
          {revLoading ? (
            <div className="skeleton h-52 rounded-xl" />
          ) : !hasRevenue ? (
            <div className="h-52 flex items-center justify-center text-body-sm text-neutral-400">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`QAR ${v.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#2DA88A" strokeWidth={2} dot={{ fill: '#2DA88A', r: 3 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Alerts from API */}
      <div className="card p-6">
        <h3 className="text-heading-md font-poppins mb-4">Current Alerts</h3>
        {alertsLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        ) : !alerts ? (
          <p className="text-body-sm text-neutral-400">Could not load alerts</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl p-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <div className="text-2xl font-extrabold font-poppins text-red-600">{alerts.overdueInvoices ?? 0}</div>
              <p className="text-body-sm text-red-500 mt-1">Overdue Invoices</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <div className="text-2xl font-extrabold font-poppins text-orange-600">{alerts.criticalIncidents ?? 0}</div>
              <p className="text-body-sm text-orange-500 mt-1">Critical Incidents</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <div className="text-2xl font-extrabold font-poppins text-blue-600">{alerts.missedVisits ?? 0}</div>
              <p className="text-body-sm text-blue-500 mt-1">Missed Visits Today</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
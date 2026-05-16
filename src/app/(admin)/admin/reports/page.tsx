'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
const monthlyData = [
  { month: 'Jan', visits: 320, revenue: 85000 }, { month: 'Feb', visits: 348, revenue: 92000 },
  { month: 'Mar', visits: 335, revenue: 88000 }, { month: 'Apr', visits: 390, revenue: 105000 },
  { month: 'May', visits: 425, revenue: 118000 },
]
export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Reports & Analytics</h1>
          <p className="text-body-sm text-neutral-400">Performance metrics and operational insights</p>
        </div>
        <button className="btn-primary btn-sm">📥 Export Report</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-2">Monthly Visits</h3>
          <p className="text-caption text-neutral-400 mb-4">Total care visits completed</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="visits" fill="#1B6B8A" radius={[6,6,0,0]} name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-2">Revenue Trend</h3>
          <p className="text-caption text-neutral-400 mb-4">Monthly revenue in QAR</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}K`} />
              <Tooltip formatter={(v: number) => [`QAR ${v.toLocaleString()}`, '']} />
              <Line type="monotone" dataKey="revenue" stroke="#2DA88A" strokeWidth={3} dot={{ fill: '#2DA88A', r: 5 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-4">Key Performance Metrics</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Visit Completion Rate', value: 97.2, target: 95 },
              { label: 'On-Time Arrival Rate', value: 94.1, target: 90 },
              { label: 'Family Satisfaction', value: 98.0, target: 95 },
              { label: 'Documentation Compliance', value: 91.5, target: 90 },
            ].map(kpi => (
              <div key={kpi.label}>
                <div className="flex justify-between mb-1"><span className="text-body-sm text-neutral-600">{kpi.label}</span><span className="text-body-sm font-bold font-poppins">{kpi.value}%</span></div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${kpi.value}%`, background: kpi.value >= kpi.target ? '#2DA88A' : '#EF4444' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-heading-md font-poppins mb-4">Incident Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total This Month', value: '8', color: '#1B6B8A' },
              { label: 'Resolved', value: '6', color: '#2DA88A' },
              { label: 'Open', value: '3', color: '#F59E0B' },
              { label: 'Critical', value: '0', color: '#EF4444' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                <div className="text-2xl font-extrabold font-poppins" style={{ color: s.color }}>{s.value}</div>
                <div className="text-caption text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

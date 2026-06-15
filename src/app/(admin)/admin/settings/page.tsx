'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/auth'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'

const tabs = ['General', 'Users & Roles', 'Notifications', 'Security', 'Billing']

const roles = [
  { role: 'admin',       label: 'Admin',          desc: 'Full system access — all modules, settings, and data.' },
  { role: 'coordinator', label: 'Coordinator',     desc: 'Scheduling and client management access.' },
  { role: 'caregiver',   label: 'Caregiver',       desc: 'Care delivery access — own schedule, clients, care notes.' },
  { role: 'family',      label: 'Family Member',   desc: 'Portal access — view schedules, notes, billing for their client only.' },
  { role: 'accountant',  label: 'Accountant',      desc: 'Finance module — invoices, expenses, payroll, reports.' },
]

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('General')
  const [saving, setSaving] = useState(false)

  const [general, setGeneral] = useState({
    companyName: 'Aethla Care',
    phone: '+974 4000 0000',
    emergencyPhone: '+974 6000 0000',
    email: 'info@aethlacare.com',
    address: 'West Bay, Doha, Qatar',
    currency: 'QAR',
    timezone: 'Asia/Qatar',
    language: 'en',
  })

  const [notifications, setNotifications] = useState({
    emailOnNewClient:    true,
    emailOnIncident:     true,
    emailOnMissedVisit:  true,
    emailOnNewConsult:   true,
    smsOnCheckIn:        false,
    smsOnIncident:       true,
  })

  const [security, setSecurity] = useState({
    sessionTimeout: '60',
    mfaRequired:    false,
    passwordExpiry: '90',
    auditLogs:      true,
  })

  const handleSave = async (section: string) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success(`${section} settings saved`)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
              activeTab === t
                ? 'text-primary-500 border-primary-500 bg-primary-50'
                : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'General' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-5">General Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company Name</label>
                <input value={general.companyName} onChange={e => setGeneral(p => ({ ...p, companyName: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">Currency</label>
                <select value={general.currency} onChange={e => setGeneral(p => ({ ...p, currency: e.target.value }))} className="form-input">
                  <option value="QAR">QAR — Qatari Riyal</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Main Phone</label>
                <input value={general.phone} onChange={e => setGeneral(p => ({ ...p, phone: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">Emergency Phone</label>
                <input value={general.emergencyPhone} onChange={e => setGeneral(p => ({ ...p, emergencyPhone: e.target.value }))} className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input type="email" value={general.email} onChange={e => setGeneral(p => ({ ...p, email: e.target.value }))} className="form-input" />
            </div>
            <div>
              <label className="form-label">Office Address</label>
              <input value={general.address} onChange={e => setGeneral(p => ({ ...p, address: e.target.value }))} className="form-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Timezone</label>
                <select value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))} className="form-input">
                  <option value="Asia/Qatar">Asia/Qatar (GMT+3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="form-label">Default Language</label>
                <select value={general.language} onChange={e => setGeneral(p => ({ ...p, language: e.target.value }))} className="form-input">
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>
            <button onClick={() => handleSave('General')} disabled={saving} className="btn-primary btn-lg">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Users & Roles */}
      {activeTab === 'Users & Roles' && (
        <div className="max-w-3xl space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">User Roles & Permissions</h3>
            <div className="flex flex-col gap-3">
              {roles.map(r => (
                <div key={r.role} className="flex items-start justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <div>
                    <p className="text-body-sm font-bold font-poppins text-neutral-800">{r.label}</p>
                    <p className="text-body-sm text-neutral-500 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="badge-primary capitalize text-xs flex-shrink-0 ml-4">{r.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-4">Current Admin</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-poppins">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-neutral-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-caption text-neutral-500">{user?.email} &middot; <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'Notifications' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-5">Notification Preferences</h3>
          <div className="space-y-4">
            <p className="text-caption text-neutral-400 uppercase tracking-wider">Email Notifications</p>
            {[
              { key: 'emailOnNewClient',   label: 'New client registered' },
              { key: 'emailOnIncident',    label: 'Incident reported' },
              { key: 'emailOnMissedVisit', label: 'Missed visit detected' },
              { key: 'emailOnNewConsult',  label: 'New consultation request from website' },
            ].map(n => (
              <label key={n.key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                <span className="text-body-sm font-medium text-neutral-700">{n.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[n.key as keyof typeof notifications] as boolean}
                  onChange={e => setNotifications(p => ({ ...p, [n.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500"
                />
              </label>
            ))}

            <p className="text-caption text-neutral-400 uppercase tracking-wider mt-4">SMS Notifications</p>
            {[
              { key: 'smsOnCheckIn',   label: 'Caregiver check-in/out confirmation' },
              { key: 'smsOnIncident',  label: 'Critical incident alert' },
            ].map(n => (
              <label key={n.key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                <span className="text-body-sm font-medium text-neutral-700">{n.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[n.key as keyof typeof notifications] as boolean}
                  onChange={e => setNotifications(p => ({ ...p, [n.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500"
                />
              </label>
            ))}

            <button onClick={() => handleSave('Notifications')} disabled={saving} className="btn-primary btn-lg mt-2">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'Security' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-5">Security Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Session Timeout (minutes)</label>
                <select value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} className="form-input">
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <div>
                <label className="form-label">Password Expiry (days)</label>
                <select value={security.passwordExpiry} onChange={e => setSecurity(p => ({ ...p, passwordExpiry: e.target.value }))} className="form-input">
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>

            {[
              { key: 'mfaRequired', label: 'Require MFA for all admin users',         hint: 'Multi-factor authentication adds an extra layer of security.' },
              { key: 'auditLogs',   label: 'Enable audit logs',                        hint: 'Record all user actions for compliance and security review.' },
            ].map(s => (
              <label key={s.key} className="flex items-start justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors gap-4">
                <div>
                  <p className="text-body-sm font-medium text-neutral-700">{s.label}</p>
                  <p className="text-caption text-neutral-400 mt-0.5">{s.hint}</p>
                </div>
                <input
                  type="checkbox"
                  checked={security[s.key as keyof typeof security] as boolean}
                  onChange={e => setSecurity(p => ({ ...p, [s.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500 flex-shrink-0 mt-0.5"
                />
              </label>
            ))}

            <div className="p-4 rounded-2xl" style={{ background: 'var(--color-primary-light)', border: '1px solid rgba(27,107,138,0.15)' }}>
              <p className="text-body-sm font-semibold text-primary-700 mb-1">Security Standards</p>
              <p className="text-body-sm text-neutral-600">This platform is built to HIPAA-inspired standards with SSL encryption, end-to-end encrypted communications, role-based access control, and secure automated backups.</p>
            </div>

            <button onClick={() => handleSave('Security')} disabled={saving} className="btn-primary btn-lg">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Billing Settings */}
      {activeTab === 'Billing' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-5">Billing Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Default VAT Rate (%)</label>
              <input type="number" defaultValue={5} className="form-input w-40" />
              <p className="text-caption text-neutral-400 mt-1">Qatar VAT rate — applied to all invoices automatically.</p>
            </div>
            <div>
              <label className="form-label">Invoice Prefix</label>
              <input type="text" defaultValue="INV" className="form-input w-40" />
            </div>
            <div>
              <label className="form-label">Default Payment Terms (days)</label>
              <select className="form-input w-auto">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <div>
              <label className="form-label">Bank Details (shown on invoices)</label>
              <textarea className="form-input min-h-[80px] resize-y" defaultValue="Bank: Qatar National Bank&#10;Account: 0000 0000 0000&#10;IBAN: QA00 QNBA 0000 0000 0000 0000 0000" />
            </div>
            <button onClick={() => handleSave('Billing')} disabled={saving} className="btn-primary btn-lg">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
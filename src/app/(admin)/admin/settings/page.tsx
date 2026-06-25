'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'
import { PageHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const tabs = ['General', 'Users & Roles', 'Notifications', 'Security', 'Billing']

const roles = [
  { role: 'admin',       label: 'Admin',         desc: 'Full system access — all modules, settings, and data.' },
  { role: 'coordinator', label: 'Coordinator',    desc: 'Scheduling and client management access.' },
  { role: 'caregiver',   label: 'Caregiver',      desc: 'Care delivery — own schedule, clients, care notes.' },
  { role: 'family',      label: 'Family Member',  desc: 'Portal access — view schedules, notes, billing for their client only.' },
  { role: 'accountant',  label: 'Accountant',     desc: 'Finance module — invoices, expenses, payroll, reports.' },
]

export default function SettingsPage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('General')

  // ── General Settings ──────────────────────────────────────
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.get('/settings').then(r => r.data),
  })

  const [general, setGeneral] = useState({
    companyName:    'Aethla Care',
    phone:          '+974 4000 0000',
    emergencyPhone: '+974 6000 0000',
    email:          'info@aethlacare.com',
    whatsappNumber: '97440000000',
    address:        'West Bay, Doha, Qatar',
    currency:       'QAR',
    timezone:       'Asia/Qatar',
  })

  useEffect(() => {
    if (settings) {
      setGeneral({
        companyName:    settings.companyName    || 'Aethla Care',
        phone:          settings.phone          || '+974 4000 0000',
        emergencyPhone: settings.emergencyPhone || '+974 6000 0000',
        email:          settings.email          || 'info@aethlacare.com',
        whatsappNumber: settings.whatsappNumber || '97440000000',
        address:        settings.address        || 'West Bay, Doha, Qatar',
        currency:       settings.currency       || 'QAR',
        timezone:       settings.timezone       || 'Asia/Qatar',
      })
    }
  }, [settings])

  const updateMutation = useMutation({
    mutationFn: (dto: any) => apiClient.patch('/settings', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings saved — website will reflect changes automatically')
    },
    onError: () => toast.error('Failed to save settings'),
  })

  // ── Notifications ─────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    emailOnNewClient:   true,
    emailOnIncident:    true,
    emailOnMissedVisit: true,
    emailOnNewConsult:  true,
    smsOnCheckIn:       false,
    smsOnIncident:      true,
  })

  // ── Security ──────────────────────────────────────────────
  const [security, setSecurity] = useState({
    sessionTimeout: '60',
    mfaRequired:    false,
    passwordExpiry: '90',
    auditLogs:      true,
  })

  // Master Admin credentials
  const [showPw, setShowPw]         = useState(false)
  const [showNewPw, setShowNewPw]   = useState(false)
  const [savingCreds, setSavingCreds] = useState(false)
  const [adminForm, setAdminForm]   = useState({
    email:           '',
    newPassword:     '',
    confirmPassword: '',
  })

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (adminForm.newPassword && adminForm.newPassword !== adminForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (adminForm.newPassword && adminForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    const dto: any = {}
    if (adminForm.email)       dto.email    = adminForm.email
    if (adminForm.newPassword) dto.password = adminForm.newPassword
    if (!dto.email && !dto.password) {
      toast.error('Enter new email or password to update')
      return
    }
    setSavingCreds(true)
    try {
      await apiClient.patch(`/users/${user?._id}`, dto)
      toast.success('Admin credentials updated — please log in again with the new details')
      setAdminForm({ email: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error('Failed to update credentials')
    } finally {
      setSavingCreds(false)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-body-sm font-semibold rounded-t-xl transition-all -mb-px border-b-2 whitespace-nowrap ${
              activeTab === t
                ? 'text-primary-500 border-primary-500 bg-primary-50'
                : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}>{t}</button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'General' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-2">General Settings</h3>
          <p className="text-body-sm text-neutral-400 mb-5">
            Changes here are reflected on the website footer, contact page, and WhatsApp button automatically.
          </p>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : (
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
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Main Phone</label>
                  <input value={general.phone} onChange={e => setGeneral(p => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+974 4000 0000" />
                </div>
                <div>
                  <label className="form-label">Emergency Phone</label>
                  <input value={general.emergencyPhone} onChange={e => setGeneral(p => ({ ...p, emergencyPhone: e.target.value }))} className="form-input" placeholder="+974 6000 0000" />
                </div>
              </div>
              <div>
                <label className="form-label">WhatsApp Number <span className="text-caption text-neutral-400">(numbers only, no + or spaces)</span></label>
                <input value={general.whatsappNumber} onChange={e => setGeneral(p => ({ ...p, whatsappNumber: e.target.value }))} className="form-input" placeholder="97440000000" />
                <p className="text-caption text-neutral-400 mt-1">Used for the WhatsApp chat button on the website</p>
              </div>
              <div>
                <label className="form-label">Contact Email</label>
                <input type="email" value={general.email} onChange={e => setGeneral(p => ({ ...p, email: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">Office Address</label>
                <input value={general.address} onChange={e => setGeneral(p => ({ ...p, address: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">Timezone</label>
                <select value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))} className="form-input">
                  <option value="Asia/Qatar">Asia/Qatar (GMT+3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-body-sm text-blue-700 font-semibold mb-1">What updates automatically:</p>
                <ul className="text-body-sm text-blue-600 flex flex-col gap-1">
                  <li>Website footer — phone, email, address</li>
                  <li>WhatsApp button — uses WhatsApp number</li>
                  <li>Contact page — email and phone</li>
                  <li>Emergency care line — emergency phone</li>
                </ul>
              </div>
              <button onClick={() => updateMutation.mutate(general)} disabled={updateMutation.isPending} className="btn-primary btn-lg">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Users & Roles */}
      {activeTab === 'Users & Roles' && (
        <div className="max-w-3xl space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">User Roles & Permissions</h3>
            <div className="flex flex-col gap-3">
              {roles.map(r => (
                <div key={r.role} className="flex items-start justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition-colors gap-4">
                  <div>
                    <p className="text-body-sm font-bold font-poppins text-neutral-800">{r.label}</p>
                    <p className="text-body-sm text-neutral-500 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="badge-primary capitalize text-xs flex-shrink-0 ml-4">{r.role}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
              <p className="text-body-sm text-primary-700">To manage users and assign roles, go to <strong>Users & Access</strong> from the sidebar.</p>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-3">Current User</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-poppins">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-neutral-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-caption text-neutral-500">{user?.email} · <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'Notifications' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-heading-md font-poppins mb-5">Notification Preferences</h3>
          <div className="space-y-3">
            <p className="text-caption text-neutral-400 uppercase tracking-wider">Email Notifications</p>
            {[
              { key: 'emailOnNewClient',   label: 'New client registered'                     },
              { key: 'emailOnIncident',    label: 'Incident reported'                         },
              { key: 'emailOnMissedVisit', label: 'Missed visit detected'                     },
              { key: 'emailOnNewConsult',  label: 'New consultation request from website'     },
            ].map(n => (
              <label key={n.key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                <span className="text-body-sm font-medium text-neutral-700">{n.label}</span>
                <input type="checkbox"
                  checked={notifications[n.key as keyof typeof notifications] as boolean}
                  onChange={e => setNotifications(p => ({ ...p, [n.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500" />
              </label>
            ))}
            <p className="text-caption text-neutral-400 uppercase tracking-wider mt-4">SMS Notifications</p>
            {[
              { key: 'smsOnCheckIn',  label: 'Caregiver check-in/out confirmation' },
              { key: 'smsOnIncident', label: 'Critical incident alert'              },
            ].map(n => (
              <label key={n.key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                <span className="text-body-sm font-medium text-neutral-700">{n.label}</span>
                <input type="checkbox"
                  checked={notifications[n.key as keyof typeof notifications] as boolean}
                  onChange={e => setNotifications(p => ({ ...p, [n.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500" />
              </label>
            ))}
            <button onClick={() => toast.success('Notification preferences saved')} className="btn-primary btn-lg mt-2">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'Security' && (
        <div className="space-y-6 max-w-2xl">

          {/* Master Admin Credentials */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-2">Master Admin Login</h3>
            <p className="text-body-sm text-neutral-400 mb-5">
              Change the master admin email and/or password. Changes update the database immediately.
            </p>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 mb-5">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-poppins text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-neutral-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-caption text-neutral-500">{user?.email} · <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>

            <form onSubmit={handleAdminUpdate} className="space-y-4">
              <div>
                <label className="form-label">New Email Address <span className="text-caption text-neutral-400">(leave blank to keep current)</span></label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={e => setAdminForm(p => ({ ...p, email: e.target.value }))}
                  className="form-input"
                  placeholder="newemail@aethlacare.com"
                />
              </div>
              <div>
                <label className="form-label">New Password <span className="text-caption text-neutral-400">(leave blank to keep current)</span></label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={adminForm.newPassword}
                    onChange={e => setAdminForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="form-input pr-10"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={adminForm.confirmPassword}
                    onChange={e => setAdminForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="form-input pr-10"
                    placeholder="Repeat new password"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-caption text-amber-700 font-semibold">
                  After changing credentials, you will be logged out and must sign in again with the new details.
                </p>
              </div>
              <button type="submit" disabled={savingCreds} className="btn-primary btn-lg">
                {savingCreds ? 'Updating...' : 'Update Admin Credentials'}
              </button>
            </form>
          </div>

          {/* Other Security Settings */}
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Security Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Session Timeout</label>
                  <select value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} className="form-input">
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Password Expiry</label>
                  <select value={security.passwordExpiry} onChange={e => setSecurity(p => ({ ...p, passwordExpiry: e.target.value }))} className="form-input">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              {[
                { key: 'auditLogs',   label: 'Enable audit logs',           hint: 'Record all user actions for compliance.' },
                { key: 'mfaRequired', label: 'Require MFA for admin users',  hint: 'Multi-factor authentication for extra security.' },
              ].map(s => (
                <label key={s.key} className="flex items-start justify-between p-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors gap-4">
                  <div>
                    <p className="text-body-sm font-medium text-neutral-700">{s.label}</p>
                    <p className="text-caption text-neutral-400 mt-0.5">{s.hint}</p>
                  </div>
                  <input type="checkbox"
                    checked={security[s.key as keyof typeof security] as boolean}
                    onChange={e => setSecurity(p => ({ ...p, [s.key]: e.target.checked }))}
                    className="w-5 h-5 rounded accent-primary-500 flex-shrink-0" />
                </label>
              ))}
              <div className="p-4 rounded-2xl" style={{ background: 'var(--color-primary-light)' }}>
                <p className="text-body-sm text-primary-700">Platform is built to HIPAA-inspired standards with SSL encryption, role-based access control, and secure automated backups.</p>
              </div>
              <button onClick={() => toast.success('Security settings saved')} className="btn-primary btn-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
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
              <textarea className="form-input min-h-[80px] resize-y"
                defaultValue="Bank: Qatar National Bank&#10;Account: 0000 0000 0000&#10;IBAN: QA00 QNBA 0000 0000 0000 0000 0000" />
            </div>
            <button onClick={() => toast.success('Billing settings saved')} className="btn-primary btn-lg">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}
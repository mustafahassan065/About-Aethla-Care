'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'

type Tab = 'login' | 'signup'

const accountTypes = [
  { value: 'patient',        label: 'Patient',        desc: 'I am registering for myself'          },
  { value: 'guardian',       label: 'Guardian',       desc: 'I am a parent or legal guardian'      },
  { value: 'carer',          label: 'Carer',          desc: 'I am a family carer'                  },
  { value: 'representative', label: 'Representative', desc: 'I represent this patient'              },
]

export default function PatientPortalPage() {
  const [tab, setTab]         = useState<Tab>('login')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const { login, isLoading }  = useAuthStore()
  const router                = useRouter()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    accountType: '',
    patientFirstName: '', patientLastName: '',
    relationship: '',
    isSelf: true,
  })

  const setLogin  = (k: string, v: string) => setLoginForm(p => ({ ...p, [k]: v }))
  const setSignup = (k: string, v: string | boolean) => setSignupForm(p => ({ ...p, [k]: v }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { role } = await login(loginForm.email, loginForm.password)
      if (role === 'family') {
        router.replace('/portal/dashboard')
      } else if (role === 'caregiver' || role === 'coordinator') {
        router.replace('/employee/dashboard')
      } else if (role === 'admin' || role === 'accountant') {
        router.replace('/admin/dashboard')
      } else {
        setError('Access denied.')
        useAuthStore.getState().logout()
      }
    } catch {
      setError('Invalid email or password. Please try again.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!signupForm.accountType) { setError('Please select your account type.'); return }
    if (signupForm.password !== signupForm.confirmPassword) { setError('Passwords do not match.'); return }
    if (!signupForm.isSelf && (!signupForm.patientFirstName || !signupForm.relationship)) {
      setError('Please fill in all patient details and your relationship.')
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/patient-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:        signupForm.firstName,
          lastName:         signupForm.lastName,
          email:            signupForm.email,
          phone:            signupForm.phone,
          password:         signupForm.password,
          accountType:      signupForm.accountType,
          isSelf:           signupForm.isSelf,
          patientFirstName: signupForm.isSelf ? signupForm.firstName : signupForm.patientFirstName,
          patientLastName:  signupForm.isSelf ? signupForm.lastName  : signupForm.patientLastName,
          relationship:     signupForm.isSelf ? 'self' : signupForm.relationship,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #1A4A35 60%, #2DA88A 100%)' }}>
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(45,168,138,0.1)' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-heading-xl font-poppins text-neutral-800 mb-3">Registration Submitted</h2>
          <p className="text-body-md text-neutral-500 mb-2">Your account request is pending approval from our care coordinator.</p>
          <p className="text-body-sm text-neutral-400 mb-6">You will receive an email at <strong>{signupForm.email}</strong> once approved.</p>
          <button onClick={() => { setSuccess(false); setTab('login') }} className="btn-outline btn-sm">Back to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #1A4A35 60%, #2DA88A 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Patient Portal</h1>
          <p className="text-white/55 text-body-sm">Aethla Care · Secure Patient Access</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-neutral-100">
            {(['login', 'signup'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-4 text-body-sm font-semibold transition-all ${
                  tab === t ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50' : 'text-neutral-500 hover:text-neutral-700'
                }`}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="email" value={loginForm.email} onChange={e => setLogin('email', e.target.value)}
                      className="form-input pl-10" placeholder="your@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type={showPw ? 'text' : 'password'} value={loginForm.password}
                      onChange={e => setLogin('password', e.target.value)}
                      className="form-input pl-10 pr-10" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-body-sm text-red-600">{error}</p></div>}
                <button type="submit" disabled={isLoading} className="btn-primary btn-lg w-full">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                <p className="text-caption text-neutral-400 text-center">
                  <Link href="/portal/forgot-password" className="text-primary-500 hover:underline">Forgot password?</Link>
                </p>
                <p className="text-caption text-neutral-400 text-center">
                  No account?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="text-primary-500 hover:underline font-semibold">Create one here</button>
                </p>
              </form>
            )}

            {/* SIGNUP */}
            {tab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Account Type */}
                <div>
                  <label className="form-label">I am registering as <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {accountTypes.map(t => (
                      <button key={t.value} type="button"
                        onClick={() => { setSignup('accountType', t.value); setSignup('isSelf', t.value === 'patient') }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          signupForm.accountType === t.value ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                        }`}>
                        <p className={`text-body-sm font-bold font-poppins ${signupForm.accountType === t.value ? 'text-primary-500' : 'text-neutral-700'}`}>{t.label}</p>
                        <p className="text-caption text-neutral-400 mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Your details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Your First Name <span className="text-red-500">*</span></label>
                    <input value={signupForm.firstName} onChange={e => setSignup('firstName', e.target.value)}
                      className="form-input" placeholder="Ahmed" required />
                  </div>
                  <div>
                    <label className="form-label">Your Last Name <span className="text-red-500">*</span></label>
                    <input value={signupForm.lastName} onChange={e => setSignup('lastName', e.target.value)}
                      className="form-input" placeholder="Al-Rashid" required />
                  </div>
                </div>

                {/* Patient details if not self */}
                {signupForm.accountType && signupForm.accountType !== 'patient' && (
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(27,107,138,0.06)', border: '1px solid rgba(27,107,138,0.15)' }}>
                    <p className="text-body-sm font-semibold text-primary-600 mb-3">Patient Details</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="form-label">Patient First Name <span className="text-red-500">*</span></label>
                        <input value={signupForm.patientFirstName} onChange={e => setSignup('patientFirstName', e.target.value)}
                          className="form-input" placeholder="Patient name" required />
                      </div>
                      <div>
                        <label className="form-label">Patient Last Name <span className="text-red-500">*</span></label>
                        <input value={signupForm.patientLastName} onChange={e => setSignup('patientLastName', e.target.value)}
                          className="form-input" placeholder="Family name" required />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Your Relationship to Patient <span className="text-red-500">*</span></label>
                      <input value={signupForm.relationship} onChange={e => setSignup('relationship', e.target.value)}
                        className="form-input" placeholder="e.g. Mother, Son, Spouse, Legal Guardian..." required />
                    </div>
                  </div>
                )}

                <div>
                  <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="email" value={signupForm.email} onChange={e => setSignup('email', e.target.value)}
                      className="form-input pl-10" placeholder="your@email.com" required />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="tel" value={signupForm.phone} onChange={e => setSignup('phone', e.target.value)}
                      className="form-input pl-10" placeholder="+974 5500 0000" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Password <span className="text-red-500">*</span></label>
                    <input type="password" value={signupForm.password} onChange={e => setSignup('password', e.target.value)}
                      className="form-input" placeholder="Min. 8 chars" required minLength={8} />
                  </div>
                  <div>
                    <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                    <input type="password" value={signupForm.confirmPassword} onChange={e => setSignup('confirmPassword', e.target.value)}
                      className="form-input" placeholder="Repeat" required />
                  </div>
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-body-sm text-red-600">{error}</p></div>}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-caption text-amber-700">Your account will be reviewed and activated by our care coordinator within 24 hours.</p>
                </div>

                <button type="submit" className="btn-primary btn-lg w-full">Submit Registration</button>
                <p className="text-caption text-neutral-400 text-center">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-primary-500 hover:underline font-semibold">Sign in here</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
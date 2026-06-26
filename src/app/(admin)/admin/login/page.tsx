'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Phone, Shield } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'

type Tab = 'login' | 'signup'

export default function AdminLoginPage() {
  const [tab, setTab]           = useState<Tab>('login')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [showPin, setShowPin]   = useState(false)
  const [pin, setPin]           = useState('')
  const [pinError, setPinError] = useState('')
  const [pinLoading, setPinLoading] = useState(false)

  const { login, isLoading } = useAuthStore()
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { role } = await login(loginForm.email, loginForm.password)

      // Get user from store — typed as any to avoid isSuperAdmin TS error
      const storeUser = useAuthStore.getState().user as any

      if (role === 'admin' || role === 'coordinator' || role === 'accountant') {
        // Super admin — show PIN prompt
        if (storeUser?.isSuperAdmin === true) {
          setShowPin(true)
          return
        }
        router.replace('/admin/dashboard')
      } else if (role === 'caregiver') {
        router.replace('/employee/dashboard')
      } else if (role === 'family') {
        router.replace('/portal/dashboard')
      } else {
        setError('Access denied.')
        useAuthStore.getState().logout()
      }
    } catch {
      setError('Invalid email or password. Please try again.')
    }
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError('')
    setPinLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setPinError('Incorrect PIN. Try again.')
        setPin('')
        return
      }
      sessionStorage.setItem('superAdminVerified', 'true')
      router.replace('/admin/dashboard')
    } catch {
      setPinError('PIN verification failed. Please try again.')
    } finally {
      setPinLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (signupForm.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/admin-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signupForm.firstName,
          lastName:  signupForm.lastName,
          email:     signupForm.email,
          phone:     signupForm.phone,
          password:  signupForm.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  // PIN Modal
  if (showPin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #134F66 60%, #1B6B8A 100%)' }}>
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(27,107,138,0.1)' }}>
            <Shield size={28} style={{ color: '#1B6B8A' }} />
          </div>
          <h2 className="text-heading-xl font-poppins text-neutral-800 mb-2">Super Admin PIN</h2>
          <p className="text-body-sm text-neutral-500 mb-6">
            Enter your PIN to access super admin features. You can skip to continue with standard admin access.
          </p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="form-input text-center text-2xl tracking-widest"
              placeholder="• • • •"
              maxLength={8}
              autoComplete="off"
              autoFocus
            />
            {pinError && <p className="text-body-sm text-red-500">{pinError}</p>}
            <button type="submit" disabled={pinLoading || !pin} className="btn-primary btn-lg w-full">
              {pinLoading ? 'Verifying...' : 'Verify PIN'}
            </button>
            <button type="button" onClick={() => router.replace('/admin/dashboard')}
              className="text-body-sm text-neutral-400 hover:text-neutral-600 w-full py-2">
              Skip — Continue as standard admin
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Success
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #134F66 60%, #1B6B8A 100%)' }}>
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(45,168,138,0.1)' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-heading-xl font-poppins text-neutral-800 mb-3">Request Submitted</h2>
          <p className="text-body-md text-neutral-500 mb-2">Your admin access request is pending approval from an existing administrator.</p>
          <p className="text-body-sm text-neutral-400 mb-6">You will be notified at <strong>{signupForm.email}</strong> once reviewed.</p>
          <button onClick={() => { setSuccess(false); setTab('login') }} className="btn-outline btn-sm">Back to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #134F66 60%, #1B6B8A 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Administration Portal</h1>
          <p className="text-white/55 text-body-sm">Aethla Care · Secure Admin Access</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-neutral-100">
            {(['login', 'signup'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-4 text-body-sm font-semibold transition-all ${
                  tab === t ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50' : 'text-neutral-500 hover:text-neutral-700'
                }`}>
                {t === 'login' ? 'Sign In' : 'Request Access'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                {/* Hidden fields to prevent browser autocomplete */}
                <input type="text" style={{ display: 'none' }} autoComplete="username" readOnly />
                <input type="password" style={{ display: 'none' }} autoComplete="new-password" readOnly />

                <div>
                  <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      className="form-input pl-10"
                      placeholder="admin@aethlacare.com"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      className="form-input pl-10 pr-10"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
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
                  Need admin access?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="text-primary-500 hover:underline font-semibold">Request here</button>
                </p>
              </form>
            )}

            {/* SIGNUP */}
            {tab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
                <p className="text-body-sm text-neutral-400 mb-2">Request admin access. Your request will be reviewed by an existing administrator.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">First Name <span className="text-red-500">*</span></label>
                    <input value={signupForm.firstName} onChange={e => setSignupForm(p => ({ ...p, firstName: e.target.value }))}
                      className="form-input" placeholder="Hassan" required autoComplete="off" />
                  </div>
                  <div>
                    <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                    <input value={signupForm.lastName} onChange={e => setSignupForm(p => ({ ...p, lastName: e.target.value }))}
                      className="form-input" placeholder="Ahmed" required autoComplete="off" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="email" value={signupForm.email} onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
                      className="form-input pl-10" placeholder="your@email.com" required autoComplete="off" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="tel" value={signupForm.phone} onChange={e => setSignupForm(p => ({ ...p, phone: e.target.value }))}
                      className="form-input pl-10" placeholder="+974 5500 0000" required autoComplete="off" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Password <span className="text-red-500">*</span></label>
                    <input type="password" value={signupForm.password} onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
                      className="form-input" placeholder="Min. 8 chars" required minLength={8} autoComplete="new-password" />
                  </div>
                  <div>
                    <label className="form-label">Confirm <span className="text-red-500">*</span></label>
                    <input type="password" value={signupForm.confirmPassword} onChange={e => setSignupForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      className="form-input" placeholder="Repeat" required autoComplete="new-password" />
                  </div>
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-body-sm text-red-600">{error}</p></div>}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-caption text-amber-700">Your request will be reviewed by an existing administrator before access is granted.</p>
                </div>
                <button type="submit" className="btn-primary btn-lg w-full">Submit Access Request</button>
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
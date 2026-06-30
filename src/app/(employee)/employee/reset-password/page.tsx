'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const searchParams   = useSearchParams()
  const token          = searchParams.get('token') || ''
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPw, setShowPw]             = useState(false)
  const [success, setSuccess]           = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!token)               { setError('Invalid reset link. Please request a new one.'); return }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #134F66 60%, #1B6B8A 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Employee Portal</h1>
          <p className="text-white/55 text-body-sm">Aethla Care · Set New Password</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(45,168,138,0.1)' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-heading-xl font-poppins text-neutral-800 mb-3">Password Reset!</h2>
              <p className="text-body-sm text-neutral-500 mb-6">Your password has been updated. You can now sign in with your new password.</p>
              <Link href="/employee/login" className="btn-primary btn-sm">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-heading-xl font-poppins text-neutral-800 mb-2">Set New Password</h2>
                <p className="text-body-sm text-neutral-500">Enter your new password below.</p>
              </div>

              {!token && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-body-sm text-red-600">Invalid reset link. Please <Link href="/employee/forgot-password" className="underline">request a new one</Link>.</p>
                </div>
              )}

              <div>
                <label className="form-label">New Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input pl-10 pr-10"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Repeat new password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-body-sm text-red-600">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading || !token} className="btn-primary btn-lg w-full">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <p className="text-caption text-neutral-400 text-center">
                <Link href="/employee/login" className="text-primary-500 hover:underline font-semibold">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
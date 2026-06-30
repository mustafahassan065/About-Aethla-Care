'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #1A4A35 60%, #2DA88A 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Patient Portal</h1>
          <p className="text-white/55 text-body-sm">Aethla Care · Password Reset</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(45,168,138,0.1)' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-heading-xl font-poppins text-neutral-800 mb-3">Check Your Email</h2>
              <p className="text-body-sm text-neutral-500 mb-6">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <Link href="/portal/login" className="btn-primary btn-sm">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-heading-xl font-poppins text-neutral-800 mb-2">Forgot Password</h2>
                <p className="text-body-sm text-neutral-500">Enter your email and we will send you a reset link.</p>
              </div>

              <div>
                <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input pl-10"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-body-sm text-red-600">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-caption text-neutral-400 text-center">
                Remember your password?{' '}
                <Link href="/portal/login" className="text-primary-500 hover:underline font-semibold">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
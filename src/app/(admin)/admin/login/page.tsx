'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuthStore, getPortalByRole } from '@/lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const { login, isLoading }    = useAuthStore()
  const router                  = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { role } = await login(email, password)
      // Redirect based on role — no wrong portal access
      router.replace(getPortalByRole(role))
    } catch {
      setError('Invalid email or password.')
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
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Aethla Care</h1>
          <p className="text-white/55 text-body-sm">Staff Portal — Sign In</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-heading-xl font-poppins text-neutral-800 mb-1">Welcome Back</h2>
          <p className="text-body-sm text-neutral-400 mb-6">
            You will be redirected to your portal after sign in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="form-input pl-10" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-body-sm text-red-600">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary btn-lg w-full mt-2">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-neutral-100">
            <p className="text-caption text-neutral-400 text-center">
              This login works for all staff portals. You will be directed to your assigned area automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@aethlacare.qa')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login — replace with authApi.login()
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #1B6B8A 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Aethla Care</h1>
          <p className="text-white/60 text-body-sm">Admin Portal — Secure Login</p>
        </div>

        <div className="card p-8">
          <h2 className="text-heading-xl text-neutral-800 mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="form-input" placeholder="admin@aethlacare.qa" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="form-input" placeholder="••••••••" />
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-body-sm text-primary-500 hover:underline">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
              {loading ? '⏳ Signing in...' : '🔐 Sign In to Admin Portal'}
            </button>
          </form>
          <p className="text-center text-caption text-neutral-400 mt-5">
            🔒 Encrypted and secured. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

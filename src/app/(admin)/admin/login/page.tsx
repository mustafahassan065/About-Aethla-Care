'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false)
  const { login, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (isAuthenticated) router.push('/admin/dashboard')
  }, [isAuthenticated, router])

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      router.push('/admin/dashboard')
    } catch {
      setError('root', { message: 'Invalid email or password. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #0D2B3E 0%, #1B6B8A 60%, #2DA88A 100%)' }}>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 bg-accent-400" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full opacity-10 bg-primary-300" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>A</div>
          <h1 className="text-3xl font-extrabold font-poppins text-white mb-1">Aethla Care</h1>
          <p className="text-white/55 text-body-sm">Admin Portal · Secure Access</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-heading-xl font-poppins text-neutral-800 mb-1">Welcome Back</h2>
          <p className="text-body-sm text-neutral-400 mb-6">Sign in to manage Aethla Care operations</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register('email')} type="email" placeholder="admin@aethlacare.qa" className="form-input pl-10" autoComplete="email" />
              </div>
              {errors.email && <p className="text-caption text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••" className="form-input pl-10 pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-caption text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-body-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary btn-lg w-full mt-2">
              {isLoading ? '⏳ Signing in...' : '🔐 Sign In to Portal'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-neutral-100">
            <p className="text-caption text-neutral-400 text-center">
              🔒 Encrypted & secured. Unauthorized access is monitored.
            </p>
          </div>
        </div>
        <p className="text-white/30 text-caption text-center mt-4">
          Default: admin@aethlacare.qa · AethlaAdmin@2024!
        </p>
      </div>
    </div>
  )
}

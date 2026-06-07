'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialize } = useAuthStore()
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    initialize().finally(() => {
      setChecking(false)
      if (!useAuthStore.getState().isAuthenticated) {
        router.push('/admin/login')
      }
    })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-poppins mx-auto mb-4 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
          <p className="text-body-sm text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}

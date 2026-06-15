'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'

interface AdminGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function AdminGuard({ children, allowedRoles, redirectTo }: AdminGuardProps) {
  const { isAuthenticated, initialize, user } = useAuthStore()
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    initialize().finally(() => {
      const state = useAuthStore.getState()
      const isAuth = state.isAuthenticated
      const currentUser = state.user

      if (!isAuth) {
        router.push(redirectTo || '/admin/login')
        setChecking(false)
        return
      }

      // Role check
      if (allowedRoles && currentUser) {
        if (!allowedRoles.includes(currentUser.role)) {
          router.push(redirectTo || '/admin/login')
          setChecking(false)
          return
        }
      }

      // Admin panel default — only allow admin/coordinator
      if (!allowedRoles && currentUser) {
        if (!['admin', 'coordinator'].includes(currentUser.role)) {
          router.push('/admin/login')
          setChecking(false)
          return
        }
      }

      setChecking(false)
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
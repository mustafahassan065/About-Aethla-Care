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
  const { initialize, isAuthenticated, user } = useAuthStore()
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      try {
        await initialize()
      } catch {}

      const state = useAuthStore.getState()
      const isAuth = state.isAuthenticated
      const currentUser = state.user

      if (!isAuth || !currentUser) {
        router.replace(redirectTo || '/admin/login')
        setChecking(false)
        return
      }

      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(currentUser.role)) {
          router.replace(redirectTo || '/admin/login')
          setChecking(false)
          return
        }
      } else {
        // Default admin panel — only admin/coordinator/accountant
        if (!['admin', 'coordinator', 'accountant'].includes(currentUser.role)) {
          router.replace('/admin/login')
          setChecking(false)
          return
        }
      }

      setAllowed(true)
      setChecking(false)
    }

    check()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-poppins mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}
          >A</div>
          <p className="text-body-sm text-neutral-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!allowed) return null

  return <>{children}</>
}
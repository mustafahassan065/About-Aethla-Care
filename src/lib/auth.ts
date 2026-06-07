import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from './api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('aethla_access_token', accessToken)
          localStorage.setItem('aethla_refresh_token', refreshToken)
        }
        set({ accessToken, refreshToken })
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await authApi.login({ email, password })
          const { accessToken, refreshToken, user } = res.data
          get().setTokens(accessToken, refreshToken)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {}
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aethla_access_token')
          localStorage.removeItem('aethla_refresh_token')
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        window.location.href = '/admin/login'
      },

      initialize: async () => {
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('aethla_access_token')
          : null
        if (!token) { set({ isAuthenticated: false }); return }
        try {
          const res = await authApi.me()
          set({ user: res.data, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false, accessToken: null })
        }
      },
    }),
    {
      name: 'aethla-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)

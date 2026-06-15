import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from './api'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'coordinator' | 'caregiver' | 'family' | 'accountant'
  isActive: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ role: string }>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const res = await apiClient.post('/auth/login', { email, password })
          const { accessToken, user } = res.data
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          set({ user, token: accessToken, isAuthenticated: true, isLoading: false })
          return { role: user.role }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: async () => {
        delete apiClient.defaults.headers.common['Authorization']
        set({ user: null, token: null, isAuthenticated: false })
      },

      initialize: async () => {
        const { token } = get()
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const res = await apiClient.get('/auth/me')
          set({ user: res.data, isAuthenticated: true })
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
          delete apiClient.defaults.headers.common['Authorization']
        }
      },
    }),
    {
      name: 'aethla-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

// Role-based portal URLs
export function getPortalByRole(role: string): string {
  switch (role) {
    case 'admin':
    case 'coordinator':
    case 'accountant':
      return '/admin/dashboard'
    case 'caregiver':
      return '/employee/dashboard'
    case 'family':
      return '/portal/dashboard'
    default:
      return '/admin/login'
  }
}
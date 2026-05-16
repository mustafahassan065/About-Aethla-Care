import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// ── Create Axios instance ─────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Request interceptor – attach JWT ─────────────────────

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('aethla_access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor – handle 401 / refresh ──────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('aethla_refresh_token')
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken })
        localStorage.setItem('aethla_access_token', data.accessToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        }
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem('aethla_access_token')
        localStorage.removeItem('aethla_refresh_token')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

// ── API Service Functions ─────────────────────────────────

// Auth
export const authApi = {
  login:   (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  logout:  ()                                           => apiClient.post('/auth/logout'),
  refresh: (refreshToken: string)                       => apiClient.post('/auth/refresh', { refreshToken }),
  me:      ()                                           => apiClient.get('/auth/me'),
  forgotPassword: (email: string)                       => apiClient.post('/auth/forgot-password', { email }),
  resetPassword:  (token: string, password: string)     => apiClient.post('/auth/reset-password', { token, password }),
}

// Clients
export const clientsApi = {
  getAll:   (params?: Record<string, unknown>) => apiClient.get('/clients', { params }),
  getById:  (id: string)                        => apiClient.get(`/clients/${id}`),
  create:   (data: unknown)                     => apiClient.post('/clients', data),
  update:   (id: string, data: unknown)         => apiClient.patch(`/clients/${id}`, data),
  delete:   (id: string)                        => apiClient.delete(`/clients/${id}`),
  getCarePlan:    (id: string)                  => apiClient.get(`/clients/${id}/care-plan`),
  updateCarePlan: (id: string, data: unknown)   => apiClient.put(`/clients/${id}/care-plan`, data),
  getHistory:     (id: string)                  => apiClient.get(`/clients/${id}/history`),
}

// Caregivers
export const caregiversApi = {
  getAll:   (params?: Record<string, unknown>) => apiClient.get('/caregivers', { params }),
  getById:  (id: string)                        => apiClient.get(`/caregivers/${id}`),
  create:   (data: unknown)                     => apiClient.post('/caregivers', data),
  update:   (id: string, data: unknown)         => apiClient.patch(`/caregivers/${id}`, data),
  delete:   (id: string)                        => apiClient.delete(`/caregivers/${id}`),
  match:    (criteria: unknown)                 => apiClient.post('/caregivers/match', criteria),
  getSchedule: (id: string, params?: unknown)   => apiClient.get(`/caregivers/${id}/schedule`, { params }),
}

// Schedules
export const schedulesApi = {
  getAll:   (params?: Record<string, unknown>) => apiClient.get('/schedules', { params }),
  getById:  (id: string)                        => apiClient.get(`/schedules/${id}`),
  create:   (data: unknown)                     => apiClient.post('/schedules', data),
  update:   (id: string, data: unknown)         => apiClient.patch(`/schedules/${id}`, data),
  delete:   (id: string)                        => apiClient.delete(`/schedules/${id}`),
  checkIn:  (id: string, location: unknown)     => apiClient.post(`/schedules/${id}/check-in`, { location }),
  checkOut: (id: string, location: unknown)     => apiClient.post(`/schedules/${id}/check-out`, { location }),
  getCalendar: (params: unknown)                => apiClient.get('/schedules/calendar', { params }),
}

// Care Notes
export const careNotesApi = {
  getAll:   (params?: Record<string, unknown>) => apiClient.get('/care-notes', { params }),
  getById:  (id: string)                        => apiClient.get(`/care-notes/${id}`),
  create:   (data: unknown)                     => apiClient.post('/care-notes', data),
  update:   (id: string, data: unknown)         => apiClient.patch(`/care-notes/${id}`, data),
  shareWithFamily: (id: string)                 => apiClient.post(`/care-notes/${id}/share`),
  uploadPhoto: (id: string, formData: FormData) => apiClient.post(`/care-notes/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// Billing
export const billingApi = {
  getInvoices:  (params?: Record<string, unknown>) => apiClient.get('/billing/invoices', { params }),
  getInvoice:   (id: string)                        => apiClient.get(`/billing/invoices/${id}`),
  createInvoice:(data: unknown)                     => apiClient.post('/billing/invoices', data),
  updateInvoice:(id: string, data: unknown)         => apiClient.patch(`/billing/invoices/${id}`, data),
  sendInvoice:  (id: string)                        => apiClient.post(`/billing/invoices/${id}/send`),
  getExpenses:  (params?: unknown)                  => apiClient.get('/billing/expenses', { params }),
  getSummary:   (params?: unknown)                  => apiClient.get('/billing/summary', { params }),
  getPayroll:   (params?: unknown)                  => apiClient.get('/billing/payroll', { params }),
}

// Incidents
export const incidentsApi = {
  getAll:   (params?: Record<string, unknown>) => apiClient.get('/incidents', { params }),
  getById:  (id: string)                        => apiClient.get(`/incidents/${id}`),
  create:   (data: unknown)                     => apiClient.post('/incidents', data),
  update:   (id: string, data: unknown)         => apiClient.patch(`/incidents/${id}`, data),
  resolve:  (id: string, data: unknown)         => apiClient.post(`/incidents/${id}/resolve`, data),
}

// Messages
export const messagesApi = {
  getConversations: ()                       => apiClient.get('/messages/conversations'),
  getMessages: (conversationId: string)      => apiClient.get(`/messages/${conversationId}`),
  sendMessage: (data: unknown)               => apiClient.post('/messages', data),
  markRead:    (conversationId: string)      => apiClient.patch(`/messages/${conversationId}/read`),
  sendBroadcast: (data: unknown)             => apiClient.post('/messages/broadcast', data),
}

// Blog
export const blogApi = {
  getAll:    (params?: Record<string, unknown>) => apiClient.get('/blog', { params }),
  getBySlug: (slug: string)                      => apiClient.get(`/blog/${slug}`),
  create:    (data: unknown)                     => apiClient.post('/blog', data),
  update:    (id: string, data: unknown)         => apiClient.patch(`/blog/${id}`, data),
  delete:    (id: string)                        => apiClient.delete(`/blog/${id}`),
  publish:   (id: string)                        => apiClient.post(`/blog/${id}/publish`),
}

// Dashboard
export const dashboardApi = {
  getStats:    ()               => apiClient.get('/dashboard/stats'),
  getRevenue:  (params: unknown)=> apiClient.get('/dashboard/revenue', { params }),
  getActivity: (params: unknown)=> apiClient.get('/dashboard/activity', { params }),
  getAlerts:   ()               => apiClient.get('/dashboard/alerts'),
}

// Public (no auth)
export const publicApi = {
  submitConsultation: (data: unknown) => apiClient.post('/public/consultation', data),
  submitCareerApp:    (data: unknown) => apiClient.post('/public/careers', data),
  getPublicBlog:      (params?: unknown) => apiClient.get('/public/blog', { params }),
  getBlogPost:        (slug: string)  => apiClient.get(`/public/blog/${slug}`),
  getTestimonials:    ()              => apiClient.get('/public/testimonials'),
  getFaqs:            ()              => apiClient.get('/public/faqs'),
}

export default apiClient

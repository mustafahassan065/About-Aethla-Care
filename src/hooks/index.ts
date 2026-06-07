import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/auth'
import {
  clientsApi, caregiversApi, schedulesApi, careNotesApi,
  billingApi, incidentsApi, dashboardApi, blogApi,
} from '@/lib/api'

// ── Auth ─────────────────────────────────────────────────

export function useAuth() {
  const store = useAuthStore()
  return store
}

export function useRequireAuth() {
  const { isAuthenticated, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push('/admin/login')
      }
    })
  }, [])

  return { isAuthenticated }
}

// ── Dashboard ─────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then(r => r.data),
  })
}

export function useDashboardRevenue(period = 'month') {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardApi.getRevenue({ period }).then(r => r.data),
  })
}

// ── Clients ───────────────────────────────────────────────

export function useClients(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientsApi.getAll(params).then(r => r.data),
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getById(id).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => clientsApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client created successfully')
    },
    onError: () => toast.error('Failed to create client'),
  })
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => clientsApi.update(id, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients', id] })
      qc.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client updated successfully')
    },
    onError: () => toast.error('Failed to update client'),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client deactivated')
    },
    onError: () => toast.error('Failed to deactivate client'),
  })
}

// ── Caregivers ────────────────────────────────────────────

export function useCaregivers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['caregivers', params],
    queryFn: () => caregiversApi.getAll(params).then(r => r.data),
  })
}

export function useCaregiver(id: string) {
  return useQuery({
    queryKey: ['caregivers', id],
    queryFn: () => caregiversApi.getById(id).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateCaregiver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => caregiversApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caregivers'] })
      toast.success('Caregiver added successfully')
    },
    onError: () => toast.error('Failed to add caregiver'),
  })
}

export function useMatchCaregivers() {
  return useMutation({
    mutationFn: (criteria: unknown) => caregiversApi.match(criteria).then(r => r.data),
    onError: () => toast.error('Matching failed'),
  })
}

// ── Schedules ─────────────────────────────────────────────

export function useSchedules(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: () => schedulesApi.getAll(params).then(r => r.data),
  })
}

export function useCalendarSchedules(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['schedules', 'calendar', startDate, endDate],
    queryFn: () => schedulesApi.getCalendar({ startDate, endDate }).then(r => r.data),
    enabled: !!startDate && !!endDate,
  })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => schedulesApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Schedule created')
    },
    onError: () => toast.error('Failed to create schedule'),
  })
}

export function useUpdateSchedule(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => schedulesApi.update(id, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Schedule updated')
    },
    onError: () => toast.error('Failed to update schedule'),
  })
}

// ── Care Notes ────────────────────────────────────────────

export function useCareNotes(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['care-notes', params],
    queryFn: () => careNotesApi.getAll(params).then(r => r.data),
  })
}

export function useCreateCareNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => careNotesApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['care-notes'] })
      toast.success('Care note saved')
    },
    onError: () => toast.error('Failed to save care note'),
  })
}

// ── Billing ───────────────────────────────────────────────

export function useInvoices(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => billingApi.getInvoices(params).then(r => r.data),
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => billingApi.createInvoice(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Invoice created')
    },
    onError: () => toast.error('Failed to create invoice'),
  })
}

export function useSendInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => billingApi.sendInvoice(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Invoice sent to client')
    },
    onError: () => toast.error('Failed to send invoice'),
  })
}

// ── Incidents ─────────────────────────────────────────────

export function useIncidents(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => incidentsApi.getAll(params).then(r => r.data),
  })
}

export function useCreateIncident() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => incidentsApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident reported')
    },
    onError: () => toast.error('Failed to report incident'),
  })
}

// ── Blog ──────────────────────────────────────────────────

export function useBlogPosts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['blog', params],
    queryFn: () => blogApi.getAll(params).then(r => r.data),
  })
}

export function usePublishPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogApi.publish(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Post published')
    },
    onError: () => toast.error('Failed to publish post'),
  })
}

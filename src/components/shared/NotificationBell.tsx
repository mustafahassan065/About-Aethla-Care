'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, X, CheckCheck } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import apiClient from '@/lib/api'

export function NotificationBell() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => apiClient.get('/notifications?limit=20').then(r => r.data),
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30s
  })

  const { data: countData } = useQuery({
    queryKey: ['notif-count', user?._id],
    queryFn: () => apiClient.get('/notifications/unread-count').then(r => r.data),
    enabled: !!user,
    refetchInterval: 30000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notif-count'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: () => apiClient.patch('/notifications/mark-all-read', {}).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notif-count'] })
    },
  })

  const unread = countData?.count || 0
  const notifs = Array.isArray(notifications) ? notifications : []

  const typeColor: Record<string, string> = {
    info:    'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    alert:   'bg-red-50 text-red-600',
  }

  const typeDot: Record<string, string> = {
    info:    '#1B6B8A',
    success: '#2DA88A',
    warning: '#F59E0B',
    alert:   '#EF4444',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden"
          style={{ maxHeight: '420px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <h3 className="text-body-sm font-bold font-poppins text-neutral-800">
              Notifications {unread > 0 && <span className="text-primary-500">({unread})</span>}
            </h3>
            <div className="flex gap-2">
              {unread > 0 && (
                <button
                  onClick={() => markAllMutation.mutate()}
                  className="text-caption text-primary-500 hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
            {notifs.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-body-sm text-neutral-400">No notifications yet</p>
              </div>
            ) : (
              notifs.map((n: any) => (
                <div
                  key={n._id}
                  onClick={() => { if (!n.read) markReadMutation.mutate(n._id) }}
                  className={`flex gap-3 px-4 py-3 border-b border-neutral-50 cursor-pointer transition-colors hover:bg-neutral-50 ${
                    !n.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ background: n.read ? '#D1D5DB' : (typeDot[n.type] || '#1B6B8A') }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-body-sm font-semibold ${n.read ? 'text-neutral-500' : 'text-neutral-800'}`}>
                      {n.title}
                    </p>
                    <p className="text-caption text-neutral-400 line-clamp-2 mt-0.5">{n.message}</p>
                    <p className="text-caption text-neutral-300 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(27,107,138,0.15)',
          },
          success: {
            style: { background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' },
            iconTheme: { primary: '#22C55E', secondary: '#F0FDF4' },
          },
          error: {
            style: { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' },
            iconTheme: { primary: '#EF4444', secondary: '#FEF2F2' },
          },
          loading: {
            style: { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
          },
        }}
      />
    </QueryClientProvider>
  )
}

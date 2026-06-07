'use client'

import React from 'react'

interface FieldProps {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
}

interface InputProps extends FieldProps, React.InputHTMLAttributes<HTMLInputElement> {}
interface SelectProps extends FieldProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}
interface TextareaProps extends FieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function FormField({ label, error, required, hint, children, className = '' }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="form-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-caption text-neutral-400">{hint}</p>}
      {error && <p className="text-caption text-red-500">{error}</p>}
    </div>
  )
}

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, hint, className = '', ...props }, ref) => (
    <FormField label={label} error={error} required={required} hint={hint} className={className}>
      <input
        ref={ref}
        {...props}
        className={`form-input ${error ? 'border-red-400 focus:border-red-500' : ''}`}
      />
    </FormField>
  )
)
FormInput.displayName = 'FormInput'

export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, hint, options, placeholder, className = '', ...props }, ref) => (
    <FormField label={label} error={error} required={required} hint={hint} className={className}>
      <select ref={ref} {...props} className={`form-input ${error ? 'border-red-400' : ''}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FormField>
  )
)
FormSelect.displayName = 'FormSelect'

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, hint, className = '', ...props }, ref) => (
    <FormField label={label} error={error} required={required} hint={hint} className={className}>
      <textarea
        ref={ref}
        {...props}
        className={`form-input min-h-[100px] resize-y ${error ? 'border-red-400' : ''}`}
      />
    </FormField>
  )
)
FormTextarea.displayName = 'FormTextarea'

// Reusable badge
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'badge-accent', inactive: 'badge', pending: 'badge-warning',
    discharged: 'badge', completed: 'badge-accent', scheduled: 'badge-primary',
    'in-progress': 'badge-primary', missed: 'badge-error', cancelled: 'badge',
    paid: 'badge-accent', sent: 'badge-primary', overdue: 'badge-error', draft: 'badge',
    open: 'badge-warning', resolved: 'badge-accent', critical: 'badge-error',
    'on-duty': 'badge-accent', 'off-duty': 'badge', 'on-leave': 'badge-warning',
    published: 'badge-accent',
  }
  return <span className={map[status] || 'badge'}>{status}</span>
}

// Confirm dialog
interface ConfirmProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel, isLoading }: ConfirmProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl">
        <div className={`text-4xl mb-4 ${danger ? '🗑️' : '❓'}`}>{danger ? '🗑️' : '❓'}</div>
        <h3 className="text-heading-md font-poppins text-neutral-800 mb-2">{title}</h3>
        <p className="text-body-sm text-neutral-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1 py-2">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2 rounded-full font-semibold text-white text-body-sm transition-all ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'
            }`}
          >
            {isLoading ? '⏳' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// Page header
export function PageHeader({
  title, subtitle, action
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">{title}</h1>
        {subtitle && <p className="text-body-sm text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// Stat card
export function StatCard({
  label, value, change, icon, color = '#1B6B8A', isLoading
}: {
  label: string; value: string | number; change?: string
  icon: string; color?: string; isLoading?: boolean
}) {
  const isPositive = change?.startsWith('+')
  return (
    <div className="card p-6" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}15` }}>
          {icon}
        </div>
        {change && (
          <span className={`text-caption font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {change}
          </span>
        )}
      </div>
      {isLoading
        ? <div className="skeleton h-8 w-24 rounded-lg mb-1" />
        : <div className="text-3xl font-extrabold font-poppins text-neutral-800 leading-none mb-1">{value}</div>
      }
      <div className="text-caption text-neutral-400">{label}</div>
    </div>
  )
}

// Avatar
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }
  return (
    <div className={`${sizes[size]} rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-poppins flex-shrink-0`}>
      {initials}
    </div>
  )
}

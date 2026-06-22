'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { X, RotateCcw, GripVertical } from 'lucide-react'

const categories = [
  'General',
  'Services',
  'Billing & Insurance',
  'Technology & Portal',
  'Caregivers',
  'Qatar Specific',
]

export default function QAPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<any>(null)
  const [lastDeleted, setLastDeleted] = useState<any>(null)

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs-admin'],
    queryFn: () => apiClient.get('/faq').then(r => r.data),
  })

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { question: '', answer: '', category: 'General', order: 0, published: true }
  })

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/faq', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faqs-admin'] })
      toast.success('Q&A added — publish to show on website')
      closeForm()
    },
    onError: () => toast.error('Failed to add Q&A'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => apiClient.patch(`/faq/${id}`, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faqs-admin'] })
      toast.success('Q&A updated')
      closeForm()
    },
    onError: () => toast.error('Failed to update'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/faq/${id}`).then(r => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['faqs-admin'] })
      toast.success('Deleted', { duration: 6000 })
    },
    onError: () => toast.error('Failed to delete'),
  })

  // Restore deleted — create again
  const restoreMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/faq', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faqs-admin'] })
      toast.success('Q&A restored')
      setLastDeleted(null)
    },
  })

  const togglePublish = (faq: any) => {
    updateMutation.mutate({ id: faq._id, dto: { published: !faq.published } })
  }

  const openEdit = (faq: any) => {
    setEditing(faq)
    Object.entries(faq).forEach(([k, v]) => setValue(k as any, v as any))
    setShowForm(true)
  }

  const closeForm = () => { setShowForm(false); setEditing(null); reset() }

  const handleDelete = (faq: any) => {
    if (!confirm('Delete this Q&A?')) return
    setLastDeleted({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order, published: faq.published })
    deleteMutation.mutate(faq._id)
  }

  const onSubmit = (data: any) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, dto: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const allFaqs: any[] = Array.isArray(faqs) ? faqs : []
  const published   = allFaqs.filter(f => f.published).length
  const unpublished = allFaqs.filter(f => !f.published).length

  return (
    <div>
      <PageHeader
        title="Q&A Management"
        subtitle={`${allFaqs.length} questions — ${published} published, ${unpublished} drafts`}
        action={<button onClick={() => { setEditing(null); reset(); setShowForm(true) }} className="btn-primary btn-sm">+ Add Q&A</button>}
      />

      {/* Undo Delete */}
      {lastDeleted && (
        <div className="card p-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: '#FFF8E1', borderLeft: '4px solid #F59E0B' }}>
          <p className="text-body-sm text-amber-700">
            Q&A deleted: <strong>&ldquo;{lastDeleted.question.slice(0, 60)}...&rdquo;</strong>
          </p>
          <button onClick={() => restoreMutation.mutate(lastDeleted)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold text-body-sm hover:bg-amber-200 transition-all">
            <RotateCcw size={15} /> Undo Delete
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4" style={{ borderLeft: '4px solid #1B6B8A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{allFaqs.length}</div>
          <p className="text-caption text-neutral-400 mt-1">Total Q&As</p>
        </div>
        <div className="card p-4" style={{ borderLeft: '4px solid #2DA88A' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{published}</div>
          <p className="text-caption text-neutral-400 mt-1">Published on Website</p>
        </div>
        <div className="card p-4" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="text-2xl font-extrabold font-poppins text-neutral-800">{unpublished}</div>
          <p className="text-caption text-neutral-400 mt-1">Drafts</p>
        </div>
      </div>

      {/* Q&A List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : allFaqs.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-body-md text-neutral-400 mb-4">No Q&As yet. Add your first question.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">+ Add Q&A</button>
        </div>
      ) : (
        <div className="space-y-3">
          {allFaqs.map((faq: any) => (
            <div key={faq._id} className="card p-5">
              <div className="flex items-start gap-4">
                <GripVertical size={18} className="text-neutral-300 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-primary text-xs">{faq.category || 'General'}</span>
                      <StatusBadge status={faq.published ? 'published' : 'draft'} />
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => togglePublish(faq)}
                        className={`btn-sm py-1 px-3 text-xs ${faq.published ? 'btn-outline' : 'btn-primary'}`}>
                        {faq.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => openEdit(faq)} className="btn-outline btn-sm py-1 px-3 text-xs">Edit</button>
                      <button onClick={() => handleDelete(faq)} className="text-red-400 hover:text-red-600 text-caption font-semibold px-2 py-1">Delete</button>
                    </div>
                  </div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800 mb-1">{faq.question}</p>
                  <p className="text-body-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-heading-md font-poppins">{editing ? 'Edit Q&A' : 'Add New Q&A'}</h3>
              <button onClick={closeForm} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="form-label">Question <span className="text-red-500">*</span></label>
                <input {...register('question', { required: 'Question is required' })}
                  className="form-input" placeholder="What home healthcare services do you offer in Qatar?" />
                {errors.question && <p className="text-caption text-red-500 mt-1">{String(errors.question.message)}</p>}
              </div>
              <div>
                <label className="form-label">Answer <span className="text-red-500">*</span></label>
                <textarea {...register('answer', { required: 'Answer is required' })}
                  className="form-input min-h-[120px] resize-y"
                  placeholder="We provide elderly care, disability support, newborn care, maternity care, telehealth, patient navigation, and wellness services across Qatar." />
                {errors.answer && <p className="text-caption text-red-500 mt-1">{String(errors.answer.message)}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select {...register('category')} className="form-input">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input {...register('order')} type="number" min="0" className="form-input" placeholder="0" />
                  <p className="text-caption text-neutral-400 mt-1">Lower number shows first</p>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50">
                <input {...register('published')} type="checkbox" className="w-5 h-5 accent-primary-500" />
                <div>
                  <p className="text-body-sm font-semibold text-neutral-700">Publish on Website</p>
                  <p className="text-caption text-neutral-400">Show this Q&A on the public FAQ section</p>
                </div>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg flex-1">
                  {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Q&A'}
                </button>
                <button type="button" onClick={closeForm} className="btn-outline px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
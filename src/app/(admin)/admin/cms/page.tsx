'use client'

import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { DataTable, Column } from '@/components/ui/DataTable'
import { X, Upload } from 'lucide-react'

const categories = [
  'Elderly Care', 'Parenting', 'Disability Support', 'Wellness',
  'Home Healthcare in Qatar', 'Insurance & PHCC Guidance',
]

export default function CMSPage() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['blog', filter, page],
    queryFn: () => apiClient.get('/blog', {
      params: { ...(filter ? { published: filter } : {}), page, limit: 20 }
    }).then(r => r.data),
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', slug: '', category: '', excerpt: '', content: '', featuredImage: '', readTime: 5, seoTitle: '', seoDescription: '' }
  })

  const titleVal = watch('title')

  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const createMutation = useMutation({
    mutationFn: (dto: any) => apiClient.post('/blog', dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post created as draft'); closeForm() },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create post'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => apiClient.patch(`/blog/${id}`, dto).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post updated'); closeForm() },
    onError: () => toast.error('Failed to update post'),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/blog/${id}/publish`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post published — now visible on website') },
    onError: () => toast.error('Failed to publish'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/blog/${id}`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  const closeForm = () => { setShowForm(false); setEditing(null); setImagePreview(''); reset() }

  const openEdit = (post: any) => {
    setEditing(post)
    Object.entries(post).forEach(([k, v]) => setValue(k as any, v as any))
    setImagePreview(post.featuredImage || '')
    setShowForm(true)
  }

  const openNew = () => { setEditing(null); reset({ readTime: 5 }); setImagePreview(''); setShowForm(true) }

  // Handle image upload — convert to base64 for preview, send URL or base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImagePreview(result)
      setValue('featuredImage', result)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: any) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, dto: data })
    } else {
      createMutation.mutate({ ...data, published: false })
    }
  }

  const columns: Column<any>[] = [
    { key: 'title', header: 'Title', sortable: true, render: (v) => <span className="text-body-sm font-semibold text-neutral-800 max-w-xs block truncate">{String(v)}</span> },
    { key: 'category', header: 'Category', render: (v) => <span className="badge-primary text-xs capitalize">{String(v)}</span> },
    { key: 'published', header: 'Status', render: (v) => <StatusBadge status={v ? 'published' : 'draft'} /> },
    { key: 'views', header: 'Views', render: (v) => <span className="text-body-sm text-neutral-600">{Number(v || 0).toLocaleString()}</span> },
    { key: 'publishedAt', header: 'Date', render: (v) => <span className="text-caption text-neutral-500">{v ? new Date(String(v)).toLocaleDateString() : '—'}</span> },
    {
      key: '_id', header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => openEdit(row)} className="btn-outline btn-sm py-1 px-3 text-xs">Edit</button>
          {!row.published && (
            <button onClick={() => publishMutation.mutate(row._id)} disabled={publishMutation.isPending} className="btn-primary btn-sm py-1 px-3 text-xs">Publish</button>
          )}
          <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(row._id) }} className="text-red-400 hover:text-red-600 text-caption font-semibold px-2 py-1">Delete</button>
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="CMS Management"
        subtitle={`${data?.total ?? 0} blog posts`}
        action={<button onClick={openNew} className="btn-primary btn-sm">+ New Post</button>}
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen p-4 pt-8">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl z-10 mb-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h3 className="text-heading-md font-poppins">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
                <button onClick={closeForm} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="form-label">Title <span className="text-red-500">*</span></label>
                  <input {...register('title', { required: 'Title required' })}
                    className="form-input"
                    placeholder="How to Choose a Caregiver in Qatar"
                    onChange={e => {
                      register('title').onChange(e)
                      if (!editing) setValue('slug', generateSlug(e.target.value))
                    }}
                  />
                  {errors.title && <p className="text-caption text-red-500 mt-1">{String(errors.title.message)}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">URL Slug <span className="text-red-500">*</span></label>
                    <input {...register('slug', { required: 'Slug required' })} className="form-input font-mono text-sm" placeholder="how-to-choose-caregiver-qatar" />
                    {errors.slug && <p className="text-caption text-red-500 mt-1">{String(errors.slug.message)}</p>}
                  </div>
                  <div>
                    <label className="form-label">Category <span className="text-red-500">*</span></label>
                    <select {...register('category', { required: 'Category required' })} className="form-input">
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-caption text-red-500 mt-1">{String(errors.category.message)}</p>}
                  </div>
                </div>

                {/* Featured Image — Upload OR URL */}
                <div>
                  <label className="form-label">Featured Image</label>
                  <div className="flex gap-3">
                    <input {...register('featuredImage')} className="form-input flex-1" placeholder="https://images.unsplash.com/..." />
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="btn-outline btn-sm flex items-center gap-2 flex-shrink-0 px-4">
                      <Upload size={15} /> Upload
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {imagePreview && (
                    <div className="mt-2 relative w-32">
                      <img src={imagePreview} alt="" className="w-32 h-20 object-cover rounded-xl" />
                      <button type="button" onClick={() => { setImagePreview(''); setValue('featuredImage', '') }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Read Time (minutes)</label>
                  <input {...register('readTime')} type="number" min="1" className="form-input w-32" />
                </div>

                <div>
                  <label className="form-label">Excerpt <span className="text-red-500">*</span></label>
                  <textarea {...register('excerpt', { required: 'Excerpt required' })} className="form-input min-h-[70px] resize-y" placeholder="A short summary that appears in the blog listing..." />
                  {errors.excerpt && <p className="text-caption text-red-500 mt-1">{String(errors.excerpt.message)}</p>}
                </div>

                <div>
                  <label className="form-label">Content <span className="text-red-500">*</span></label>
                  <p className="text-caption text-neutral-400 mb-1">Use **Heading** on a new line to create section headings. Separate paragraphs with blank lines.</p>
                  <textarea {...register('content', { required: 'Content required' })} className="form-input font-mono text-sm resize-y" style={{ minHeight: '220px' }}
                    placeholder={`**Introduction**\nWrite your introduction here.\n\n**Section Heading**\nSection content here.`} />
                  {errors.content && <p className="text-caption text-red-500 mt-1">{String(errors.content.message)}</p>}
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-caption text-neutral-400 mb-3 uppercase tracking-wider">SEO Settings (Optional)</p>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">SEO Title</label>
                      <input {...register('seoTitle')} className="form-input" placeholder="Optimized title for search engines..." />
                    </div>
                    <div>
                      <label className="form-label">SEO Description</label>
                      <textarea {...register('seoDescription')} className="form-input min-h-[60px] resize-y" placeholder="Meta description for search results (160 characters max)..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg flex-1">
                    {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Save as Draft'}
                  </button>
                  <button type="button" onClick={closeForm} className="btn-outline px-6">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {[{ v: '', l: 'All Posts' }, { v: 'false', l: 'Drafts' }, { v: 'true', l: 'Published' }].map(f => (
            <button key={f.v} onClick={() => { setFilter(f.v); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-caption font-semibold transition-all ${filter === f.v ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        rowKey={r => r._id}
        emptyMessage="No blog posts yet. Click '+ New Post' to create your first post."
      />
    </div>
  )
}
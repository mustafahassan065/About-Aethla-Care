'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useBlogPosts, usePublishPost } from '@/hooks'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge, PageHeader } from '@/components/ui/index'

export default function CMSPage() {
  const [published, setPublished] = useState<string>('')
  const { data, isLoading } = useBlogPosts({ published: published || undefined, limit: 20 })
  const publishPost = usePublishPost()

  const columns: Column<any>[] = [
    { key: 'title', header: 'Title', sortable: true,
      render: (v) => <span className="text-body-sm font-semibold text-neutral-800 max-w-xs block truncate">{String(v)}</span> },
    { key: 'category', header: 'Category',
      render: (v) => <span className="badge-primary capitalize">{String(v).replace('-', ' ')}</span> },
    { key: 'published', header: 'Status',
      render: (v) => <StatusBadge status={v ? 'published' : 'draft'} /> },
    { key: 'views', header: 'Views', sortable: true,
      render: (v) => <span className="text-body-sm text-neutral-600">{Number(v).toLocaleString()}</span> },
    { key: 'publishedAt', header: 'Date',
      render: (v) => <span className="text-caption text-neutral-500">{v ? new Date(String(v)).toLocaleDateString() : '—'}</span> },
    { key: '_id', header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className="btn-outline btn-sm py-1 px-3 text-xs">Edit</button>
          {!row.published && (
            <button onClick={() => publishPost.mutate(row._id)} className="btn-primary btn-sm py-1 px-3 text-xs">Publish</button>
          )}
        </div>
      ) },
  ]

  return (
    <div>
      <PageHeader
        title="Content Management"
        subtitle={`${data?.total ?? 0} blog posts`}
        action={<button className="btn-primary btn-sm flex items-center gap-2"><Plus size={15} /> New Post</button>}
      />
      <div className="card p-4 mb-5 flex gap-2">
        {['', 'true', 'false'].map(v => (
          <button key={v} onClick={() => setPublished(v)}
            className={`px-3 py-1.5 rounded-lg text-caption font-semibold transition-all ${published === v ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
            {v === '' ? 'All' : v === 'true' ? 'Published' : 'Drafts'}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} total={data?.total ?? 0} rowKey={r => r._id} emptyMessage="No posts found." />
    </div>
  )
}

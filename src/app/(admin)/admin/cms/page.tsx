'use client'
const posts = [
  { id: '1', title: '10 Tips for Elderly Care at Home', category: 'Elderly Care', status: 'published', views: 1240, date: '15 May 2025' },
  { id: '2', title: 'Complete Guide to Newborn Care', category: 'Parenting', status: 'published', views: 892, date: '10 May 2025' },
  { id: '3', title: 'Postpartum Recovery Guide', category: 'Maternity', status: 'published', views: 654, date: '5 May 2025' },
  { id: '4', title: 'Understanding Disability Support in Qatar', category: 'Disability', status: 'draft', views: 0, date: '16 May 2025' },
]
export default function CMSPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Content Management</h1>
          <p className="text-body-sm text-neutral-400">Blog posts and website content</p>
        </div>
        <button className="btn-primary btn-sm">+ New Post</button>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td className="text-body-sm font-semibold text-neutral-800 max-w-xs truncate">{p.title}</td>
                  <td><span className="badge-primary">{p.category}</span></td>
                  <td><span className={p.status==='published'?'badge-accent':'badge'}>{p.status}</span></td>
                  <td className="text-body-sm text-neutral-600">{p.views.toLocaleString()}</td>
                  <td className="text-body-sm text-neutral-500">{p.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-outline btn-sm py-1 px-3">Edit</button>
                      {p.status==='draft' && <button className="btn-primary btn-sm py-1 px-3">Publish</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

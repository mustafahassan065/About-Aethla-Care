import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Home Healthcare Resources & Blog | Aethla Care Qatar',
  description: 'Expert articles on elderly care, newborn care, disability support, maternity health, and home wellness — from Qatar\'s leading home healthcare provider.',
}
const posts = [
  { slug: 'elderly-care-tips-doha', category: 'Elderly Care', title: '10 Tips for Supporting an Elderly Parent at Home in Qatar', excerpt: 'Practical advice for families navigating elderly home care in Qatar, from safety modifications to caregiver selection.', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop', readTime: 6, date: '15 May 2025' },
  { slug: 'newborn-care-guide', category: 'Parenting', title: 'Complete Guide to Newborn Care in the First 8 Weeks', excerpt: 'Everything new parents need to know about feeding schedules, sleep routines, and when to call a professional.', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80&auto=format&fit=crop', readTime: 8, date: '10 May 2025' },
  { slug: 'postpartum-recovery-tips', category: 'Maternity', title: 'Postpartum Recovery: What to Expect and How to Get Support', excerpt: 'A guide to postnatal recovery for new mothers in Qatar, including emotional wellness and physical healing.', img: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&q=80&auto=format&fit=crop', readTime: 7, date: '5 May 2025' },
  { slug: 'diabetes-management-home', category: 'Wellness', title: 'Managing Diabetes at Home: A Qatar Family Guide', excerpt: 'How home wellness services can help families manage diabetes effectively through monitoring and lifestyle changes.', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop', readTime: 5, date: '1 May 2025' },
  { slug: 'telehealth-benefits-qatar', category: 'Telehealth', title: 'How Telehealth is Transforming Home Healthcare in Qatar', excerpt: 'Virtual consultations, remote monitoring, and digital care coordination are changing how Qatar families access healthcare.', img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&q=80&auto=format&fit=crop', readTime: 6, date: '25 Apr 2025' },
  { slug: 'disability-support-qatar', category: 'Disability', title: 'Navigating Disability Support Services in Qatar', excerpt: 'A comprehensive overview of disability support resources and how to access the right care for your family member.', img: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80&auto=format&fit=crop', readTime: 7, date: '20 Apr 2025' },
]
const categories = ['All', 'Elderly Care', 'Parenting', 'Maternity', 'Wellness', 'Telehealth', 'Disability']
export default function BlogPage() {
  return (
    <>
      <section className="bg-section-gradient py-24 px-4 text-center">
        <div className="trust-pill inline-flex mb-5 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Resources & Blog</div>
        <h1 className="text-display-lg text-white mb-4">Expert Home Healthcare Resources</h1>
        <p className="text-body-lg text-white/75 max-w-xl mx-auto">Evidence-based articles, guides, and insights from Qatar's leading home healthcare team.</p>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(c => (
              <button key={c} className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-all ${c === 'All' ? 'btn-primary btn-sm' : 'border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-500'}`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover overflow-hidden group block">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${p.img}')` }} />
                </div>
                <div className="p-5">
                  <span className="badge-primary text-xs mb-2 inline-block">{p.category}</span>
                  <h2 className="text-heading-sm mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">{p.title}</h2>
                  <p className="text-body-sm text-neutral-500 mb-4 line-clamp-2">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-caption text-neutral-400">
                    <span>{p.date}</span>
                    <span>{p.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

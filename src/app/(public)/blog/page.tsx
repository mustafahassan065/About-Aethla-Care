'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const categories = [
  'All',
  'Elderly Care',
  'Parenting',
  'Disability Support',
  'Wellness',
  'Home Healthcare in Qatar',
  'Insurance & PHCC Guidance',
]

// Document-specified blog topics shown as static posts
// When CMS posts exist they replace these
const staticPosts = [
  {
    slug: 'best-home-healthcare-services-qatar',
    category: 'Home Healthcare in Qatar',
    title: 'Best Home Healthcare Services in Qatar',
    excerpt: 'A complete guide to home healthcare options in Qatar — what services are available, how to access them, and what to look for in a provider.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
    readTime: 7,
    date: '15 May 2025',
  },
  {
    slug: 'elderly-care-at-home-doha',
    category: 'Elderly Care',
    title: 'Elderly Care at Home in Doha',
    excerpt: 'How to arrange professional elderly care at home in Doha — from initial assessment to caregiver selection and ongoing support.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop',
    readTime: 6,
    date: '10 May 2025',
  },
  {
    slug: 'how-to-choose-caregiver-qatar',
    category: 'Home Healthcare in Qatar',
    title: 'How to Choose a Caregiver in Qatar',
    excerpt: 'Practical guidance for families selecting a professional caregiver in Qatar — verification, language, skills, and what questions to ask.',
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&auto=format&fit=crop',
    readTime: 5,
    date: '5 May 2025',
  },
  {
    slug: 'benefits-of-home-nursing-qatar',
    category: 'Home Healthcare in Qatar',
    title: 'Benefits of Home Nursing in Qatar',
    excerpt: 'Why more Qatar families are choosing professional home nursing over hospital or facility-based care for elderly and recovering patients.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
    readTime: 6,
    date: '1 May 2025',
  },
  {
    slug: 'postpartum-recovery-support-doha',
    category: 'Parenting',
    title: 'Postpartum Recovery Support in Doha',
    excerpt: 'A guide to postnatal recovery care in Doha — what support is available, what to expect, and how to arrange professional home care after delivery.',
    img: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&q=80&auto=format&fit=crop',
    readTime: 7,
    date: '25 Apr 2025',
  },
  {
    slug: 'qatar-health-insurance-system',
    category: 'Insurance & PHCC Guidance',
    title: 'Understanding the Qatar Health Insurance System',
    excerpt: 'An accessible guide to Qatar\'s health insurance system — what is covered, how to make claims, and how patient navigation services can help.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
    readTime: 8,
    date: '20 Apr 2025',
  },
  {
    slug: 'telehealth-services-qatar',
    category: 'Home Healthcare in Qatar',
    title: 'Telehealth Services in Qatar Explained',
    excerpt: 'How telehealth works in Qatar, what services are available remotely, and who benefits most from virtual healthcare coordination.',
    img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&q=80&auto=format&fit=crop',
    readTime: 6,
    date: '15 Apr 2025',
  },
  {
    slug: 'disability-support-families-qatar',
    category: 'Disability Support',
    title: 'Disability Support Services for Families in Qatar',
    excerpt: 'What disability support services are available for families in Qatar, how to access them, and what professional in-home care looks like.',
    img: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80&auto=format&fit=crop',
    readTime: 7,
    date: '10 Apr 2025',
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cmsPosts, setCmsPosts] = useState<any[]>([])

  useEffect(() => {
    // Fetch published posts from CMS
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/blog?limit=20`)
      .then(r => r.json())
      .then(d => { if (d?.data?.length > 0) setCmsPosts(d.data) })
      .catch(() => {})
  }, [])

  // Use CMS posts if available, otherwise static
  const allPosts = cmsPosts.length > 0
    ? cmsPosts.map((p: any) => ({
        slug: p.slug,
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        img: p.featuredImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
        readTime: p.readTime || 5,
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      }))
    : staticPosts

  const filtered = activeCategory === 'All'
    ? allPosts
    : allPosts.filter(p => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-24 px-4 text-center">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Resource Center
          </div>
          <h1 className="text-display-lg text-white mb-4">Home Healthcare Resources & Blog</h1>
          <p className="text-body-lg text-white/75 max-w-xl mx-auto">
            Expert articles on elderly care, newborn care, disability support, maternity health, and home wellness — from Qatar&apos;s leading home healthcare provider.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-pad bg-white">
        <div className="container-max">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-all border ${
                  activeCategory === c
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-500'
                }`}
              >{c}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-body-md text-neutral-400">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover overflow-hidden group block">
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${p.img}')` }}
                    />
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
          )}
        </div>
      </section>
    </>
  )
}
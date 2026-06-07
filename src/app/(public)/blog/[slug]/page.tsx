import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | Aethla Care Qatar',
}

const posts: Record<string, { title: string; category: string; author: string; date: string; readTime: number; img: string; content: string }> = {
  'elderly-care-tips-doha': {
    title: '10 Tips for Supporting an Elderly Parent at Home in Qatar',
    category: 'Elderly Care', author: 'Aethla Care Team', date: '15 May 2025', readTime: 6,
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&auto=format&fit=crop',
    content: `Supporting an elderly parent at home in Qatar requires careful planning, compassion, and the right professional support. Here are ten essential tips every family should know.

**1. Assess Care Needs Early**
Begin with a thorough assessment of your parent's physical, cognitive, and emotional needs. Involve their doctor and consider a professional home care assessment.

**2. Modify the Home for Safety**
Install grab rails in bathrooms, remove trip hazards, improve lighting, and consider a medical alert system to ensure a safe home environment.

**3. Establish a Consistent Routine**
Elderly individuals thrive on predictability. Consistent meal times, medication schedules, and activity routines promote wellbeing and reduce anxiety.

**4. Choose the Right Caregiver**
Look for caregivers who are licensed, background-checked, and match your parent's language and cultural preferences. At Aethla Care, we use AI-powered matching to find the ideal fit.

**5. Keep the Family Connected**
Regular visits and communication from family members reduce loneliness and depression, which are major challenges for elderly individuals in home care.

**6. Monitor Medication Carefully**
Create a clear medication schedule and consider pill organizers or reminders. Professional caregivers can provide medication prompts and monitor for side effects.

**7. Plan for Emergencies**
Keep emergency contacts, medical records, and insurance information easily accessible. Establish a clear emergency protocol with your caregiver and care coordinator.

**8. Support Emotional Wellbeing**
Social engagement, meaningful activities, and regular conversation are as important as physical care. Companionship is a core component of quality elderly care.

**9. Involve the Elderly Person**
Wherever possible, involve your parent in decisions about their care. Preserving dignity and autonomy is fundamental to quality home care.

**10. Consider Professional Support**
Professional home care allows families to step back from 24/7 caregiving and focus on their relationship with their parent. Aethla Care provides licensed, compassionate elderly care across Qatar.`,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]
  if (!post) {
    return (
      <div className="section-pad text-center">
        <h1 className="text-display-sm mb-4">Post Not Found</h1>
        <Link href="/blog" className="btn-primary">← Back to Blog</Link>
      </div>
    )
  }
  return (
    <>
      <section className="relative min-h-[400px] flex items-end pb-12">
        <div className="absolute inset-0" style={{ backgroundImage: `url('${post.img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.5) 60%, transparent 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10">
          <span className="badge-primary mb-3 inline-block">{post.category}</span>
          <h1 className="text-display-md text-white max-w-3xl mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-white/60 text-body-sm">
            <span>✍️ {post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱ {post.readTime} min read</span>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2 prose prose-lg max-w-none">
              {post.content.split('\n\n').map((p, i) => (
                <p key={i} className="text-body-md text-neutral-600 leading-relaxed mb-5"
                  dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              ))}
            </article>
            <aside>
              <div className="card p-6 sticky top-24">
                <h3 className="text-heading-md text-primary-500 mb-3">Need Home Care?</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Book a free consultation with our care advisors today.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book Free Consultation →</Link>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <a href="https://wa.me/97400000000" target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-center block">💬 WhatsApp Us</a>
                </div>
              </div>
            </aside>
          </div>
          <div className="mt-10">
            <Link href="/blog" className="btn-outline">← Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}

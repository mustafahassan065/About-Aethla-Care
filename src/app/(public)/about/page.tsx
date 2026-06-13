import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Aethla Care — Home Healthcare in Qatar',
  description: 'Learn how Aethla Care was built to serve families across Qatar with professional, technology-supported home healthcare — from elderly support to maternity and newborn care.',
}

const values = [
  { title: 'Compassion',        desc: 'Every visit, every interaction — we approach care as though the client is our own family member.' },
  { title: 'Trust',             desc: 'Families let us into their homes. We earn that trust through consistent, honest, reliable service.' },
  { title: 'Dignity',           desc: 'We support clients in a way that preserves their independence and respects who they are.' },
  { title: 'Innovation',        desc: 'Technology helps us coordinate better, document accurately, and keep families in the loop.' },
  { title: 'Family-Centered',   desc: 'Decisions are made with the whole family in mind, not just the person receiving care.' },
  { title: 'Excellence',        desc: 'We hold our team to high professional standards because the families we serve deserve nothing less.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[480px] flex items-end pb-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1600&q=80&auto=format&fit=crop')",
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.65) 60%, rgba(13,43,62,0.30) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> About Aethla Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Healthcare That Meets You at Home, Across Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-xl">We built Aethla Care because families deserved something better than institutional care — something personal, professional, and close to home.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className="h-[420px] rounded-4xl"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1491014187205-de89a6c96bca?w=800&q=80&auto=format&fit=crop')",
                backgroundSize: 'cover', backgroundPosition: 'center',
                boxShadow: '0 20px 60px rgba(27,107,138,0.16)',
              }}
            />
            <div>
              <div className="section-label mb-3">Our Story</div>
              <h2 className="text-display-sm mb-4">A Care Service Shaped by Real Family Needs</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Aethla Care grew out of a straightforward observation: Qatar&apos;s families were navigating complex healthcare needs with very little structured support at home. Whether it was an elderly parent after surgery, a new mother recovering without her extended family nearby, or a child with a disability who needed consistent daily assistance — the gap was clear.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-8">
                We set out to close that gap. Today, Aethla Care supports thousands of households across Doha, Lusail, Al Wakrah, and Al Rayyan with licensed caregivers, a digital care platform, and a coordination team that stays close to every family we work with.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '2,400+', l: 'Families Supported',   bg: 'bg-primary-50', color: 'text-primary-500' },
                  { n: '150+',   l: 'Verified Caregivers',  bg: 'bg-accent-50',  color: 'text-accent-600' },
                  { n: '98%',    l: 'Satisfaction Rate',    bg: 'bg-primary-50', color: 'text-primary-500' },
                  { n: '8+',     l: 'Years in Qatar',       bg: 'bg-accent-50',  color: 'text-accent-600' },
                ].map((s) => (
                  <div key={s.l} className={`rounded-2xl p-5 ${s.bg}`}>
                    <div className={`text-3xl font-extrabold font-poppins ${s.color} leading-none mb-1`}>{s.n}</div>
                    <div className="text-caption text-neutral-500">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Purpose</div>
            <h2 className="text-display-sm mb-4">What Guides Everything We Do</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="card p-8">
              <h3 className="text-heading-xl text-primary-500 mb-3">Our Mission</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To raise the standard of home healthcare in Qatar — providing families with accessible, professionally delivered care that supports independence, health, and dignity at every stage of life.
              </p>
            </div>
            <div className="card p-8">
              <h3 className="text-heading-xl text-accent-600 mb-3">Our Vision</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To be the home healthcare provider Qatar&apos;s families turn to first — known for consistent quality, transparent communication, and care that genuinely makes a difference.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="section-header">
            <div className="section-label justify-center mb-3">Our Values</div>
            <h2 className="text-display-sm mb-4">The Principles Behind Our Care</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card card-hover p-6">
                <h4 className="text-heading-md text-primary-500 mb-2">{v.title}</h4>
                <p className="text-body-sm text-neutral-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-3xl">
          <h2 className="text-display-sm mb-4">Let&apos;s Talk About What Your Family Needs</h2>
          <p className="text-body-lg text-neutral-500 mb-8">A free consultation with our team is the simplest way to find out what support looks like for your situation.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation</Link>
        </div>
      </section>
    </>
  )
}
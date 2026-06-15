import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Aethla Care | Home Healthcare & Wellness in Qatar',
  description: 'Learn about Aethla Care — Qatar\'s premium home healthcare provider offering elderly care, disability support, maternity and newborn care, and wellness services.',
}

const values = [
  { title: 'Compassion', desc: 'We approach every client as we would a member of our own family — with patience, kindness, and genuine care.' },
  { title: 'Trust',      desc: 'Families welcome us into their homes. We earn and maintain that trust through consistent, honest service.' },
  { title: 'Dignity',    desc: 'We support every individual in a way that preserves their independence and respects who they are.' },
  { title: 'Innovation', desc: 'We use technology to coordinate better, document accurately, and keep families informed at every stage.' },
  { title: 'Family-Centered Care', desc: 'Our care decisions are made with the whole family in mind — not just the individual receiving care.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1600&q=80&auto=format&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.65) 60%, rgba(13,43,62,0.30) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> About Aethla Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">
            Delivering Compassionate Healthcare at Home Across Qatar
          </h1>
          <p className="text-body-lg text-white/75 max-w-xl">
            Aethla Care is Qatar&apos;s premium home healthcare and wellness provider — built around families who deserve professional, accessible, and technology-supported care.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="card p-8">
              <h3 className="text-heading-xl text-primary-500 font-poppins mb-3">Our Mission</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To improve quality of life through accessible, compassionate, technology-driven home healthcare services.
              </p>
            </div>
            <div className="card p-8">
              <h3 className="text-heading-xl text-accent-600 font-poppins mb-3">Our Vision</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To become Qatar&apos;s leading provider of integrated home healthcare and wellness services.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="section-header">
            <div className="section-label justify-center mb-3">Our Values</div>
            <h2 className="text-display-sm mb-4">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {values.map((v) => (
              <div key={v.title} className="card card-hover p-6">
                <h4 className="text-heading-md text-primary-500 mb-2">{v.title}</h4>
                <p className="text-body-sm text-neutral-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '2,400+', l: 'Families Supported',  color: '#1B6B8A' },
              { n: '150+',   l: 'Verified Caregivers', color: '#2DA88A' },
              { n: '98%',    l: 'Satisfaction Rate',   color: '#C9A84C' },
              { n: '24/7',   l: 'Care Coordination',   color: '#8B5CF6' },
            ].map((s) => (
              <div key={s.l} className="card p-6 text-center" style={{ borderTop: `4px solid ${s.color}` }}>
                <div className="text-4xl font-extrabold font-poppins mb-1" style={{ color: s.color }}>{s.n}</div>
                <div className="text-body-sm text-neutral-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Book a Free Care Consultation</h2>
          <p className="text-body-lg text-neutral-500 mb-8">
            Speak with our team today and we will help you find the right care for your family.
          </p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Consultation</Link>
        </div>
      </section>
    </>
  )
}
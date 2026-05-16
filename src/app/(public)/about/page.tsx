import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Aethla Care | Home Healthcare & Wellness in Qatar',
  description: 'Learn about Aethla Care\'s mission, vision, values, and the team behind Qatar\'s most trusted home healthcare and wellness provider.',
}

const values = [
  { icon: '💙', title: 'Compassion',       desc: 'Genuine empathy in every interaction, treating every client as family.' },
  { icon: '🤝', title: 'Trust',            desc: 'Building lasting relationships through reliability, honesty, and transparency.' },
  { icon: '👑', title: 'Dignity',          desc: 'Preserving the dignity and independence of every person in our care.' },
  { icon: '💡', title: 'Innovation',       desc: 'Leveraging technology to deliver smarter, safer, better care experiences.' },
  { icon: '👨‍👩‍👧', title: 'Family-Centered', desc: 'Keeping families informed, involved, and at the heart of every decision.' },
  { icon: '✅', title: 'Excellence',       desc: 'Committed to the highest professional standards in everything we do.' },
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.65) 60%, rgba(13,43,62,0.35) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> About Aethla Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Delivering Compassionate Healthcare at Home Across Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg">Built on a foundation of trust, innovation, and genuine care for every family we serve.</p>
        </div>
      </section>

      {/* Mission */}
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
              <h2 className="text-display-sm mb-4">More Than a Provider — We&apos;re Your Family&apos;s Partner</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Aethla Care was founded with a singular vision: to transform home healthcare in Qatar by combining compassionate human care with the best of modern technology. We believe every person deserves dignified, professional, personalized care in the comfort of their own home.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-8">
                Today, we serve thousands of families across Doha, Lusail, Al Wakrah, and Al Rayyan — from supporting our senior community to welcoming new life into the world.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '2,400+', l: 'Families Served', color: 'bg-primary-50 text-primary-500' },
                  { n: '150+',   l: 'Licensed Caregivers', color: 'bg-accent-50 text-accent-600' },
                  { n: '98%',    l: 'Satisfaction Rate', color: 'bg-gold-50 text-yellow-700' },
                  { n: '8+',     l: 'Years in Qatar', color: 'bg-primary-50 text-primary-500' },
                ].map((s) => (
                  <div key={s.l} className={`rounded-2xl p-5 ${s.color.split(' ')[0]}`}>
                    <div className={`text-3xl font-extrabold font-poppins ${s.color.split(' ')[1]} leading-none mb-1`}>{s.n}</div>
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
            <div className="section-label justify-center mb-3">Mission & Vision</div>
            <h2 className="text-display-sm mb-4">Driven by Purpose, Guided by Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="card p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-heading-xl text-primary-500 mb-3">Our Mission</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To improve the quality of life for individuals and families across Qatar through accessible, compassionate, and technology-driven home healthcare services that preserve dignity and promote wellbeing at every stage of life.
              </p>
            </div>
            <div className="card p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-heading-xl text-accent-600 mb-3">Our Vision</h3>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                To become Qatar&apos;s leading provider of integrated home healthcare and wellness services — setting the highest standard for professional, compassionate care that every family in Qatar can trust and depend on.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="section-header">
            <div className="section-label justify-center mb-3">Core Values</div>
            <h2 className="text-display-sm mb-4">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card card-hover p-6 text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
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
          <h2 className="text-display-sm mb-4">Ready to Experience the Aethla Care Difference?</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Let us design a personalized care plan for your family. Book a free consultation today.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation →</Link>
        </div>
      </section>
    </>
  )
}

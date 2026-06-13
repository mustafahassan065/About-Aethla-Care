import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disability Support Services in Qatar | Aethla Care',
  description: 'Home-based disability support across Qatar — personal care, daily assistance, community access, and family respite. Compassionate, consistent, professional.',
}

const services = [
  { title: 'Personal Care Support',       desc: 'Respectful assistance with bathing, grooming, dressing, and daily hygiene routines.' },
  { title: 'Daily Living Assistance',     desc: 'Help with meals, household tasks, and organising the day in a way that works for the individual.' },
  { title: 'Community Participation',     desc: 'Supported access to social activities, appointments, and public life — wherever possible.' },
  { title: 'Transport Assistance',        desc: 'Safe, reliable accompanying support for medical appointments, therapy sessions, or outings.' },
  { title: 'Family Respite Support',      desc: 'Planned breaks for family carers who need time to rest without worrying about the quality of care.' },
  { title: 'Behaviour & Social Support',  desc: 'Structured companionship and activity-based engagement tailored to each individual.' },
]

export default function DisabilitySupport() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Disability Support</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Consistent Support That Respects Who You Are</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Disability support services designed around the individual — not a fixed programme.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Discuss Your Needs</Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Our Approach</div>
              <h2 className="text-display-sm mb-4">Care That Works Around the Individual</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Every person with a disability has a different set of needs, preferences, and goals. Our support workers take the time to understand the individual — not just the diagnosis — before a care arrangement begins.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                We work closely with families, therapists, and healthcare providers to ensure our support fits within a broader care plan. Progress and any concerns are documented through our digital platform so nothing is overlooked.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {services.map((s) => (
                <div key={s.title} className="card p-5">
                  <h4 className="text-heading-sm text-primary-500 mb-1">{s.title}</h4>
                  <p className="text-body-sm text-neutral-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Talk to Us About the Right Level of Support</h2>
          <p className="text-body-lg text-neutral-500 mb-8">We are happy to discuss your situation before any commitment is made.</p>
          <Link href="/contact" className="btn-primary btn-lg">Get in Touch</Link>
        </div>
      </section>
    </>
  )
}
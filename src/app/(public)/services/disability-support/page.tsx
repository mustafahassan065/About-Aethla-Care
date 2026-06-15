import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disability Support in Qatar | Home Disability Care Doha | Aethla Care',
  description: 'Professional disability support services at home across Qatar. Daily support, personal care, social engagement, community participation and family respite.',
  keywords: 'disability support Qatar, home disability care Doha',
}

const services = [
  { title: 'Daily Support',          desc: 'Consistent daily assistance with tasks and routines, structured around what works for the individual.' },
  { title: 'Personal Care',          desc: 'Respectful, dignity-led support with bathing, grooming, dressing, and hygiene routines.' },
  { title: 'Social Engagement',      desc: 'Meaningful activity-based interaction and companionship designed around individual interests and goals.' },
  { title: 'Community Participation',desc: 'Supported access to public life, social activities, therapy sessions, and community events.' },
  { title: 'Transport Assistance',   desc: 'Safe, reliable accompanying support for medical appointments, outings, and day-to-day travel.' },
  { title: 'Family Respite Support', desc: 'Planned relief for family carers who need scheduled time to rest, knowing their loved one is well cared for.' },
]

export default function DisabilitySupport() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Disability Support</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Disability Support</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Home-based disability support services across Qatar — personal care, daily assistance, social engagement, and family respite.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Book a Consultation</Link>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Services Included</div>
              <h2 className="text-display-sm mb-5">Disability Support Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Every person with a disability has different needs, preferences, and goals. Our support workers take the time to understand each individual before a care arrangement begins.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                We work closely with families, therapists, and healthcare providers to ensure our support fits within a broader care plan.
              </p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Get Started</Link>
            </div>
            <div className="flex flex-col gap-4">
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
    </>
  )
}
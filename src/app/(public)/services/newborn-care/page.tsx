import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newborn Baby Care in Qatar | Aethla Care',
  description: 'Professional newborn care specialists in Qatar. Feeding support, sleep routines, baby hygiene, and parent education — at home from day one.',
}

const services = [
  { title: 'Feeding Support',          desc: 'Guidance and hands-on support with breastfeeding, bottle feeding, and building a reliable feeding schedule.' },
  { title: 'Sleep Routine Development', desc: 'Establishing age-appropriate sleep patterns that work for the baby and allow parents to rest.' },
  { title: 'Baby Hygiene & Care',      desc: 'Bathing, nappy changes, umbilical cord care, and monitoring skin health in the early weeks.' },
  { title: 'New Parent Education',     desc: 'Practical guidance on baby cues, safe handling, and what to expect through the first weeks and months.' },
  { title: 'Overnight Newborn Care',   desc: 'A trained specialist takes the overnight shift so parents can sleep — particularly helpful in the first few weeks.' },
  { title: 'Health Monitoring',        desc: 'Observation of weight, feeding patterns, and general health, with clear communication to parents and the healthcare team.' },
]

export default function NewbornCare() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Newborn Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Expert Newborn Care, Right at Home</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Qualified baby nurses who help your newborn settle — and give first-time parents the confidence they need.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Arrange a Baby Nurse</Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">What We Provide</div>
              <h2 className="text-display-sm mb-4">Support for Your Baby and for You</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                The first weeks with a newborn are wonderful and exhausting in equal measure. Our baby nurses bring experience, calm, and practical skill to your home from the very beginning.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Every arrangement is tailored to the baby&apos;s age and feeding method. We document each session so parents always know what happened during overnight shifts or while they were resting.
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
          <h2 className="text-display-sm mb-4">Start Your Baby&apos;s Care Journey</h2>
          <p className="text-body-lg text-neutral-500 mb-8">We can arrange a baby nurse before your due date so everything is ready when you come home.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Consultation</Link>
        </div>
      </section>
    </>
  )
}
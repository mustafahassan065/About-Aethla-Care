import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newborn Baby Care in Qatar | Baby Nurse Doha | Aethla Care',
  description: 'Professional newborn baby care services in Qatar. Feeding support, sleep routines, baby hygiene, new parent education, and overnight newborn care in Doha.',
  keywords: 'newborn care Qatar, baby nurse Doha',
}

const services = [
  { title: 'Feeding Support',            desc: 'Practical guidance and hands-on support with breastfeeding, bottle feeding, and establishing a consistent feeding schedule.' },
  { title: 'Sleep Routines',             desc: 'Developing age-appropriate sleep patterns that work for both baby and parents, with overnight support available.' },
  { title: 'Baby Hygiene',               desc: 'Bathing, nappy changes, umbilical cord care, and monitoring of skin health in the early weeks.' },
  { title: 'New Parent Education',       desc: 'Practical guidance on reading baby cues, safe handling, developmental milestones, and what to expect.' },
  { title: 'Overnight Newborn Care',     desc: 'A trained specialist takes overnight responsibility so parents can rest — particularly valuable in the first weeks.' },
]

export default function NewbornCare() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Newborn Baby Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Newborn Baby Care</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Expert newborn care at home — feeding support, sleep routines, baby hygiene, and new parent education across Qatar.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Arrange a Baby Nurse</Link>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Services Included</div>
              <h2 className="text-display-sm mb-5">Newborn Baby Care Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Our baby nurses bring experience, calm, and practical skill to your home from the very beginning — giving both your newborn and your family the best possible start.
              </p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Book a Baby Nurse</Link>
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
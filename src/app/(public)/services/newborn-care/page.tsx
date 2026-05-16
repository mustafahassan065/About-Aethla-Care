import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Newborn Baby Care in Qatar | Baby Nurse Doha',
  description: 'Certified baby nurses providing 24/7 newborn care, feeding support, sleep routines, and parent education in Doha, Qatar.',
  keywords: ['newborn care Qatar', 'baby nurse Doha', 'night nurse Qatar', 'infant care Doha'],
}
const services = [
  { title: 'Feeding Support', desc: 'Breastfeeding and bottle feeding guidance, schedule establishment, and overnight feeding assistance.' },
  { title: 'Sleep Routine Establishment', desc: 'Expert guidance on healthy sleep patterns to help your baby and family thrive.' },
  { title: 'Baby Hygiene Care', desc: 'Bathing, cord care, skin care, and daily hygiene routines for your newborn.' },
  { title: 'New Parent Education', desc: 'Practical training on newborn care, safe handling, and baby development milestones.' },
  { title: 'Overnight Newborn Care', desc: 'Night nurse services allowing parents to rest while your baby is in expert hands.' },
  { title: 'Developmental Monitoring', desc: 'Regular assessment of feeding, weight gain, and early developmental milestones.' },
]
export default function NewbornCare() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Newborn Baby Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Expert Newborn Baby Care Services in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Certified baby nurses providing 24/7 newborn care, feeding support, sleep routines, and new parent guidance.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book a Baby Nurse</Link>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Newborn Care Services</h2>
              <div className="flex flex-col gap-4">
                {services.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 font-bold text-sm flex-shrink-0">✓</div>
                    <div><strong className="block text-body-md font-semibold font-poppins text-neutral-800 mb-1">{item.title}</strong><p className="text-body-sm text-neutral-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card p-6 sticky top-24">
                <div className="text-4xl mb-3">👶</div>
                <h3 className="text-heading-xl mb-3">Certified Baby Nurses</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Our baby nurses are neonatal care specialists experienced in supporting families from diverse cultures across Qatar. Available from discharge to ongoing monthly support.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book a Baby Nurse →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Welcome Your Newborn with Confidence</h2>
          <p className="text-body-lg text-white/75 mb-8">Let our certified baby nurses guide you through those precious first weeks.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-white btn-lg">📋 Book a Baby Nurse</Link>
            <a href="https://wa.me/97400000000" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">💬 WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  )
}

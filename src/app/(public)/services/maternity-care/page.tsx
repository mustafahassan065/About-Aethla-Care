import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Maternity & Postnatal Care at Home in Qatar | Doha',
  description: 'Professional postnatal recovery support, mother wellness monitoring, and lactation guidance at home in Qatar. Serving Doha, Lusail, Al Wakrah & Al Rayyan.',
  keywords: ['postpartum care Qatar', 'maternity home care Doha', 'postnatal care Qatar', 'lactation support Doha'],
}

const services = [
  { title: 'Postnatal Recovery Support',       desc: 'Expert care to support physical recovery in the critical weeks following childbirth.' },
  { title: 'Mother Wellness Monitoring',        desc: 'Regular health checks, vitals monitoring, and postpartum health tracking at home.' },
  { title: 'Lactation Support Coordination',   desc: 'Guidance on breastfeeding, latch techniques, and feeding schedules from certified specialists.' },
  { title: 'Emotional Wellbeing Support',      desc: 'Compassionate support for postpartum emotional health, including postnatal depression screening.' },
  { title: 'Newborn Integration Support',      desc: 'Helping new mothers confidently care for their newborn while recovering their own strength.' },
  { title: 'Household Support',                desc: 'Light household assistance so new mothers can focus fully on recovery and bonding.' },
]

export default function MaternityCare() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Maternity Care Services</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Postnatal & Maternity Home Care in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Professional postpartum recovery support, mother wellness monitoring, and lactation guidance in the comfort of your home.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book Maternity Care</Link>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Our Maternity Care Services</h2>
              <div className="flex flex-col gap-4">
                {services.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 font-bold text-sm flex-shrink-0">✓</div>
                    <div>
                      <strong className="block text-body-md font-semibold font-poppins text-neutral-800 mb-1">{item.title}</strong>
                      <p className="text-body-sm text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card p-6 sticky top-24">
                <div className="text-4xl mb-3">🤱</div>
                <h3 className="text-heading-xl mb-3">Supporting Every New Mother</h3>
                <p className="text-body-sm text-neutral-500 mb-5">The postpartum period can be both beautiful and challenging. Our certified maternity specialists provide the professional and emotional support every new mother deserves.</p>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {['Certified Postnatal Nurses', 'Lactation Consultants', 'Emotional Wellness Support', 'Multilingual Teams', '24/7 Emergency Line'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-body-sm text-neutral-600">
                      <span className="text-accent-500 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book Free Consultation →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Ready for Postnatal Support?</h2>
          <p className="text-body-lg text-white/75 mb-8">Book a free consultation and let our maternity specialists support your recovery.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-white btn-lg">📋 Book Free Consultation</Link>
            <a href="https://wa.me/97400000000" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">💬 WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Maternity & Postnatal Care in Qatar | Aethla Care',
  description: 'Home-based maternity and postnatal recovery support across Qatar. Wellness monitoring, lactation guidance, and emotional support for new mothers.',
}

const services = [
  { title: 'Postnatal Recovery Support',     desc: 'Hands-on assistance during the recovery period following a natural birth or caesarean section.' },
  { title: 'Mother Wellness Monitoring',     desc: 'Regular checks on blood pressure, wound care, and general health to flag anything that needs medical attention.' },
  { title: 'Lactation Support Coordination', desc: 'Practical help with breastfeeding positioning, supply, and connecting with a lactation consultant when needed.' },
  { title: 'Emotional Wellbeing Support',    desc: 'Attentive care that acknowledges the emotional dimension of the postnatal period, with referrals if concerns arise.' },
  { title: 'Household & Baby Assistance',    desc: 'Light household support and help with the baby so the mother can focus on rest and recovery.' },
  { title: 'Family Education',               desc: 'Guidance for partners and family members on how to support the mother and care for the newborn.' },
]

export default function MaternityCare() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Maternity Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Postnatal Support That Helps New Mothers Recover Well</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Professional, caring support at home during one of the most significant transitions in a family&apos;s life.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Arrange Postnatal Care</Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Our Approach</div>
              <h2 className="text-display-sm mb-4">Caring for the Mother, Not Just the Baby</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                The postnatal period demands as much attention as pregnancy itself. Our maternity care specialists help mothers recover physically, navigate the emotional adjustments, and establish early routines — all in the comfort of home.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Care plans are coordinated with the mother&apos;s obstetrician or midwife and documented through our platform so the healthcare team stays informed.
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
          <h2 className="text-display-sm mb-4">Plan Your Postnatal Care Before You Deliver</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Arranging care in advance means everything is in place from the moment you arrive home.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Consultation</Link>
        </div>
      </section>
    </>
  )
}
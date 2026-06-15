import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Maternity Care in Qatar | Postpartum Care Doha | Aethla Care',
  description: 'Professional maternity and postnatal home care in Qatar. Postnatal recovery support, mother wellness monitoring, lactation support, and emotional wellbeing.',
  keywords: 'postpartum care Qatar, maternity home care Doha',
}

const services = [
  { title: 'Postnatal Recovery Support',      desc: 'Hands-on assistance during the recovery period following a natural birth or caesarean section.' },
  { title: 'Mother Wellness Monitoring',      desc: 'Regular checks on blood pressure, wound healing, and overall health to identify anything requiring attention.' },
  { title: 'Lactation Support Coordination',  desc: 'Practical help with breastfeeding and coordination with a lactation consultant when further support is needed.' },
  { title: 'Emotional Wellbeing Support',     desc: 'Attentive care that acknowledges the emotional dimension of the postnatal period, with referrals where concerns arise.' },
]

export default function MaternityCare() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Maternity Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Maternity Care</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Postnatal recovery support, mother wellness monitoring, lactation support coordination, and emotional wellbeing support — at home across Qatar.</p>
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
              <h2 className="text-display-sm mb-5">Maternity Care Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                The postnatal period demands as much attention as pregnancy itself. Our maternity specialists support mothers through physical recovery and the emotional adjustments of early parenthood — at home.
              </p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Arrange Postnatal Care</Link>
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
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Telehealth Support in Qatar | Aethla Care',
  description: 'Telehealth support services in Qatar — virtual consultations, wellness monitoring, remote chronic care support, and appointment coordination.',
  keywords: 'telehealth Qatar, virtual consultations Doha, remote healthcare Qatar',
}

const services = [
  { title: 'Virtual Consultations',       desc: 'Access to qualified healthcare professionals via video — for routine questions, follow-ups, and guidance without a clinic visit.' },
  { title: 'Wellness Monitoring',         desc: 'Regular remote check-ins for clients managing chronic conditions, with structured follow-up and clear documentation.' },
  { title: 'Remote Chronic Care Support', desc: 'Ongoing remote coordination for conditions such as diabetes, asthma, and hypertension — supporting the treating physician\'s plan.' },
  { title: 'Appointment Coordination',    desc: 'Scheduling, reminders, and accompanying support for in-person medical appointments when required.' },
]

export default function Telehealth() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Telehealth Support</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Telehealth Support</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Virtual consultations, wellness monitoring, remote chronic care support, and appointment coordination — across Qatar.</p>
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
              <h2 className="text-display-sm mb-5">Telehealth Support Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed">Remote healthcare coordination that gives families flexibility without compromising on quality of care or continuity.</p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Set Up Telehealth Support</Link>
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
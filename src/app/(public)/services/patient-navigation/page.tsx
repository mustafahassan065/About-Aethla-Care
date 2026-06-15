import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Patient Navigation & Education in Qatar | Aethla Care',
  description: 'Patient navigation and healthcare education services in Qatar. Insurance guidance, healthcare system navigation, appointment scheduling, and medical information interpretation.',
  keywords: 'patient navigation Qatar, healthcare navigation Doha',
}

const services = [
  { title: 'Insurance Guidance',                desc: 'Practical help understanding your health insurance policy, submitting claims, and following up on approvals.' },
  { title: 'Healthcare System Navigation',      desc: 'Guidance on which providers and pathways are right for your situation within Qatar\'s healthcare system.' },
  { title: 'Appointment Scheduling',            desc: 'Managing bookings across providers, coordinating transport, and arranging interpreter support where needed.' },
  { title: 'Medical Information Interpretation', desc: 'Plain-language explanations of diagnoses, treatment plans, and clinical documents for patients and families.' },
]

export default function PatientNavigation() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Patient Navigation</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Patient Navigation &amp; Education</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Insurance guidance, healthcare system navigation, appointment scheduling, and medical information interpretation — for families across Qatar.</p>
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
              <h2 className="text-display-sm mb-5">Patient Navigation &amp; Education</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed">Our navigators work as a consistent point of contact between the patient, family, and the healthcare providers involved in care — simplifying a complex system.</p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Speak to a Navigator</Link>
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
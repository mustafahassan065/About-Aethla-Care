import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Telehealth Support in Qatar | Aethla Care',
  description: 'Remote healthcare coordination and virtual consultations for families in Qatar. Telehealth support, chronic condition monitoring, and appointment management.',
}

const services = [
  { title: 'Virtual Care Consultations',    desc: 'Access to qualified healthcare professionals via video — for routine questions, follow-ups, and guidance without a clinic visit.' },
  { title: 'Remote Health Monitoring',      desc: 'Regular remote check-ins for clients managing chronic conditions, with structured follow-up and documentation.' },
  { title: 'Chronic Condition Support',     desc: 'Ongoing remote coordination for conditions such as diabetes, asthma, and hypertension — supporting the treating physician\'s plan.' },
  { title: 'Appointment Coordination',      desc: 'Scheduling, reminders, and accompanying support for in-person medical appointments when needed.' },
  { title: 'Medication Follow-Up',          desc: 'Remote monitoring of prescription adherence and coordination with the prescribing team if adjustments are needed.' },
  { title: 'Family Communication Updates',  desc: 'Clear, regular updates to family members wherever they are, through the Aethla Care portal.' },
]

export default function Telehealth() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Telehealth Support</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Healthcare Coordination Without the Clinic Visit</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Remote consultations and ongoing health monitoring for families who need flexibility and continuity.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Set Up Telehealth Support</Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Remote Care</div>
              <h2 className="text-display-sm mb-4">Continuity of Care, From Wherever You Are</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Not every healthcare interaction requires a physical appointment. Our telehealth service gives families in Qatar structured remote access to qualified coordinators and care professionals.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Telehealth works particularly well for clients managing chronic conditions who need regular oversight but not daily in-person visits — and for family members who want to stay involved from abroad.
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
          <h2 className="text-display-sm mb-4">Get Started with Telehealth Support</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Tell us what you need and we will put together a remote care arrangement that works for your family.</p>
          <Link href="/contact" className="btn-primary btn-lg">Talk to a Coordinator</Link>
        </div>
      </section>
    </>
  )
}
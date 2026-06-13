import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Family Portal | Aethla Care Qatar',
  description: 'The Aethla Care family portal gives relatives real-time access to schedules, care notes, billing, and direct communication with the care team — from any device.',
}

const features = [
  { title: 'Live Schedules',         desc: 'See upcoming visits, confirmed timing, and any changes — updated in real time by the care coordination team.' },
  { title: 'Care Notes After Visits', desc: 'Read what the caregiver observed and completed after each session, including any flagged concerns.' },
  { title: 'Caregiver Updates',       desc: 'Direct communication from the caregiver or coordinator if something during a visit needs your attention.' },
  { title: 'Notifications & Alerts',  desc: 'Optional alerts for check-in, check-out, and any status updates so you are always in the loop.' },
  { title: 'Billing Overview',        desc: 'A clear view of invoices, payment history, and what is outstanding — no chasing required.' },
  { title: 'Secure Messaging',        desc: 'A direct, encrypted channel to message your care coordinator with questions or requests.' },
]

export default function FamilyPortal() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Family Portal</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Stay Involved in Your Family Member&apos;s Care — From Anywhere</h1>
          <p className="text-body-lg text-white/75 max-w-xl">The Aethla Care family portal puts visit records, schedules, and your care team one tap away.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Request Portal Access</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">What You Can Access</div>
            <h2 className="text-display-sm mb-4">Everything in One Place</h2>
            <p className="text-body-lg text-neutral-500 max-w-2xl mx-auto">
              Whether you are at home or abroad, the portal gives you a clear, up-to-date view of what is happening with your family member&apos;s care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {features.map((f) => (
              <div key={f.title} className="card card-hover p-6">
                <h3 className="text-heading-md text-primary-500 mb-2">{f.title}</h3>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to access */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max max-w-3xl text-center">
          <div className="section-label justify-center mb-3">Getting Started</div>
          <h2 className="text-display-sm mb-4">Access Is Set Up When You Start With Us</h2>
          <p className="text-body-lg text-neutral-500 mb-8">
            Portal credentials are created for the family when a care arrangement begins. There is nothing to install — the portal works from any browser on any device. Your coordinator will walk you through how to use it at the start.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '1', t: 'Your care arrangement starts', d: 'A coordinator sets up your family account during onboarding.' },
              { n: '2', t: 'You receive login details',    d: 'Secure credentials are sent to the nominated family contact.' },
              { n: '3', t: 'Access from any device',       d: 'Open the portal in a browser and log in — no app required.' },
            ].map((s) => (
              <div key={s.n} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold font-poppins text-white mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>{s.n}</div>
                <h4 className="text-heading-sm mb-2">{s.t}</h4>
                <p className="text-body-sm text-neutral-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Ready to Stay Connected With Your Care Team?</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Start a care arrangement with Aethla Care and portal access comes with it.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation</Link>
        </div>
      </section>
    </>
  )
}
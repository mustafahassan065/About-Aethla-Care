import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Elderly Care at Home in Qatar | Aethla Care',
  description: 'Professional in-home elderly care services across Doha, Lusail, Al Wakrah and Al Rayyan. Aethla Care helps seniors live comfortably and safely at home.',
}

const services = [
  { title: 'Daily Living Assistance',   desc: 'Support with bathing, grooming, dressing, meal preparation, and household routines — as much or as little as needed.' },
  { title: 'Medication Management',     desc: 'Timely reminders and supervision to ensure prescriptions are taken correctly and on schedule.' },
  { title: 'Companionship & Wellbeing', desc: 'Regular social interaction, light activities, and conversation that keeps seniors mentally engaged and emotionally supported.' },
  { title: 'Mobility Assistance',       desc: 'Safe support for moving around the home, transfers, and guided exercises recommended by a physiotherapist.' },
  { title: 'Overnight & Live-In Care',  desc: 'Continuous care through the night or full-time live-in arrangements for seniors who need consistent presence.' },
  { title: 'Post-Hospital Recovery',    desc: 'Structured care following surgery or a hospital stay, coordinated around the discharge plan from the medical team.' },
]

const faqs = [
  {
    q: 'How is a caregiver matched to my parent?',
    a: 'We consider language, experience, personality, and the specific level of care required. A coordinator will speak with you before any introduction is made.',
  },
  {
    q: 'Can the care schedule be adjusted over time?',
    a: 'Yes — we review care plans regularly and adjust hours, tasks, or caregiver assignments as circumstances change.',
  },
  {
    q: 'What if my parent is reluctant to accept help?',
    a: 'This is common. Our coordinators have experience with this and can suggest a gradual introduction that makes the transition easier.',
  },
]

export default function ElderlyCare() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Elderly Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Support That Helps Seniors Stay at Home, Comfortably</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Professional, compassionate care that protects independence and gives the whole family peace of mind.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Get a Care Plan</Link>
            <Link href="/contact" className="btn-ghost btn-lg">Speak with a Coordinator</Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">What We Offer</div>
              <h2 className="text-display-sm mb-4">In-Home Elderly Care Across Qatar</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Most seniors prefer to stay in their own homes as they age. Aethla Care makes that possible by providing reliable daily support — from help with personal care and household tasks to overnight care and post-hospital recovery.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Our caregivers work within routines that suit the individual, not the other way around. Care is coordinated through our digital platform so families always know what is happening and can communicate directly with the care team.
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

      {/* FAQ */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max max-w-3xl">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Questions</div>
            <h2 className="text-display-sm mb-4">Frequently Asked</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-neutral-800 hover:text-primary-500 transition-colors list-none">
                  {f.q}
                  <span className="ml-4 flex-shrink-0 text-2xl text-primary-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-body-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Ready to Arrange Support for Your Parent?</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Start with a free conversation. We will assess your situation and recommend the right level of care.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Free Assessment</Link>
        </div>
      </section>
    </>
  )
}
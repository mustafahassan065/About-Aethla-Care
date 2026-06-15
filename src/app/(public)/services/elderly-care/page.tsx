import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Elderly Care in Qatar | Home Elderly Care Doha | Aethla Care',
  description: 'Professional elderly home care services in Qatar designed to support independence, dignity, safety, and emotional wellbeing. Serving Doha, Lusail, Al Wakrah and Al Rayyan.',
  keywords: 'elderly care Qatar, home elderly care Doha, senior care Qatar',
}

const services = [
  { title: 'Daily Living Assistance', desc: 'Support with bathing, grooming, dressing, meal preparation, and household routines — tailored to what each client needs.' },
  { title: 'Medication Reminders',    desc: 'Timely reminders and supervised administration to ensure prescriptions are taken correctly and on schedule.' },
  { title: 'Companionship',           desc: 'Regular social interaction, conversation, and activity-based engagement to support mental and emotional wellbeing.' },
  { title: 'Mobility Assistance',     desc: 'Safe support for moving around the home, transfers, and guided exercises as recommended by a physiotherapist.' },
  { title: 'Overnight Care',          desc: 'Continuous care through the night for seniors who require consistent supervision or regular overnight assistance.' },
  { title: 'Post-Hospital Support',   desc: 'Structured recovery care following surgery or a hospital stay, coordinated around the discharge plan from the medical team.' },
]

export default function ElderlyCare() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Elderly Care</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Elderly Care</h1>
          <p className="text-body-lg text-white/75 max-w-xl">
            Professional elderly home care services in Qatar designed to support independence, dignity, safety, and emotional wellbeing.
          </p>
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
              <h2 className="text-display-sm mb-5">Home Elderly Care Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Professional elderly home care services in Qatar designed to support independence, dignity, safety, and emotional wellbeing — delivered by verified, compassionate caregivers.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                All care is documented through our digital platform so families can view visit notes, schedules, and updates in real time through the family portal.
              </p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Book a Free Assessment</Link>
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
      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Book a Free Care Consultation</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Contact our team to discuss the right level of elderly care for your family member.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Consultation</Link>
        </div>
      </section>
    </>
  )
}